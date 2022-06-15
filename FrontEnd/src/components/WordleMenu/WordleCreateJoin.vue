<template>
  <div class="default1 m-0 container my-0 p-0">

    <b-modal id="modal-1" class="m-0 py-5 " style="padding: 0!important;"   hide-header no-close-on-esc no-close-on-backdrop v-model="showNow" hide-footer>
      <div class="container m-0 p-0 pb-3">
        <div class="row m-0 p-0 wordleTitle">
          <span class="mx-auto">
            Wordle With Friends
          </span>
        </div>
        <div class="row mt-4">
          <div class="col CreateLobby">
            <div class="row">
              <span class="mx-auto">
                <b>Create Lobby</b>
              </span>
            </div>
            <div class="row">
              <button type="button" @click="createRoom()" class="mx-auto px-0 my-4 w-50 btn btn-success">
                Create
              </button>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <span class="mx-auto">
                <b>Join Lobby</b>
              </span>
            </div>
            <div class="row mx-auto">
              <div class="input-group mt-3 mb-4 ">
                <input v-model="lobbyCode" type="text" class="form-control" placeholder="Lobby Code" aria-label="Username" aria-describedby="basic-addon1">
              </div>
            </div>
            <div class="row">
              <button type="button" @click="joinRoom()" class="mx-auto px-0 w-50 btn btn-success">
                Join
              </button>
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
    showNow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      lobbyCode: '',
      wordList: [],
      maxLenWord: 5,
      wordBeingPlayed: 'about',
      socket: '',
      wordGuessed: 'a',
      listOfGuesses: ['hello', 'about'],
      gameCompleted: false,
      userInfo: {
        isHost: false,
        myTurn: false,
        username: ''
      }
    }
  },
  methods: {
    createRoom() {
      this.$emit('createRoom', '')
    },
    joinRoom() {
      if (this.lobbyCode != '') 
        this.$emit('joinRoom', this.lobbyCode)
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



.wordleTitle {
  font-size: 1.7em;
  /* border-bottom: 1px solid black; */
  font-weight: 700;
}



.CreateLobby {
  border-right: 2px solid black;
}

@media only screen and (max-width: 440px) {
  .wordleTitle {
    font-size: 1.4em;
  /* border-bottom: 1px solid black; */
  font-weight: 700;
  }
  .CreateLobby {
  border-right: 1px solid rgb(151, 142, 142);
}
}
</style>
