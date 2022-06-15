<template>
  <div
    class="default1 container my-0 p-0"
    style="height: 100%"
  >

    <WordleHeader :userInfo="userInfo" @leaveGame="() => $emit('leaveGame')" />
    <!-- <button @click="scrollDownContainer()">click</button> -->
    <div id="scrollableContainer" class="m-0 p-0">
      <div
        class="m-0 p-0 row mb-2 d-flex justify-content-center mx-auto "
        v-for="(currWord, currIndex) in listOfGuesses"
        :key="currWord+currIndex"
      >

        <WordleBox
          v-for="(item, index) in word"
          :key="index"
          :rowCompleted="true"
          :correctLetter="item"
          :currentLetter="currWord[index]"
          :correctText="word"
        />

      </div>
      <div
        v-if="!gameCompleted"
        class=" row d-flex justify-content-center mx-auto"
        :class="{'shake': shakeRow}"
      >
        <WordleBox
          v-for="(item, index) in word"
          :key="index"
          :animateBoxManually="makeGuessFlip[index]"
          :rowCompleted="gameCompleted"
          :correctLetter="item"
          :currentLetter="wordGuessed[index]"
          :correctText="word"
        />
      </div>
    </div>

    <div class="keyboardContainer">
      <wordleKeyboard
        @keyboardInput="keyboardInput"
        :keysState="keysUsedArray"
        :keys="keys"
      />
    </div>

  </div>
</template>

<script>
import WordleBox from "./WordleBox.vue";
import wordleKeyboard from "./WordleKeyboard/WordleKeyboardContainer/WordleKeyboardContainer.vue";
import WordleHeader from "./WordleHeader/WordleHeaderContainer.vue";
export default {
  created() {
    this.makeGuessFlip.fill(false, 0, this.maxLenWord);
  },
  components: {
    WordleBox,
    wordleKeyboard,
    WordleHeader,
  },
  name: "WordleContainer",
  props: {
    playRevealAnimation: {
      type: Boolean,
      default: false,
    },
    shakeRow: {
      type: Boolean,
      default: false,
    },
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
    lettersUsed: {
      type: Object,
      default: () => {
        return {
          correct: ["a", "b", "i", "k", "f"],
          almostCorrect: ["h", "q", "g", "p"],
          badGuess: ["s", "r", "j", "l"],
        };
      },
    },
    maxLenWord: {
      type: Number,
      default: 5,
    },
    word: {
      type: String,
      default: "about",
    },
    listOfGuesses: {
      type: Array,
      default: () => [],
    },
    wordGuessed: {
      type: String,
      default: "",
    },
    gameCompleted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      makeGuessFlip: [],
      shakeRow1: false,
      keys: [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
      ],
      // word: 'abert',
      // listOfGuesses: ['hello', 'about'],
      // wordGuessed: 'a',
      // gameCompleted: false
    };
  },
  computed: {
    keysUsedArray() {
      // let keyStates = []
      let keyArray = [
        // 4 states: 0 have not used key, 1 key not in word, 2 key in word wrong place, 3 key correctly used
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      for (let i = 0; i < this.keys.length; i++) {
        for (let j = 0; j < this.keys[i].length; j++) {
          // keyStates[keys[i][j]] =
          let currKeyState = 0;
          if (
            this.lettersUsed.correct.findIndex(
              (val) => this.keys[i][j] == val
            ) != -1
          ) {
            currKeyState = 3;
          } else if (
            this.lettersUsed.almostCorrect.findIndex(
              (val) => this.keys[i][j] == val
            ) != -1
          ) {
            currKeyState = 2;
          } else if (
            this.lettersUsed.badGuess.findIndex(
              (val) => this.keys[i][j] == val
            ) != -1
          ) {
            currKeyState = 1;
          }
          keyArray[i][j] = currKeyState;
        }
      }
      return keyArray;
    },
  },
  methods: {
    scrollDownContainer() {
      var elem = document.getElementById("scrollableContainer");
      // elem.scrollTo(0, elem.scrollHeight)
      elem.scrollBy({
        top: elem.scrollHeight,
        behavior: "smooth",
      });
    },
    keyboardInput(keyInputted) {
      this.$emit("keyboardInput", keyInputted);
    },
  },
  watch: {
    playRevealAnimation(newVal) {
      if (newVal) {
        //
        this.makeGuessFlip.splice(0, 1, true);
        for (let i = 1; i < this.maxLenWord; i++) {
          setTimeout(() => {
            this.makeGuessFlip.splice(i, 1, true);
          }, i * 300);
        }
      } else {
        this.makeGuessFlip.fill(false, 0, this.maxLenWord);
        console.log("scrolling down");
        setTimeout(() => {
          this.scrollDownContainer();
        }, 300);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: grey;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}

#scrollableContainer {
  height: 30em;
  min-height: 0em;
  overflow-y: auto;
}

@media only screen and (max-width: 440px) {
  #scrollableContainer {
    height: 25em;
  }
}

@media only screen and (max-height: 815px) {
  #scrollableContainer {
    height: 13em;
  }
}

@media only screen and (max-width: 360px) {
  .scrollableContainer {
    height: 15em;
  }
}

.default1 {
  width: 100%;
  /* height: 100%; */
  background: rgb(31, 31, 32);
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
