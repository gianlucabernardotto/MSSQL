import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marker } from './models/marker.model';
import { Ci_vettore} from './models/ci_vett.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 12;
  geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  obsGeoData: Observable<GeoFeatureCollection>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;
  obsCiVett : Observable<Ci_vettore[]>; //Crea un observable per ricevere i vettori energetici
  markers : Marker[] //Marker va importato

  constructor(public http: HttpClient) {
  }

  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    console.log(this.geoJsonObject)
  }
  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    console.log(data); //Verifica di ricevere i vettori energetici
    this.markers = []; //NB: markers va dichiarata tra le proprietà markers : Marker[]
    for (const iterator of data) { //Per ogni oggetto del vettore creoa un Marker
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      this.markers.push(m);
    }
 }



  ngOnInit() {
   this.obsCiVett = this.http.get<Ci_vettore[]>("https://3000-ac065d1b-37ae-4340-a510-3493e44eacfd.ws-eu01.gitpod.io/ci_vettore/90");
    this.obsCiVett.subscribe(this.prepareCiVettData);
  }

  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }

}
