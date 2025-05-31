<template>
  <Clef style="position:absolute; margin-left: 1380px; margin-top: 20px; max-height: 150px; color: red;"></Clef>
  
  <FretInstance
    scale-title="Cmaj7"
    :scale="cmaj7"
  />
  <FretInstance
    scale-title="Am6"
    :scale="amin6"
    :frets="20"
  />
  <FretInstance
    scale-title="G7"
    :scale="g7"
    :strings="eightStringGuitar"
    :frets="24"
    :neck-length="1250"
    :neck-width="150"
  />
  <FretInstance
    scale-title="C Whole Tone"
    :scale="wt1"
  />
  <FretInstance
    scale-title="Gbm7b5"
    :scale="gbm7b5"
    :frets="20"
    :neck-length="1400"
    :strings="eStandardBass"
  />
  <FretInstance
    scale-title="Bonk"
    :scale="chromatic"
    :frets="8"
    :neck-length="1200"
    :neck-width="50"
    :strings="[40, 44]"
  />
  <FretInstance
    scale-title="Polyphia Enjoyers Only"
    :scale="pppp"
    :frets="40"
    :neck-length="1200"
    :neck-width="400"
    :strings="sixteenStringGuitar"
  />
</template>

<script setup lang="ts">
import Clef from './Clef.vue';
import FretInstance from './FretInstance.vue';

/*
const cmaj7 = [
  { note: "C", color: "#999999" }, 
  { note: "E", color: "#eeee55" }, 
  { note: "G", color: "#ee5555" }, 
  { note: "B", color: "#55ee55" }, 
]*/

const cmaj7 = [
  { note: "C" }, 
  { note: "E" }, 
  { note: "G" }, 
  { note: "B" }, 
]

const amin6 = [
  { note: "A"}, 
  { note: "C"}, 
  { note: "E"}, 
  { note: "F#"}, 
]

const g7 = [
  { note: "G"}, 
  { note: "B"}, 
  { note: "D"}, 
  { note: "F"}, 
]

const wt1 = [
  { note: "C"}, 
  { note: "D"}, 
  { note: "E"}, 
  { note: "F#"}, 
  { note: "Ab"},
  { note: "Bb"},
]

const gbm7b5 = [
  { note: "F#"}, 
  { note: "A"}, 
  { note: "C"}, 
  { note: "E"},
]

const chromatic = [
  { note: "C"}, 
  { note: "C#"}, 
  { note: "D"}, 
  { note: "Eb"}, 
  { note: "E"}, 
  { note: "F"}, 
  { note: "F#"}, 
  { note: "G"}, 
  { note: "Ab"},
  { note: "A"}, 
  { note: "Bb"},
  { note: "B"},
]

const pppp = [
  { note: "C"}, 
  { note: "C#"}, 
  { note: "D"}, 
  { note: "E"}, 
  { note: "F"}, 
  { note: "F#"}, 
  { note: "Ab"},
  { note: "A"}, 
  { note: "Bb"},
]

const sixteenStringGuitar = [
  5, 10, 15, 20, 25, 30, 35, 40, 
  45, 50, 55, 60, 65, 70, 75, 80
]
const eightStringGuitar = [30, 35, 40,45,50,55,59,64]
const eStandard = [40, 45, 50, 55, 59, 64]
const eStandardBass = [28, 33, 38, 43]

</script>

<style scoped>
.main {
  background-color: red;
}
</style>