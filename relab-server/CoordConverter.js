const proj4 = require('proj4');
const parse = require('wellknown');
const Feature = require('./models/feature.model.js');
const FeatureCollection = require('./models/featureCollection.model.js');

module.exports = class CoordConverter {

    constructor()
    {
        //Definisco il tipo di proiezioni da convertire (32632->4362)
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        //proj4.defs("EPSG:4362", "già definito in proj4");
    }

    generateGeoJson(recordset) {
        let geoJsonHeader = new FeatureCollection();

        let i = 0;
        for (const record of recordset) {  
            let media = record["media"];
            let somma = record["somma"];
            let polygonGeometry = parse(record["WKT"]); 
            let geom = (polygonGeometry); 
 
            geoJsonHeader.features.push(new Feature(i,geom, media, somma));
            i++;
        }
        return geoJsonHeader;
    }


    
    _convertPolygon(geometry) {
        let polygon = geometry.coordinates[0];
        for (let index = 0; index < polygon.length; index++) {
            const coord = polygon[index];
            geometry.coordinates[0][index] = proj4("EPSG:32632", "WGS84").forward(coord);
        }
        return geometry;
    }

}
