<template>
  <div class=" default mx-1 p-0 m-0 d-flex justify-content-center" 
  @click="keyboardInput(displayKey)"
    :class="[{
      'col': !double, 
      'col-2': double, 
      'badGuess': badGuess, 
      'correctGuess': correctGuess, 
      'almostCorrect': almostCorrect
      }]"
  >
    <span v-if="displayKey.length == 1" class="my-auto">{{displayKey}}</span>
    <b-icon class="my-auto" v-else-if="displayKey == 'Enter'"  icon="arrow-return-left" scale="1"></b-icon>
    <b-icon class="my-auto" v-else-if="displayKey == 'Backspace'" icon="backspace" scale="1"></b-icon>
  </div>
</template>

<script>

export default {
  
  created () {
    
  },
  name: 'WordleBox',
  props: {
    keyState: {
      default: false,
      type: Boolean
    },
    double: {
      default: false,
      type: Boolean
    },
    badGuess: {
      default: false,
      type: Boolean
    },
    correctGuess: {
      default: false,
      type: Boolean
    },
    almostCorrect: {
      default: false,
      type: Boolean
    },
    displayKey: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      eklo: 'default'
    }
  },
  methods: {
    keyboardInput (keyInputted) {
      this.$emit('keyboardInput', keyInputted)
    }
  }, 
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.default {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;
  cursor: pointer;
  background-color: rgb(124, 117, 117);
  border-radius: 4px;
  text-transform: uppercase;
  /* padding-bottom: 100%; */
  /* position: relative; */

  height: 58px;
  /* min-width: 2.5rem;
  max-width: 2.5rem; */
}

.badGuess {
  background-color: #3A3A3C;
}
.correctGuess {
  background-color: #599159;
}
.almostCorrect {
  background-color: #E9C242;
}





</style>
