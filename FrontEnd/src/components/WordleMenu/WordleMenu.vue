<template>
  <div class="default1 container my-0 p-0">
    <WordleCreateJoin 
      :showNow="menuOpen" 
      @createRoom="createRoom()" 
      v-on:joinRoom="joinRoom" 
    />
    <WordleWaitingLobby 
      :showNow="gameWaitState" 
      :lobbyCode="lobbyCode" 
      @leaveGame="() => $emit('leaveGame')"
    />
    <WordleGameEndState 
      :lobbyCode="lobbyCode" 
      :showNow="endGameState" 
      :userInfo="userInfo" 
      :gameState="endGameStateResult"  
      @createRoom="createRoom()"  
      @playAgain="playAgain()" 
      @joinRoom="joinRoom" 
    />
  </div>
</template>

<script>
import WordleCreateJoin from './WordleCreateJoin.vue'
import WordleGameEndState from '../WordleGameStates/WordleGameEndState.vue'
import WordleWaitingLobby from '../WordleGameStates/WordleWaitingLobby.vue'
export default {
  mounted() {

  },
  components: {
    WordleCreateJoin,
    WordleGameEndState,
    WordleWaitingLobby
  },
  name: 'WordleMenu',
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        isHost: false,
        myTurn: false,
        username: ''
      })
    },
    menuOpen: {
      type: Boolean,
      default: false
    },
    gameWaitState: {
      type: Boolean,
      default: false
    },
    endGameState: {
      type: Boolean,
      default: false
    },
    endGameStateResult: {
      type: String,
      default: 'Winner'
    },
    lobbyCode: {
      type: String,
      default: 'No Lobby Code'
    }
  },
  data() {
    return {
      wordList: [],
      maxLenWord: 5,
      wordBeingPlayed: 'about',
      socket: '',
      wordGuessed: 'a',
      listOfGuesses: ['hello', 'about'],
      gameCompleted: false,
      // userInfo: {
      //   isHost: false,
      //   myTurn: false,
      //   username: ''
      // },
      showNow: true
    }
  },
  methods: {
    playAgain() {
      if (this.userInfo)
        this.$emit('playAgain', true)
      // this will then open up wordleOnline and give the user a code to give to the other user
    },
    createRoom() {
      this.$emit('menuOptions', true)
      // this will then open up wordleOnline and give the user a code to give to the other user
    },
    joinRoom(lobbyCode) {
      console.log('lobbyCode', lobbyCode)
      this.$emit('menuOptions', false, lobbyCode)
      // this will open up wordleOnline and join the host who should be waiting, 
        // if the given lobby code exists, if not then it will do nothing
    }
    ,
    leaveGame() {
      this.$emit('leaveGame')
      // this will open up wordleOnline and join the host who should be waiting, 
        // if the given lobby code exists, if not then it will do nothing
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.default1 {
  width: 100%;
  /* height: 100%; */
  background: rgb(31, 31, 32);
}

.CreateLobby {
  border-right: 2px solid black;
}
</style>
