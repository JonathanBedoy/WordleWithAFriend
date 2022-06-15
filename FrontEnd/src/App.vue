<template>
<div class="container-fluid mainBody m-0 p-0">
  <WordleOnline />
</div>
</template>

<script>
import WordleOnline from './components/WordleConnect/WordleOnline.vue'
// import WordData from "./assets/words.json"
// import io from 'socket.io-client'

export default {
  created() {

  },
  data() {
    return {
      // wordList: [],
      // maxLength: 5,
      // wordBeingPlayed: 'about',
      // socket: '',
      // wordGuessed: 'a',
      // listOfGuesses: ['hello','about'],
      // gameCompleted: false
    }
  },
  name: 'App',
  components: {
    WordleOnline
  },
  methods: {
    // changecurrText(usInput) {

    //   if (this.gameCompleted) return

    //   // the input was a letter
    //   if (usInput.length == 1 && usInput.toUpperCase() != usInput.toLowerCase()) {
    //     // user has enough room to input another char
    //     if (this.wordGuessed.length < this.maxLenWord) {
    //       this.wordGuessed += usInput
    //     }
    //   }

    //   // delete the last letter of the current guess
    //   if (usInput == 'Backspace') {
    //     this.wordGuessed = this.wordGuessed.slice(0, this.wordGuessed.length - 1)
    //   }
    //   // check if the word is correct size
    //   // check if the word is correct (end the game if it is)
    //   // if not correct word then add it to the list
    //   if (usInput == 'Enter' && this.wordGuessed.length == this.maxLenWord) {
    //     if (this.wordGuessed == this.wordBeingPlayed) {
    //       this.gameCompleted = true
    //     }
    //     this.listOfGuesses.push(this.wordGuessed)
    //     this.wordGuessed = ''
    //   }
    // }
  }
}
</script>

<style>

.mainBody {
  width: 100%;
  background-color: #1F1F20;
  min-height: 100vh;
  height: 100%;
  /* font-family: 'Baloo 2', cursive; */
  color: white;
}

html,
body {
  height: 100%;
  /* box-sizing: border-box; */
  background-color: rgb(31, 31, 32) !important;
  overflow: hidden;
}
</style>
