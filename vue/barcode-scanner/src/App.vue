<script setup lang="ts">
  import { ref } from 'vue';

  const active = ref(false);
  const startCamera = () => {
    active.value  = true;
  }

  const stopCamera = () => {
    active.value  = false;
  }
</script>

<template>
  <div :style="{display: active ? 'none' : '' }">
    <button v-on:click="startCamera">Start Camera</button>
  </div>
  <camera-preview 
    desired-camera="founder"
    draw-overlay="true"
    :active="active"
    :style="{display: active ? '' : 'none' }"
  >
    <button id="close-btn" v-on:click="stopCamera">Close</button>
  </camera-preview>
</template>

<style>
  camera-preview {
    height:100%;
    width:100%;
    position: absolute;
    right:0;
    top:0;
  }
</style>
