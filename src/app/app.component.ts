import { RecurseVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { tileLayer } from 'leaflet';
import { latLng } from 'leaflet';
import { marker } from 'leaflet';
import { WebSocketEndPointService } from './services/endpoint.websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'FrontPtransversal';
  public progress: any = {};
  public J_IDFire_IDMarker: Map<number, number>;

  public options: any = {
    	layers: [
		tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
	],
    zoom: 13,
    center: latLng(45.75, 4.85)
  };

  public fires;

  constructor(private webSocket: WebSocketEndPointService) {}


  
  
  ngOnInit() {
    // Init Progress WebSocket.
    this.initSocket();

    this.fires = [{
      id: 8,
      layer: [
        marker([45.75, 4.85])
      ]
    }
    ];
  }

  /**
   * Subscribe to the client broker.
   * Return the current status of the batch.
   */
  private initSocket = () => {


    const obsNewFire = this.webSocket.getObservable();
    obsNewFire.subscribe({
      next: this.onNewFire,
      error: err => {
        console.log(err);
      }
    });

  }


  private onNewFire = receivedMsg => {
    console.log(receivedMsg);
    if (receivedMsg.type === 'SUCCESS') {
      console.log(receivedMsg.message);
    }
  }

}                 