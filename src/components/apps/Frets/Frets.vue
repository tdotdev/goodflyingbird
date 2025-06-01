<template>
  <FretInstance
    :config="{
      scale: [0,2,3,5,6,7,9],
      tuning: eStandardGuitar,
      fretCount: 22,
      scaleWidth: 200
    }"
  />
  <!--
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
  />-->
</template>

<script setup lang="ts">
import Clef from './Clef.vue';
import FretInstance from './FretInstance.vue';
import { FretConfig } from './Frets';

/*
const cmaj7 = [
  { note: "C", color: "#999999" }, 
  { note: "E", color: "#eeee55" }, 
  { note: "G", color: "#ee5555" }, 
  { note: "B", color: "#55ee55" }, 
]*/


const sixteenStringGuitar = [
  5, 10, 15, 20, 25, 30, 35, 40, 
  45, 50, 55, 60, 65, 70, 75, 80
]
const eightStringGuitar = [30, 35, 40,45,50,55,59,64]
const eStandardGuitar = [40, 45, 50, 55, 59, 64]
const eStandardBass = [28, 33, 38, 43]



</script>

<style scoped>
.main {
  background-color: red;
  overflow: hidden;
  touch-action: none;
}
</style>