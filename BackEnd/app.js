// TODO: later... delete rooms no longer in use
// TODO: remove both from room sock
// TODO: when user is waiting they should be able to leave and when they,
//       come back they should be able to come back to room initialized
const express = require("express");
var app = express();
const body = require("body-parser");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

var randomstring = require("randomstring");

// will store all the rooms
let rooms = [];


var server = app.listen(process.env.PORT);
console.log(`App is up and running at http://localhost:${process.env.PORT}`)
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const history = require("connect-history-api-fallback");

app.use(history());

app.use(express.static("public"));

app.use(body.urlencoded({ extended: false }));
app.use(body.json());

io.on("connection", function (socket) {
  socket.on("disconnect", (sock) => {
    console.log("disconnect", socket.id);
  });

  console.log(socket.id);
  let userId = createUser();
  socket.emit("connected", { userId: userId });

  socket.on("createRoom", (data) => {
    let roomNum = createRoom();
    socket.join(roomNum);
    addToRoom(roomNum, data.userId);
    console.log('creacting room: ', roomNum)

    socket.emit("connected", "connected to room");
    io.to(roomNum).emit("connectedToLobby", {
      lobbyCode: roomNum,
      users: rooms[roomNum].users,
    });
  });

  socket.on("joinRoom", (data) => {
    const { roomCode, userId } = data;
    if (roomExists(roomCode)) {
      socket.join(roomCode);
      addToRoom(roomCode, userId);
      // socket.emit('connected', 'connected to room');
      io.to(roomCode).emit("connectedToLobby", {
        lobbyCode: roomCode,
        users: rooms[roomCode].users,
      });
      if (rooms[roomCode].users.length == 2) {
        rooms[roomCode].currentlyActive = true;
        io.to(roomCode).emit("startLobby", { turn: rooms[roomCode].users[0] });
      }
    }
  });

  socket.on("reJoinRoom", (data) => {
    const { roomCode, userId } = data;
    if (
      roomExists(roomCode) &&
      isUserInRoom(roomCode, userId)
    ) {
      socket.join(roomCode);
      console.log("user is rejoing room");
      socket.emit("updateBoard", getCurrStateWithProperUserInfo(roomCode, userId));
      // socket.broadcast.to(roomCode).emit("sendOutCurrentGame", data);
    }
  });

  socket.on("sendInitWordle", (data) => {
    console.log(`initing wordle for room ${data.roomNum}`);
    initRoom(data.roomNum, data)
    io.to(data.roomNum).emit("initWordle", rooms[data.roomNum].currState);
  });

  socket.on("sendNeedGameBoardData", (data) => {
    console.log(
      `sending other User in this room the current data: ${data.roomNum}`
    );
    socket.broadcast.to(data.roomNum).emit("sendOutCurrentGame", data);
    // io.to(data.roomNum).emit('initWordle', data);
  });

  socket.on("sendCurrentGame", (data) => {
    console.log(
      `sending other User in this room the current data: ${data.roomNum}`
    );
    socket.broadcast.to(data.roomNum).emit("updateBoard", data);
    // io.to(data.roomNum).emit('initWordle', data);
  });

  socket.on("sendWordGuessed", (data) => {
    if (roomExists(data.roomNum) && data.userInfo.userId == rooms[data.roomNum].currState.userInfo.userId) {
      io.to(data.roomNum).emit("updateWordGuessed", data);
    }
  });

  socket.on("sendUpdatedState", (data) => {
    if (roomExists(data.roomNum) && data.userInfo.userId == rooms[data.roomNum].currState.userInfo.userId) {
      let cloneData = {...data}
      delete cloneData.userInfo
      updateState(data.roomNum, cloneData)
      // io.to(data.roomNum).emit("updateWordGuessed", data);
    }
    if(roomExists(data.roomNum) && data.userInfo.myTurn && (data.userInfo.userId !== rooms[data.roomNum].currState.userInfo.userId)) {
      io.to(data.roomNum).emit("initWordle", rooms[data.roomNum].currState);
    }
  });

  socket.on("sendUserTurns", (data) => {
    console.log("changing user turns")// + data.userInfo.userId, rooms[data.roomNum].currState.userInfo.userId);
    if (data.userInfo.userId == rooms[data.roomNum].currState.userInfo.userId) {
      changeUsers(data.roomNum)
      io.to(data.roomNum).emit("updateUserTurns");
      io.to(data.roomNum).emit("updateBoard", getCurrStateNoUsers(data.roomNum));
    }
  });
  socket.on("sendUpdatedStateAndChangeTurns", (data) => {
    if (roomExists(data.roomNum) && data.userInfo.userId == rooms[data.roomNum].currState.userInfo.userId) {
      let cloneData = {...data}
      delete cloneData.userInfo
      updateState(data.roomNum, cloneData)
      changeUsers(data.roomNum)
      io.to(data.roomNum).emit("updateUserTurns");
      io.to(data.roomNum).emit("updateBoard", getCurrStateNoUsers(data.roomNum));
      // io.to(data.roomNum).emit("updateWordGuessed", data);
    }
    // if(roomExists(data.roomNum) && data.userInfo.myTurn && (data.userInfo.userId !== rooms[data.roomNum].currState.userInfo.userId)) {
    //   io.to(data.roomNum).emit("initWordle", rooms[data.roomNum].currState);
    // }
  });
// 
  socket.on("gameFinished", (data) => {
    io.to(data.roomNum).emit("lobbyFinished");
    rooms[data.roomNum].currentlyActive = false;
    delete rooms[data.roomNum]
    createRoom(data.roomNum)
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.roomNum);
    // const clients = io.sockets.adapter.rooms.get(data.roomNum);
    removeFromRoom(data.roomNum, data.userId);
  });

  socket.on("cancelGame", (data) => {
    // socket.leave(data.roomNum);
    io.to(data.roomNum).emit("resetClient");
  });
});

let createUser = () => {
  let b = uuidv4();
  return b;
};

let createRoom = (customRoomNum=-1) => {
  // let b = uuidv4()
  let b = randomstring.generate(5);
  while (roomExists(b)) {
    b = randomstring.generate(5);
  }
  if (customRoomNum !== -1) {
    b=customRoomNum
  }
  rooms[b] = {
    users: [],
    currentlyActive: false,
    currState: {
      gameWaitState: true,
      lettersUsed: {
        correct: [],
        almostCorrect: [],
        badGuess: [],
      },
      wordGuessed: 'qwe',
      gameState: false,
      gameStateResult: 'tie',
      users: [],
      maxLenWord: 5,
      wordBeingPlayed: '',
      listOfGuesses: [],
      gameCompleted: false,
      userInfo: {
        isHost: false,
        myTurn: false,
        username: '',
        userId: ''
      },
    },
  };
  return b;
};

let initRoom = (b, options) => {
  if(rooms[b]) {
    rooms[b].currState = {
      lettersUsed: {
        correct: [],
        almostCorrect: [],
        badGuess: [],
      },
      wordGuessed: '',
      maxLenWord: options.maxLenWord,
      wordBeingPlayed: options.wordBeingPlayed,
      gameCompleted: options.gameCompleted,
      listOfGuesses: [],
      userInfo: {
        isHost: options.userInfo.isHost,
        myTurn: options.userInfo.myTurn,
        username: '',
        userId: options.userInfo.userId
      }
    }
  }
}

let updateState = (b, options) => {
  if(rooms[b]) {
    rooms[b].currState = {
      ...rooms[b].currState, ...options
    }
  }
}

let changeUsers = (b) => {
  if(rooms[b]) {
    if (rooms[b].currState.userInfo.userId == rooms[b].users[0]) {
      rooms[b].currState.userInfo.userId = rooms[b].users[1]
    } else {
      rooms[b].currState.userInfo.userId = rooms[b].users[0]
    }
  }
}

let getCurrStateNoUsers = (b) => {
  if (rooms[b]) {
    let temp = {...rooms[b].currState}
    delete temp.userInfo
    return temp
  }
}

let getCurrStateWithProperUserInfo = (b, userId) => {
  if (rooms[b]) {
    let temp = {...rooms[b].currState, userInfo: {myTurn: rooms[b].currState.userInfo.userId == userId, userId}}
    // if (rooms[b].currState.gameCompleted && rooms[b].currState.userInfo.userId != userId) {
    //   if (rooms[b].currState.gameStateResult == 'Winner') {
    //     temp.gameStateResult = 'Loser'
    //   } else if(rooms[b].currState.gameStateResult == 'Loser') { 
    //     temp.gameStateResult = 'Winner'
    //   }
    // }
    
    // temp.userInfo.myTurn = temp.userInfo.userId == userId
    // temp.userInfo.userId = userId
    return temp
  }
}

let addToRoom = (b, playerUUid) => {
  if (rooms[b]) {
    rooms[b].users.push(playerUUid);
  }
};
let removeFromRoom = (b, playerUUid) => {
  if (rooms[b]) {
    let index = rooms[b].users.indexOf(playerUUid);
    if (index != -1) {
      rooms[b].users.splice(index, 1);
      return true;
    }
  }
  return false;
};
let roomExists = (b) => {
  return rooms[b] ? true : false;
};
let canJoinRoom = (b, playerUUid) => {
  if (rooms[b].users.length == 2 && rooms[b].users.indexOf(playerUUid) != -1) {
    return true;
  }
  return rooms[b].users.length < 2;
};
let isUserInRoom = (b, playerUUid) =>{
  return rooms[b].users.indexOf(playerUUid) != -1
}
