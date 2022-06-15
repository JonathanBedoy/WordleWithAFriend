<template>
  <div class="keyboardContainer container my-5 mx-auto p-0" style="width: 50%;">
    <div class="row my-2 d-flex justify-content-center mx-auto " :style="{'width': index == 1 ? '90%': '100%'} " v-for="(i, index) in keys" :key="i[0]+i[1]">
        <wordleKey 
          @keyboardInput="keyboardInput" 
          v-for="(displayKeys, rowIndex) in i" 
          :double="displayKeys.length != 1" 
          :displayKey="displayKeys" 
          :key="displayKeys" 
          :badGuess="keysState[index][rowIndex] == 1"
          :almostCorrect="keysState[index][rowIndex] == 2"
          :correctGuess="keysState[index][rowIndex] == 3"
        />
    </div>

    <!-- <div class="row my-2 d-flex justify-content-center mx-auto " style="width: 90%;">
        <wordleKey v-for="i in 9" :key="i" />
      
    </div>

    <div class="row my-2 d-flex justify-content-center mx-auto ">
        <wordleKey :double="true"  />
        <wordleKey v-for="i in 7" :key="i" />
        <wordleKey :double="true" />
    </div> -->
    
  </div>
</template>

<script>
import wordleKey from '../WordleKey/WordleKey.vue'
export default {
  components: {
    wordleKey
  },
  created () {
    
  },
  name: 'WordleBox',
  props: {
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
    keysState: {
      default: () => [ // 4 states: 0 have not used key, 1 key not in word, 2 key in word wrong place, 3 key correctly used
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
      ],
      type: Array
    },
    keys: {
      default: () => [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['Enter','z','x','c','v','b','n','m','Backspace']
      ],
      type: Array
    }

  },
  data() {
    return {
      // keys: [
      //   ['q','w','e','r','t','y','u','i','o','p'],
      //   ['a','s','d','f','g','h','j','k','l'],
      //   ['Enter','z','x','c','v','b','n','m','Backspace']
      // ],
      // keysState: [ // 4 states: 0 have not used key, 1 key not in word, 2 key in word wrong place, 3 key correctly used
      //   [0,0,0,2,0,0,3,0,0,0],
      //   [0,0,0,0,0,0,0,1,0],
      //   [0,0,0,0,0,0,0,0,0]
      // ]
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

@media only screen and (max-width: 1000px) {
  .keyboardContainer {
    width: 95%!important;
  }
}

/* @media only screen and (max-height: 815px) {
  .keyboardContainer {
    width: 15em;
  }
} */

/* @media only screen and (max-width: 360px) {
  .keyboardContainer {
    width: 100%!important;
  }
} */

</style>
