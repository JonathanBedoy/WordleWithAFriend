<template>
  <!-- TODO: rock paper scissors choose who goes first -->
  <div class="container-fluid mainBody m-0 p-0">
    <wordle-menu
      @leaveGame="leaveGame"
      @menuOptions="initializeUser"
      :lobbyCode="lobbyCode"
      :gameWaitState="gameWaitState"
      :userInfo="userInfo"
      @playAgain="playAgain"
      :endGameStateResult="gameStateResult"
      :endGameState="gameState"
      :menuOpen="showMenuOptions"
    />
    <WordleContainer
      @leaveGame="leaveGame"
      :playRevealAnimation="playRowRevealAnimation"
      :shakeRow="shakeWordleRow"
      :userInfo="userInfo"
      @keyboardInput="inputReceived"
      :lettersUsed="lettersUsed"
      :word="wordBeingPlayed"
      :socket="socket"
      :listOfGuesses="listOfGuesses"
      :maxLenWord="maxLenWord"
      :wordGuessed="wordGuessed"
      :gameCompleted="gameCompleted"
    />
    <!-- <div class="button" @click="(getGameFromOtherUser())">click</div> -->
    <!-- <button @click="eraseLocalStor()">Menu</button> -->
    <!-- <button @click="socketEndpoint = 'localhost:5005'">Change Endpoint</button> -->
  </div>
</template>

<script>
import WordleContainer from "../WordleContainer.vue";
import WordleMenu from "../WordleMenu/WordleMenu.vue";

import WordData from "../../assets/words.json";
import WordDictionary from "../../assets/wordListObj.json";
import io from "socket.io-client";

export default {
  mounted() {
    window.addEventListener("keyup", (e) => {
      this.inputReceived(e.key);
    });
  },
  created() {
    // go through word list JSON and filter words with maxLenWord
    // then add those words to this.wordList
    for (let i = 0; i < WordData.length; i++) {
      if (WordData[i].length == this.maxLenWord) {
        this.playableWordList.push(WordData[i]);
      }
    }

    this.wordList = WordDictionary[this.maxLenWord];


    this.wordBeingPlayed =
      this.playableWordList[
        Math.floor(Math.random() * this.playableWordList.length - 1)
      ];
    // console.log(this.wordBeingPlayed);
    this.lobbyCurrentlyActive = window.localStorage.getItem(
      "lobbyCurrentlyActive"
    );
    this.gameWaitState = JSON.parse(
      window.localStorage.getItem("gameWaitState")
    );
    if (this.lobbyCurrentlyActive == "true" || this.gameWaitState) {
      console.log("already in a lobby");
      this.lobbyCode = window.localStorage.getItem("lobbyCode");
    }
    this.userInfo.userId = window.localStorage.getItem("userId");
    this.ConnectToSocket();
    // this.
  },
  data() {
    return {
      playableWordList: [],
      playRowRevealAnimation: false,
      shakeWordleRow: false,
      lettersUsed: {
        correct: [], //'a','b','i','k','f'],
        almostCorrect: [], //'h','q','g','p'],
        badGuess: [], //'s','r','j','l']
      },
      gameWaitState: false,
      gameState: false,
      gameStateResult: "",
      showMenuOptions: true,
      lobbyCode: "No Lobby Code",
      lobbyCurrentlyActive: false,
      users: [],
      wordList: [],
      maxLenWord: 5,
      wordBeingPlayed: "about",
      socket: "",
      wordGuessed: "",
      listOfGuesses: [], //['hello', 'about', 'truth', 'blues', 'great', 'longs'], //['hello', 'about'],
      gameCompleted: false,
      userInfo: {
        isHost: false,
        myTurn: false,
        username: "",
        userId: "",
      },
    };
  },
  name: "WordleOnline",
  components: {
    WordleContainer,
    WordleMenu,
  },
  methods: {
    eraseLocalStor() {
      window.localStorage.removeItem("lobbyCode");
      window.localStorage.removeItem("userId");
    },
    getGameFromOtherUser() {
      this.socket.emit("sendNeedGameBoardData", { roomNum: this.lobbyCode });
    },
    shakeRow() {
      this.shakeWordleRow = true;
      setTimeout(() => {
        this.shakeWordleRow = false;
      }, 1500);
    },
    inputReceived(e) {
      this.socket.emit("sendWordGuessed", {
        usInput: e,
        userInfo: this.userInfo,
        roomNum: this.lobbyCode,
      });
    },
    playAgain() {
      console.log("playing agaim");
      this.wordBeingPlayed =
        this.playableWordList[
          Math.floor(Math.random() * this.playableWordList.length - 1)
        ];
      this.socket.emit("joinRoom", {
        roomCode: this.lobbyCode,
        userId: this.userInfo.userId,
      });
      this.gameWaitState = true;
      // if (this.userInfo.isHost) {
      //   this.wordBeingPlayed = this.playableWordList[Math.floor(Math.random() * this.playableWordList.length - 1)]
      //   this.socket.emit('sendInitWordle', {
      //     maxLenWord: this.maxLenWord,
      //     wordBeingPlayed: this.wordBeingPlayed,
      //     gameCompleted: false,
      //     roomNum: this.lobbyCode,
      //     gameState: false
      //   })
      // }
    },
    initializeUser(isHosting = false, roomCode = "") {
      this.wordBeingPlayed =
        this.playableWordList[
          Math.floor(Math.random() * this.playableWordList.length - 1)
        ];

      if (isHosting) {
        this.socket.emit("createRoom", { userId: this.userInfo.userId });
        // window.localStorage.setItem("waitingForPlayer", true);
        this.userInfo = {
          isHost: true,
          myTurn: true,
          username: "Burrito",
          userId: this.userInfo.userId,
        };
        // also since host we call the wordle init
        // this.socket.emit('sendInitWordle', {
        //   maxLenWord: this.maxLenWord,
        //   wordBeingPlayed: this.wordBeingPlayed,
        //   gameCompleted: false,
        // })
      } else {
        this.socket.emit("joinRoom", {
          roomCode,
          userId: this.userInfo.userId,
        });
        this.userInfo = {
          isHost: false,
          myTurn: false,
          username: "Oxuzi",
          userId: this.userInfo.userId,
        };
      }
    },
    initializeWordle(data) {
      const {
        //wordList = [],
        maxLenWord = 5,
        wordBeingPlayed = "",
        wordGuessed = "",
        listOfGuesses = [], //'hello', 'about'],
        gameCompleted = false,
        gameState = false,
      } = data;
      // console.log("initializing wordle. word is ", wordBeingPlayed);
      // console.log(wordBeingPlayed)
      //this.wordList = wordList,
      this.maxLenWord = maxLenWord;
      this.wordBeingPlayed = wordBeingPlayed;
      this.wordGuessed = wordGuessed;
      this.listOfGuesses = listOfGuesses;
      this.gameCompleted = gameCompleted;
      this.showMenuOptions = false;
      this.gameState = gameState;
      this.lettersUsed.correct.splice(0, this.lettersUsed.correct.length);
      this.lettersUsed.almostCorrect.splice(
        0,
        this.lettersUsed.almostCorrect.length
      );
      this.lettersUsed.badGuess.splice(0, this.lettersUsed.badGuess.length);
    },
    // Connect to Socket and set up listeners
    ConnectToSocket() {
      // lobbyFinished
      // Connect to Socket
      console.log("pointing socket");
      this.socket = io(process.env.VUE_APP_DEV_MODE === 'true' ? process.env.VUE_APP_DEV_SOCKET_ENDPOINT : process.env.VUE_APP_SOCKET_ENDPOINT); //'/')//http://192.168.1.43:5005')//localhost:5005')

      this.socket.on("connected", (data) => {
        // reconnect to room, by passing in the lobbyCode
        // then emit updateWordleBoard
        if (this.userInfo.userId == null) {
          this.userInfo.userId = data.userId;
          window.localStorage.setItem("userId", data.userId);
        } else if (this.lobbyCode != null && this.userInfo.userId != null) {
          console.log("rejoining Room");
          this.gameWaitState = false;
          this.socket.emit("reJoinRoom", {
            roomCode: this.lobbyCode,
            userId: this.userInfo.userId,
          });
        }
        console.log("connected to socket: ", this.userInfo.userId);
      });
      // this means that a user has connected to the lobby, and also gives you the roomNum
      this.socket.on("connectedToLobby", (data) => {
        window.localStorage.setItem("lobbyCode", data.lobbyCode);
        this.lobbyCode = data.lobbyCode;
        this.users = data.users;
        console.log(this.lobbyCode, this.users);
        this.gameWaitState = true;
        window.localStorage.setItem("gameWaitState", this.gameWaitState);
      });
      // this will start the lobby
      this.socket.on("startLobby", ({ turn }) => {
        this.lobbyCurrentlyActive = true;
        window.localStorage.setItem(
          "lobbyCurrentlyActive",
          this.lobbyCurrentlyActive
        );
        console.log("starting Lobby");
        this.showMenuOptions = false;
        this.gameWaitState = false;
        window.localStorage.setItem("gameWaitState", this.gameWaitState);
        this.gameState = false;
        this.userInfo.myTurn = turn == this.userInfo.userId;
        if (turn == this.userInfo.userId) {
          this.wordBeingPlayed =
            this.playableWordList[
              Math.floor(Math.random() * this.playableWordList.length - 1)
            ];
          this.socket.emit("sendInitWordle", {
            maxLenWord: this.maxLenWord,
            wordBeingPlayed: this.wordBeingPlayed,
            gameCompleted: false,
            roomNum: this.lobbyCode,
            userInfo: this.userInfo,
          });
        }
      });
      this.socket.on("lobbyFinished", () => {
        this.socket.emit("leaveRoom", {
          roomNum: this.lobbyCode,
          userId: this.userInfo.userId,
        });
        this.lobbyCurrentlyActive = false;
        window.localStorage.setItem(
          "lobbyCurrentlyActive",
          this.lobbyCurrentlyActive
        );
      });
      this.socket.on("initWordle", (data) => {
        this.initializeWordle(data);
      });
      // updates the current word being played
      this.socket.on("updateCurrentWord", (data) => {
        // this will essentially reset the game so,
        // everything has to be set back to default
        this.wordBeingPlayed = data.updatedWord;
      });
      // updates the current guess
      this.socket.on("updateWordGuessed", (data) => {
        this.changecurrText(data.usInput);
      });
      this.socket.on("updateUserTurns", () => {
        console.log("changing user turns");
        this.userInfo.myTurn = !this.userInfo.myTurn;
      });
      this.socket.on("sendOutCurrentGame", () => {
        console.log("sending current game to other user user turns");
        this.socket.emit("sendCurrentGame", {
          roomNum: this.lobbyCode,
          lettersUsed: this.lettersUsed,
          gameWaitState: this.gameWaitState,
          gameState: this.gameState,
          gameStateResult: this.gameStateResult,
          showMenuOptions: false,
          users: this.users,
          maxLenWord: this.maxLenWord,
          wordBeingPlayed: this.wordBeingPlayed,
          wordGuessed: this.wordGuessed,
          listOfGuesses: this.listOfGuesses,
          gameCompleted: this.gameCompleted,
          userInfo: {
            isHost: this.userInfo["isHost"] ? false : true,
            myTurn: this.userInfo["myTurn"] ? false : true,
            username: "",
          },
        });
      });
      this.socket.on("updateBoard", (data) => {
        console.log("updating current game board", data);

        this.updateWordleBoard(data);
      });
      this.socket.on("resetClient", () => {
        // reset localstorage
        this.gameWaitState = false;
        window.localStorage.setItem("gameWaitState", this.gameWaitState);
        this.showMenuOptions = true;
        this.lobbyCurrentlyActive = false;
        window.localStorage.setItem(
          "lobbyCurrentlyActive",
          this.lobbyCurrentlyActive
        );
        // this.initializeWordle(data);
      });
    },
    updateWordleBoard(data) {
      const {
        gameWaitState,
        lettersUsed,
        wordGuessed,
        gameState,
        // gameStateResult,
        users,
        maxLenWord,
        showMenuOptions,
        wordBeingPlayed,
        listOfGuesses,
        gameCompleted,
        userInfo = this.userInfo,
      } = data;
      this.playRowRevealAnimation = false;
      this.lettersUsed = lettersUsed; //{
      //   correct: ['a','b','i','k','f'],//'a','b','i','k','f'],
      //   almostCorrect: ['h','q','g','p'],//'h','q','g','p'],
      //   badGuess: ['s','r','j','l']//'s','r','j','l']
      // }//lettersUsed
      this.wordGuessed = wordGuessed;
      this.lettersUsed;
      this.gameWaitState = gameWaitState;
      this.gameState = gameState;
      // this.gameStateResult = gameStateResult;
      this.showMenuOptions = showMenuOptions;
      this.users = users;
      // this.users.splice(0, 0);
      this.maxLenWord = maxLenWord;
      this.wordBeingPlayed = wordBeingPlayed;
      this.listOfGuesses = listOfGuesses;
      this.listOfGuesses.splice(0, 0);
      this.gameCompleted = gameCompleted;
      this.userInfo.myTurn = userInfo.myTurn;
      // this.updateLettersUsed();
    },
    // takes input from user and computes what is shown
    changecurrText(usInput) {

      if (this.gameCompleted || this.playRowRevealAnimation) return;

      // the input was a letter
      if (
        usInput.length == 1 &&
        usInput.toUpperCase() != usInput.toLowerCase()
      ) {
        // user has enough room to input another char
        if (this.wordGuessed.length < this.maxLenWord) {
          this.wordGuessed += usInput;
        }
      }

      // delete the last letter of the current guess
      if (usInput == "Backspace") {
        this.wordGuessed = this.wordGuessed.slice(
          0,
          this.wordGuessed.length - 1
        );
      }
      // check if the word is correct size
      // check if the word is correct (end the game if it is correct)
      // if not correct word then add it to the list
      let validWord = this.wordList.findIndex(
        (currWord) => currWord === this.wordGuessed
      );
      let currMyTurn = this.userInfo.myTurn;

      if (
        usInput == "Enter" &&
        this.wordGuessed.length == this.maxLenWord &&
        validWord != -1
      ) {

        // this.userInfo.myTurn = !this.userInfo.myTurn

        if (this.wordGuessed == this.wordBeingPlayed) {
          this.gameStateResult = !this.userInfo.myTurn ? "Loser" : "Winner";
          this.playRowRevealAnimation = true;
          setTimeout(() => {
            this.playRowRevealAnimation = false;

            console.log("this person has ", this.gameStateResult);
            this.gameCompleted = true;
            this.gameState = true;
            this.socket.emit("gameFinished", { roomNum: this.lobbyCode });
          }, this.maxLenWord * 600);

          //     gameState: false,
          // gameStateResult: 'Winner',
        } else {
          this.playRowRevealAnimation = true;

          setTimeout(() => {
            this.playRowRevealAnimation = false;
            
            if (currMyTurn) {
              this.listOfGuesses.push(this.wordGuessed);
              
              this.updateLettersUsed();
              this.wordGuessed = "";
              console.log("sending user turns");
              this.socket.emit("sendUpdatedStateAndChangeTurns", {
                userInfo: this.userInfo,
                roomNum: this.lobbyCode,
                lettersUsed: this.lettersUsed,
                wordGuessed: this.wordGuessed,
                gameState: this.gameState,
                // gameStateResult: this.gameStateResult,
                users: this.users,
                listOfGuesses: this.listOfGuesses,
                gameCompleted: this.gameCompleted,
              });
              // this.socket.emit("sendUserTurns", {
              //   userInfo: this.userInfo,
              //   roomNum: this.lobbyCode,
              // });
            }
          }, this.maxLenWord * 500);
        }

        // Before this happens, we need to play the animation
      } else if (
        usInput == "Enter" &&
        this.wordGuessed.length == this.maxLenWord &&
        validWord == -1
      ) {
        this.displayToast();
        this.shakeRow();
      }
      if (!this.playRowRevealAnimation && currMyTurn)
        this.socket.emit("sendUpdatedState", {
          userInfo: this.userInfo,
          roomNum: this.lobbyCode,
          lettersUsed: this.lettersUsed,
          wordGuessed: this.wordGuessed,
          gameState: this.gameState,
          // gameStateResult: this.gameStateResult,
          users: this.users,
          listOfGuesses: this.listOfGuesses,
          gameCompleted: this.gameCompleted,
        });
    },
    updateLettersUsed() {
      for (let index = 0; index < this.wordGuessed.length; index++) {
        let letter = this.wordGuessed[index];

        if (letter == this.wordBeingPlayed[index]) {
          if (
            this.lettersUsed.correct.findIndex((val) => val == letter) == -1
          ) {
            let almostIndex = this.lettersUsed.almostCorrect.findIndex(
              (val) => val == letter
            );
            if (almostIndex != -1) {
              this.lettersUsed.almostCorrect.splice(almostIndex, 1);
            }
            this.lettersUsed.correct.push(letter);
          }
        } else if (this.wordBeingPlayed.indexOf(letter) != -1) {
          if (
            this.lettersUsed.almostCorrect.findIndex((val) => val == letter) ==
              -1 &&
            this.lettersUsed.correct.findIndex((val) => val == letter) == -1
          ) {
            this.lettersUsed.almostCorrect.push(letter);
          }
        } else {
          if (this.lettersUsed.badGuess.indexOf(letter) == -1) {
            this.lettersUsed.badGuess.push(letter);
          }
        }
      }
    },
    displayToast(
      msg = "Not in word List",
      displayTime = 1000,
      variant = "danger"
    ) {
      this.$bvToast.toast(`${msg}`, {
        noCloseButton: true,
        autoHideDelay: displayTime,
        appendToast: true,
        toaster: "b-toaster-top-center",
        variant: variant,
      });
    },
    leaveGame() {
      this.socket.emit("cancelGame", {
        userInfo: this.userInfo,
        roomNum: this.lobbyCode,
      });
    },
  },
};
</script>

<style>
.mainBody {
  width: 100%;
  background-color: rgb(0, 0, 0);
  min-height: 100vh;
  height: 100%;
  /* font-family: 'Baloo 2', cursive; */
  color: white;
}

html,
body {
  height: 100%;
  /* box-sizing: border-box; */
  background-color: rgb(189, 107, 107) !important;
}
</style>
