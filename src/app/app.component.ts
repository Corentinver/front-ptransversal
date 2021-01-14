import { Component, OnInit } from '@angular/core';
import { icon, tileLayer } from 'leaflet';
import { latLng } from 'leaflet';
import { marker } from 'leaflet';
import { WebSocketEndPointService } from './services/endpoint.websocket.service';
import { RestService } from './services/rest.service';
import { Fire, FireStation, FireStationInfos, Operation, Point, Ride, Sensor, TypeVehicle } from './models/factory';
import { circle } from 'leaflet';
import { MovingMarker, MovingMarkerOptions } from '../../node_modules/@arturataide/ngx-leaflet-movingmarker';
import * as L from 'leaflet';
import { Marker } from 'leaflet';
import { MarkerOptions } from 'leaflet';
import { identifierModuleUrl } from '@angular/compiler';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'FrontPtransversal';
  public progress: any = {};
  public J_IDFire_IDMarker: Map<number, number>;
  public sensors: Marker[] = [];
  public firestations: Marker[] = [];
  public fires: Marker[] = [];
  public vehicles: MovingMarker[] = [];

  public listRidesInFire = {};

  public mapInfoTypeVehicle = {};

  public options: any = {
    	layers: [
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  	],
    zoom: 16,
    center: latLng(45.75, 4.85)
  };


  constructor(private webSocket: WebSocketEndPointService, private restService: RestService) {}

  ngOnInit() {
    // Init Progress WebSocket.
    this.initSocket();


    this.restService.getTypeVehicle().subscribe((typeVehicles: TypeVehicle[]) => {
      typeVehicles.forEach((typeVehicle: TypeVehicle) => {
        this.mapInfoTypeVehicle[typeVehicle.id] = typeVehicle.name;
      });
    });


    this.restService.getActiveFires().subscribe((fires: Fire[]) => {
      fires.forEach((fire: Fire) => {
        this.addNewFire(fire);
      });
    });

    this.restService.getSensors().subscribe((sensors: Sensor[]) => {
      sensors.forEach((sensor: Sensor) => {
        const sensorMarker = marker([sensor.location.latitude,sensor.location.longitude], { icon: icon({
          iconSize: [ 20, 20 ],
          iconUrl: 'https://www.flaticon.com/svg/static/icons/svg/3522/3522502.svg',
        })
        , title: sensor.id 
        , zIndexOffset: 1
      });
        sensorMarker.bindPopup("<h3>" + sensor.name + "</h3>");
        this.sensors.push(sensorMarker);
      });
    });

    this.restService.getFireStations().subscribe((firestations: FireStation[]) => {
      firestations.forEach((firestation: FireStation) => {
        const fireStationMarker = marker([firestation.location.latitude, firestation.location.longitude], { icon: icon({
          iconSize: [ 35, 35 ],
          iconUrl: 'https://www.flaticon.com/svg/static/icons/svg/3144/3144851.svg'
        })
        , title: firestation.id 
        , zIndexOffset: 0
      });
        this.restService.getInformationsFireStation(firestation.id).subscribe((fireStationInfos: FireStationInfos) => {
          fireStationMarker.bindPopup(this.buildPopUpFireStation(firestation, fireStationInfos));
          this.firestations.push(fireStationMarker);
        });    
      });
    });
    
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
    if (receivedMsg.type === 'SUCCESS') {
      switch(receivedMsg.channel) {
        case "/newFire":
          this.addNewFire(receivedMsg.message);
          break;
        case "/updateFire":
          this.updateFire(receivedMsg.message);
          break;
        case "/ride": 
          this.ride(receivedMsg.message);
        default: 
          break;
      }
    }
  }


  public addNewFire(fire: Fire) {
    const markerOptions: MarkerOptions = { icon: icon({
      iconSize: [ 40 + 0.3 * fire.intensity, 40 + 0.3 * fire.intensity ],
      iconUrl: '/assets/fire.png'
    })
    , title: fire.id 
    , zIndexOffset: 2
  };

    const fireMarker = marker([fire.location.latitude, fire.location.longitude], markerOptions);

    fireMarker.bindPopup(this.buildPopUpFire(fire));

    this.fires.push(fireMarker);
  }


  public updateFire(fire: Fire) {
    const indexFireInList: number = this.fires.findIndex(f  => f.options.title == fire.id);

    if (indexFireInList == undefined) return;

    if (fire.intensity == 0) {
      this.fires.splice(indexFireInList, 1);
      if (this.listRidesInFire[fire.id].length > 0) {
        let tempOperationId = this.listRidesInFire[fire.id][0].operationId;
        
        this.listRidesInFire[fire.id].forEach((ride: Ride) => {
          const options: MovingMarkerOptions = {
            icon: L.icon({
              iconSize: [ 25, 25 ],
              iconUrl: '/assets/firevehicle.png',
            }),
            autostart: true,
            loop: false, 
            zIndexOffset: 3
          };
  
          const arrayDurations = [];
          const arrayLatlng = [];
  
          ride.listLocalisations.reverse();

          ride.listLocalisations.forEach((point: Point) => {
            arrayLatlng.push(L.latLng(point.latitude, point.longitude));
            arrayDurations.push(ride.duration * 10 / ride.listLocalisations.length);
          });
  

          let movingMarker: MovingMarker = new MovingMarker(arrayLatlng, arrayDurations, options);

          this.vehicles.push(movingMarker);   

          setTimeout(() => {
            this.vehicles.splice(this.vehicles.indexOf(movingMarker), 1);
          }, ride.duration * 10);
        });

        this.listRidesInFire[fire.id] = [];
      }
      
    } else {

      const markerOptions: MarkerOptions = { icon: icon({
        iconSize: [ 40 + 0.3 * fire.intensity, 40 + 0.3 * fire.intensity ],
        iconUrl: '/assets/fire.png'
      })
      , title: fire.id
      , zIndexOffset: 2
    };
  
      const fireMarker = marker([fire.location.latitude, fire.location.longitude], markerOptions);

      fireMarker.bindPopup(this.buildPopUpFire(fire));
      this.fires[indexFireInList] = fireMarker;
    }
  }



  public ride(ride: Ride) {
    const options: MovingMarkerOptions = {
      icon: L.icon({
        iconSize: [ 25, 25 ],
        iconUrl: '/assets/firevehicle.png',
      }),
      autostart: true,
      loop: false, 
      zIndexOffset: 3,
      title: ride.operationId
    };

    const arrayDurations = [];
    const arrayLatlng = [];

    ride.listLocalisations.forEach((point: Point) => {
      arrayLatlng.push(L.latLng(point.latitude, point.longitude));
      arrayDurations.push(ride.duration * 10 / ride.listLocalisations.length);
    });

    let movingMarker: MovingMarker = new MovingMarker(arrayLatlng, arrayDurations, options);
  
    this.vehicles.push(movingMarker);

    setTimeout(() => {
      this.vehicles.splice(this.vehicles.indexOf(movingMarker), 1);
    }, ride.duration * 10);

    this.restService.getOperationById(ride.operationId).subscribe((operation: Operation) => {
      if (operation !== undefined) {
        if (this.listRidesInFire[operation.idFire] === undefined)
          this.listRidesInFire[operation.idFire] = [ride];
        else
          this.listRidesInFire[operation.idFire].push(ride);
        setTimeout(() => {
          this.fires.find((fireMarker: Marker) => fireMarker.options.title == operation.idFire).bindPopup("Pompiers en cours d'intervention");
        }, ride.duration * 10);
      }
    });
  }


  public buildPopUpFire(fire: Fire) {
    return "Intensité : " + fire.intensity + "<br>"
          + "Taille : " + fire.size + "<br>"
          + "Type de feu : " + fire.typeFire;
  }

  public buildPopUpFireStation(fireStation: FireStation, fireStationInfos: FireStationInfos) {
    let htmlPopUp = "<h3>" + fireStation.name + "</h3>"
          + "Nombre de pompiers : " + fireStationInfos.nbFireFighters + "<br>"
          + "Véhicules : <br>";

    for(let key of Object.keys(fireStationInfos.vehiclesByType)) {
      htmlPopUp = htmlPopUp + this.mapInfoTypeVehicle[key] + " : " + fireStationInfos.vehiclesByType[key] + "<br>";
    }

    return htmlPopUp;

  }
}                 


