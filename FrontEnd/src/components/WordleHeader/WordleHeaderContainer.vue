<template>
  <div class="container text-center  mb-3 w-100 p-0">
    <div class="row title1 text-center m-0 py-2 mb-3 w-100 p-0">
      <b-col
        cols="0"
        sm="0"
        md="2"
      ></b-col>
      <b-col
        cols="10"
        sm="10"
        md="8"
      >
        <span class="mx-auto">Wordle With Friends</span>
      </b-col>
      <b-col
        cols="2"
        sm="2"
        md="2"
      >
        <b-iconstack
          @click="() => $emit('leaveGame')"
          font-scale="1"
          class="exitBtn"
        >
          <b-icon
            stacked
            icon="box-arrow-right"
            scale="1"
          ></b-icon>
          <!-- <b-icon v-if="userInfo.myTurn" stacked icon="fullscreen" animation="" shift-v="-0.2" scale="1" color="#464349"></b-icon>
            <b-icon v-if="userInfo.myTurn" stacked icon="dot" animation="fade" shift-v="-5.5" scale="1.2" color="#a2b9a2"></b-icon> -->
        </b-iconstack>
      </b-col>

    </div>

    <div class="container p-0">
      <div class="row mx-auto d-flex justify-content-center">
        <div class="col-md-2 col-4 p-0">
          <b-iconstack font-scale="3">
            <b-icon
              stacked
              icon="person-fill"
              color="#749774"
              scale="1"
            ></b-icon>
            <b-icon
              v-if="userInfo.myTurn"
              stacked
              icon="fullscreen"
              animation=""
              shift-v="-0.2"
              scale="1"
              color="#464349"
            ></b-icon>
            <b-icon
              v-if="userInfo.myTurn"
              stacked
              icon="dot"
              animation="fade"
              shift-v="-5.5"
              scale="1.2"
              color="#a2b9a2"
            ></b-icon>
          </b-iconstack>
          <p class="mx-auto">You</p>
        </div>
        <div class="col-md-2 col-4 p-0">
          <b-iconstack
            font-scale="3"
            animation=""
          >
            <b-icon
              v-if="userInfo.myTurn"
              stacked
              icon="arrow-left"
              color="white"
              shift-v="-3"
              scale="1"
            ></b-icon>
            <b-icon
              v-if="!userInfo.myTurn"
              stacked
              icon="arrow-right"
              color="white"
              shift-v="-3"
              scale="1"
            ></b-icon>
            <!-- <b-icon v-if="!myTurn" stacked icon="circle" animation="" shift-v="-0.2" scale="1" color="#464349"></b-icon>
            <b-icon v-if="!myTurn" stacked icon="dot" animation="fade" shift-v="-5.5" scale="1.2" color="#a2b9a2"></b-icon> -->
          </b-iconstack>
        </div>
        <div class="col-md-2 col-4 p-0">
          <b-iconstack font-scale="3">
            <b-icon
              stacked
              icon="person-fill"
              variant="danger"
              scale="1"
            ></b-icon>
            <b-icon
              v-if="!userInfo.myTurn"
              stacked
              icon="fullscreen"
              animation=""
              shift-v="-0.2"
              scale="1"
              color="#464349"
            ></b-icon>
            <b-icon
              v-if="!userInfo.myTurn"
              stacked
              icon="dot"
              animation="fade"
              shift-v="-5.5"
              scale="1.2"
              color="#a2b9a2"
            ></b-icon>
          </b-iconstack>
          <p class="">Opponent</p>
        </div>
      </div>
    </div>

    <!-- <i class="fa-solid fa-swords"></i> -->
  </div>
</template>

<script>
// person-fill

export default {
  created() {
    this.displayText = this.currentLetter;
  },
  name: "WordleBox",
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          isHost: false,
          myTurn: false,
          username: "",
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.exitBtn {
  color: #a23939;
  transition: 1s;
}
.exitBtn:hover {
  cursor: pointer;
  color: #dc3545;
}

.title1 {
  background-color: #161515;
  font-size: 1.5em;
  border-bottom: 2px solid rgba(0, 0, 0, 0.253);
  /* box-shadow: 0 0.05em 0.01em 0 rgb(0 0 0 / 20%), 0 0.1em 0.2em 0 hsl(0deg 15% 70% / 19%); */
  /* color: #749774; */
}

@media only screen and (max-width: 535px) {
}

@media only screen and (max-width: 360px) {
  .title1 {
    background-color: #151516;
    font-size: .8em;
    border-bottom: 2px solid rgba(0, 0, 0, 0.253);
    /* box-shadow: 0 0.05em 0.01em 0 rgb(0 0 0 / 20%), 0 0.1em 0.2em 0 hsl(0deg 15% 70% / 19%); */
    /* color: #749774; */
  }
}

</style>
