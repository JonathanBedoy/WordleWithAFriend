<template>
  <div class="default1 container my-0 p-0">
    <b-modal
      id="modal-1"
      title="Wordle With Friends"
      no-close-on-esc
      no-close-on-backdrop
      header-close-variant=""
      v-model="showNow"
      hide-header
      hide-footer
    >
      <div class="container">
        <div class="row text-center">
          <span class="wordleWait">Waiting On Player</span>
        </div>
        <div class="row mx-auto  d-flex justify-content-center">
          <b-spinner
            class="my-3"
            variant="secondary"
          ></b-spinner>
        </div>
        <div class="row">
          <b-input-group prepend="Lobby Code:">

            <b-form-input
              readonly
              @click="copyToClipboard()"
              :placeholder="lobbyCode"
            ></b-form-input>

            <b-input-group-append>
              <b-button
                @click="copyToClipboard()"
                variant="outline-secondary"
              >Copy</b-button>
              <!-- <b-button variant="outline-primary">Button</b-button> -->
              <!-- <b-input-group-text>
        <b-icon icon="x" />
      </b-input-group-text> -->
            </b-input-group-append>
          </b-input-group>
          <div class="col mt-3 d-flex justify-content-center">
            <b-button
              @click="leaveGame()"
              variant="outline-danger"
            >Cancel</b-button>
          </div>

          <!-- <b-input-group-text>{{lobbyCode}} <b-button variant="secondary">Copy</b-button>
          </b-input-group-text> -->
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  mounted() {},
  components: {},
  name: "WordleMenu",
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        isHost: false,
        myTurn: false,
        username: "",
      }),
    },
    showNow: {
      type: Boolean,
      default: true,
    },
    gameState: {
      type: String,
      default: "Loser",
    },
    lobbyCode: {
      type: String,
      default: "No Lobby Code",
    },
  },
  data() {
    return {};
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.lobbyCode);
    },
    playAgain() {
      this.$emit("playAgain", "");
    },
    leaveGame() {
      this.$emit("leaveGame");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.default1 {
  width: 100%;
  /* height: 100%; */
  background: rgb(31, 31, 32);
}

.wordleWait {
  font-size: 3em;
  color: rgb(63, 85, 63);
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
