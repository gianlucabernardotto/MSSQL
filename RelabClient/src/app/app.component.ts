

import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marker } from './models/marker.model';
import { Ci_vettore } from './models/ci_vett.model';
import { MouseEvent } from '@agm/core';

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
  obsCiVett : Observable<Ci_vettore[]>;
  markers: Marker [];

  circleLat : number = 0; //Latitudine e longitudine iniziale del cerchio
  circleLng: number = 0;
  maxRadius: number = 400; //Voglio evitare raggi troppo grossi
  radius : number = this.maxRadius; //Memorizzo il raggio del cerchio
  serverUrl : string = "https://3000-e4a6cedb-2f8a-4bca-be3e-93cb6aa06d43.ws-eu01.gitpod.io/"

  constructor(public http: HttpClient) {
  }

  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    console.log(this.geoJsonObject);
  }

  ngOnInit() {
    //this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-e3f02582-08e5-41bd-b548-af0bc36b4dc5.ws-eu01.gitpod.io/");
    //this.obsGeoData.subscribe(this.prepareData);
    //this.obsCiVett = this.http.get<Ci_vettore[]>("https://3000-b86c5fa3-3aca-4fd2-9619-43571d8ec1e4.ws-eu01.gitpod.io/ci_vettore/90");
    //this.obsCiVett.subscribe(this.prepareCiVettData);
  }

  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.avgColorMap(feature.i.media),
      strokeWeight: 1,
      fillOpacity : 1  //Fill opacity 1 = opaco (i numeri tra 0 e 1 sono le gradazioni di trasparenza)
    });
  }

  avgColorMap = (media) =>
  {
    if(media <= 36) return "#00FF00";
    if(36 < media && media <= 40) return "#33ff00";
    if(40 < media && media <= 58) return "#66ff00";
    if(58 < media && media <= 70) return "#99ff00";
    if(70 < media && media <= 84) return "#ccff00";
    if(84 < media && media <= 100) return "#FFFF00";
    if(100 < media && media <= 116) return "#FFCC00";
    if(116 < media && media <= 1032) return "#ff9900";
    if(1032 < media && media <= 1068) return "#ff6600";
    if(1068 < media && media <= 1948) return "#FF3300";
    if(1948 < media && media <= 3780) return "#FF0000";
    return "#FF0000"
  }
  //mappa scala di verdi
  avgColorMapGreen = (media) =>
  {
    if(media <= 36) return "#EBECDF";
    if(36 < media && media <= 40) return "#DADFC9";
    if(40 < media && media <= 58) return "#C5D2B4";
    if(58 < media && media <= 70) return "#ADC49F";
    if(75 < media && media <= 84) return "#93B68B";
    if(84 < media && media <= 100) return "#77A876";
    if(100 < media && media <= 116) return "#629A6C";
    if(116 < media && media <= 1032) return "#558869";
    if(1032 < media && media <= 1068) return "#487563";
    if(1068 < media && media <= 1948) return "#3B625B";
    if(1948 < media && media <= 3780) return "#2F4E4F";
    return "#003000" //Quasi nero
  }

  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    let latTot = 0; //Uso queste due variabili per calcolare latitudine e longitudine media
    let lngTot = 0; //E centrare la mappa

    console.log(data); //Verifica di ricevere i vettori energetici
    this.markers = [];
    for (const iterator of data) { //Per ogni oggetto del vettore creoa un Marker
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      latTot += m.lat; //Sommo tutte le latitutidini e longitudini
      lngTot += m.lng;
      this.markers.push(m);
    }
    this.lng = lngTot/data.length; //Commenta qui
    this.lat = latTot/data.length;
    this.zoom = 16;
  }

 //Questo metodo richiama la route sul server che recupera il foglio specificato nella casella di testo
  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value; //Commenta qui
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-e4a6cedb-2f8a-4bca-be3e-93cb6aa06d43.ws-eu01.gitpod.io/ci_vettore/${val}`);  //Commenta qui
    this.obsCiVett.subscribe(this.prepareCiVettData); //Commenta qui
    console.log(val);
    return false;
  }

  mapClicked($event: MouseEvent) {
    this.circleLat = $event.coords.lat; //Queste sono le coordinate cliccate
    this.circleLng = $event.coords.lng; //Sposto il centro del cerchio qui
    this.lat = this.circleLat; //Sposto il centro della mappa qui
    this.lng = this.circleLng;
    this.zoom = 15;  //Zoom sul cerchio
  }

  circleRedim(newRadius : number){
    console.log(newRadius) //posso leggere sulla console il nuovo raggio
    this.radius = newRadius;  //Ogni volta che modifico il cerchio, ne salvo il raggio
  }

  circleDoubleClicked(circleCenter)
  {
    console.log(circleCenter); //Voglio ottenere solo i valori entro questo cerchio
    console.log(this.radius);
    this.circleLat = circleCenter.coords.lat;
    this.circleLng = circleCenter.coords.lng;
    if(this.radius > this.maxRadius)
    {
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
      this.radius = this.maxRadius;
    }

    let raggioInGradi = (this.radius * 0.00001)/1.1132;


    const urlciVett = `${this.serverUrl}/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`;

    const urlGeoGeom = `${this.serverUrl}/geogeom/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`;
    this.obsCiVett = this.http.get<Ci_vettore[]>(urlciVett);
    this.obsCiVett.subscribe(this.prepareCiVettData);

    this.obsGeoData = this.http.get<GeoFeatureCollection>(urlGeoGeom);
    this.obsGeoData.subscribe(this.prepareData);

    
  }



}