<template>
  <div  class="" :class="{'flip-container': playTheAnimation || playManualAnimation}">
    <div class="" :class="{'flipper': playTheAnimation, 'flipperReveal': playManualAnimation}">

        <div v-if="showOtherCard" 
          class="back wordleBoxStyle col-2 text-center mx-1 d-flex justify-content-center" 
          :class="stateOfBox" 
          @click="boxType()"
        >
          <span class="my-auto">{{ playManualAnimation ? '' : currentLetter  }}</span>
        </div>

        <div v-else class="back blankBox wordleBoxStyle col-2 text-center mx-1 d-flex justify-content-center" @click="boxType()">
          <span class="my-auto"></span>
        </div>

    </div>

  </div>

</template>

<script>
export default {
  created() {
    this.displayText = this.currentLetter
    this.showOtherCard = this.currentLetter.length != 0
  },
  name: 'WordleBox',
  props: {
    animateBoxManually: {
      type: Boolean,
      default: false
    },
    currentLetter: {
      type: String,
      default: ''
    },
    correctLetter: {
      type: String,
      default: ''
    },
    correctText: {
      type: String,
      default: ''
    },
    rowCompleted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      playManualAnimation: false,
      animationLength: 3,
      showOtherCard: false,
      playTheAnimation: false,
      stateOfBox2: 'blankBox',
      displayText: ''
    }
  },
  methods: {
    playAnim() {
      let amountOfTime = this.animateBoxManually ? 500 : 100
      if (this.animateBoxManually) {
        
        this.playManualAnimation = true
        setTimeout(() => {
          this.playManualAnimation = false
          this.showOtherCard = true
        }, 700)
      } else {
        this.playTheAnimation = !this.playTheAnimation
        setTimeout(() => {
          this.playTheAnimation = false
          this.showOtherCard = true
        }, amountOfTime)
      }


      


    },
    boxType() {
      // change the current state of box
      // this.stateOfBox = 'correctBox'
      this.displayText = ''
    }
  },
  computed: {
    stateOfBox() {


      // this is the row that the user is currently guessing
      if (!this.rowCompleted && !this.animateBoxManually) {
        // if the user hasnt input anything onto this box yet
        if (this.currentLetter == '') {
          return 'blankBox'
        } // else there is something in the box
        else {
          return 'fullBox'
        }
      }
      // This row has already been played
      // if the box is correct
      if (this.currentLetter == this.correctLetter) {
        return 'correctBox'
      }
      // if the letter is in the word but not in correct spot
      if (this.correctText.includes(this.currentLetter)) {
        return 'belongsBox'
      }
      return 'previousBox'
    }
  },
  watch: {
    stateOfBox (newVal, oldVal) {
      if (newVal == 'blankBox' && oldVal != 'aslkdjalsdj') {
        this.showOtherCard = false
      } else {
        this.playAnim(this.animateBoxManually ? 500 : 300)
      } 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.wordleBoxStyle {
  user-select: none;
  text-transform: uppercase;
  border: 3px solid black;

  height: 5em;
  min-width: 5rem;
  max-width: 5rem;
}

@media only screen and (max-width: 440px) {
  .wordleBoxStyle {
    height: 4em;
    min-width: 4rem;
    max-width: 4rem;
  }
}

@media only screen and (max-height: 815px) {
  .wordleBoxStyle {
    height: 2.9em;
    min-width: 2.9em;
    max-width: 2.9em;
  }
}

@media only screen and (max-width: 360px) {
  .wordleBoxStyle {
    height: 2.9em;
    min-width: 2.9em;
    max-width: 2.9em;
  }
}

/* .wordleBoxStyle:after {
  content: "";
  display: block;
  padding-bottom: 100%;
} */

/* there is nothing in the box */
.blankBox {
  /* background-color: rgb(46, 43, 43); */
  border: 3px solid rgba(131, 126, 126, 0.247);
}

/* the user input text into box */
.fullBox {
  /* background-color: grey; */
  border: 3px solid rgb(131, 126, 126);
}

.previousBox {
  border: 0;
  background-color: rgb(70, 67, 73);
}

/* there is text and the text and the text belongs, and is in the correct location */
.correctBox {
  border-color: rgb(89, 145, 89);
  background-color: rgb(89, 145, 89);
}

/* there is text and the text belongs but is not in the correct location */
.belongsBox {
  border: 0;
  background-color: rgb(233, 194, 66);
}



/* flip the pane when hovered */
.flip-container .flipper,
.flip-container .flipperReveal {
  transform: rotateX(180deg);
}

/* flip speed goes here */
.flipper {
  transition: .1s;
  transform-style: preserve-3d;

  position: relative;
}

.flipperReveal {
  transition: 1s;
  transform-style: preserve-3d;

  position: relative;
}
</style>
