<template>
  <div class="default1 container my-0 p-0">
    <b-modal id="modal-1" title="Wordle With Friends" no-close-on-esc no-close-on-backdrop header-close-variant="" v-model="showNow" hide-header hide-footer>
      <div class="container">
        <div class="row mx-auto">
          <span class="mx-auto" :class="gameState">{{gameState}}</span>
        </div>
        <div class="row mx-auto">
          <div class="col d-flex justify-content-center">
            <b-button type="button" :disabled="!true" @click="playAgain()" class="mx-auto my-4  btn btn-success">
              Play Again
            </b-button>
          </div>
          <div class="col d-flex justify-content-center">
            <button type="button" @click="newLobby()" class="mx-auto my-4 btn btn-success">
              New Lobby
            </button>
          </div>
        </div>
        <div class="row  mx-auto" style="border-top: 1px solid black">
          <div class="col w-50">
            <div class="row mt-3">
              <span class="mx-auto">
                <b>Join New Lobby</b>
              </span>
            </div>
            <div class="row  mx-auto">
              <div class="input-group mt-3 mb-4">
                <input v-model="currLobbyCode" type="text" class="form-control" placeholder="Lobby Code" aria-label="Username" aria-describedby="basic-addon1">
                <button type="button" @click="joinRoom()" class="mx-auto  btn btn-success">
                  Join
                </button>
              </div>

            </div>
            <div class="row">

            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  mounted() {

  },
  components: {

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
    showNow: {
      type: Boolean,
      default: true
    },
    gameState: {
      type: String,
      default: 'Loser'
    },
    lobbyCode: {
      type: String,
      default: 'No Lobby Code'
    }
  },
  data() {
    return {
      currLobbyCode: ''
    }
  },
  methods: {
    newLobby() {
      this.$emit('createRoom', '')
    },
    playAgain() {
      this.$emit('playAgain', '')
    },
    joinRoom() {
      if (this.currLobbyCode != '')
        this.$emit('joinRoom', this.currLobbyCode)
      this.currLobbyCode = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.default1 {
  width: 100%;
  background: rgb(31, 31, 32);
}

.Winner {
  font-size: 3em;
  color: rgb(101, 196, 101);
  /* -webkit-text-stroke: 1px rgb(143, 158, 137); */
  font-weight: bold;
}

.Loser {
  font-size: 3em;
  color: rgb(110, 39, 39);
  -webkit-text-stroke: 1px rgb(95, 70, 64);
  font-weight: bold;
}
</style>
