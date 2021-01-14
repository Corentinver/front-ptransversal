import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public staticURI: string = "http://localhost:8080"

  constructor(public http: HttpClient) { }

  public getSensors() {
    return this.http.get(this.staticURI + "/allSensor");
  }

  public getFireStations() {
    return this.http.get(this.staticURI + "/allFireStation");
  }

  public getInformationsFireStation(idFireStation: string) {
    return this.http.get(this.staticURI + "/informationsFireStation?idFireStation=" + idFireStation);
  }

  public getTypeVehicle() {
    return this.http.get(this.staticURI + "/allTypeVehicle");
  }

  public getOperationById(idOperation: string) {
    return this.http.get(this.staticURI + "/operationById?idOperation=" + idOperation);
  }

}
