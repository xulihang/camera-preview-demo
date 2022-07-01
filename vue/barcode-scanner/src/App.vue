<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { BarcodeReader, type TextResult } from "dynamsoft-javascript-barcode";

  BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@9.0.2/dist/";
  let reader:BarcodeReader;
  let scanned = false;
  let decoding = false;
  let interval:any = null;
  const continuous = ref(false);
  const cameraElement:any = ref(null);
  const active = ref(false);

  onMounted(async () => {
    reader = await BarcodeReader.createInstance();
  })

  const startCamera = () => {
    active.value  = true;
  }

  const stopCamera = () => {
    active.value  = false;
  }

  const onOpened = () => {
    console.log("opened");
    startDecoding();
  }

  const startDecoding = () => {
    scanned = false;
    stopDecoding();
    //1000/25=40
    interval = setInterval(decode, 40);
  }

  const stopDecoding = () => {
    clearInterval(interval);
  }

  const decode = async () => {
    if (decoding === false && reader && cameraElement.value) {
      console.log("decoding");
      const video = await cameraElement.value.getVideoElement();
      decoding = true;
      try {
        let results = await reader.decode(video);
        if (results.length>0 && scanned === false && continuous.value === false) {
          scanned = true;
          stopDecoding();
          stopCamera();
          alert(results[0].barcodeText);
        }else{
          await cameraElement.value.updateAnalysingResults(wrapResults(results));
        }

      } catch (error) {
        console.log(error);
      }
      decoding = false;
    }
  }

  const wrapResults = (results:TextResult[]) => {
    let analysingResults = [];
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      let analysingResult:any = {};
      analysingResult.text = result.barcodeText;
      analysingResult.localizationResult = [
        {x:result.localizationResult.x1,y:result.localizationResult.y1},
        {x:result.localizationResult.x2,y:result.localizationResult.y2},
        {x:result.localizationResult.x3,y:result.localizationResult.y3},
        {x:result.localizationResult.x4,y:result.localizationResult.y4}
      ];
      analysingResults.push(analysingResult)
    }
    return analysingResults;
  }
</script>

<template>
  <div :style="{display: active ? 'none' : '' }">
    <button v-on:click="startCamera">Start Camera</button>
    <label>
    <input type="checkbox" v-model="continuous" />
    Continuous Scan
    </label>
  </div>
  <camera-preview 
    ref="cameraElement"
    desired-camera="founder"
    draw-overlay="true"
    v-on:opened="onOpened"
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

  #close-btn {
    position:absolute;
    right:0;
    top:0;
  }
</style>
