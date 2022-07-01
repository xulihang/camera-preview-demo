import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";

BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@9.0.2/dist/";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string = 'barcode-scanner';
  active:boolean = false;
  scanned:boolean = false;
  decoding:boolean = false;
  continuous:boolean = false;
  interval:any = null;
  reader!:BarcodeReader;
  @ViewChild('cameraElement') cameraElement:any;
  
  async ngOnInit() {
    BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
    this.reader = await BarcodeReader.createInstance();
  }

  startCamera() {
    this.active = true;
  }

  stopCamera() {
    this.stopDecoding();
    this.active = false;
  }

  onOpened() {
    this.startDecoding();
  }

  startDecoding() {
    this.scanned = false;
    this.decoding = false
    this.stopDecoding();
    //1000/25=40

    const decode = async () => {
      if (this.decoding === false && this.reader != null) {
        console.log("decoding");
        const video = await this.cameraElement.nativeElement.getVideoElement();
        this.decoding = true;
        try {
          let results = await this.reader.decode(video);
          if (results.length>0 && this.scanned === false && this.continuous === false) {
            this.scanned = true;
            this.stopDecoding();
            this.stopCamera();
            alert(results[0].barcodeText);
          }else{
            await this.cameraElement.nativeElement.updateAnalysingResults(this.wrapResults(results));
          }
  
        } catch (error) {
          console.log(error);
        }
        this.decoding = false;
      }
    }

    this.interval = setInterval(decode, 40);
  }

  stopDecoding() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  wrapResults(results:TextResult[]) {
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

  continuousChange(event:any){
    this.continuous = event.target.checked;
  }
}
