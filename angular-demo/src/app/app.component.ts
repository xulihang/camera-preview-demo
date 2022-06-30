import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string = 'barcode-scanner';
  active:boolean = false;
  
  startCamera() {
    this.active = true;
  }

  closeCamera() {
    this.active = false;
  }
}
