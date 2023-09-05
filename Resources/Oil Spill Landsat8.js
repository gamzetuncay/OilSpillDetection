// Article => https://www.mdpi.com/2072-4292/8/10/875
////////////////////////////////////////////////////////////
// Study Area
var blacksea = ee.Geometry.Polygon([
            [[29.47313958640859,43.192299005635455],
             [29.716212096174214,43.192299005635455],
             [29.716212096174214,43.313325457204904],
             [29.47313958640859,43.313325457204904]]
            ]);


var profile = ee.Geometry.LineString(
            [[29.483160428965693, 43.24757920773356],
             [29.58409731861413, 43.228320291665675]]
            );

var start_date = '2019-08-08';
var end_date = '2019-08-18';

/*
var blacksea = ee.Geometry.Polygon([
            [[35.611, 43.395],
             [35.973, 43.395],
             [35.973, 43.609],
             [35.611, 43.609]]
            ]);

var center = ee.Geometry.Point([35.754, 43.499]);

var profile = ee.Geometry.LineString(
            [[35.650, 43.527], 
             [35.827, 43.527], 
             [35.827, 43.511], 
             [35.650, 43.511]]
            );
var start_date = '2015-09-20';
var end_date = '2015-09-30';
*/
////////////////////////////////////////////////////////////

////////////////     LANDSAT 8 Functions     /////////////////

////////////////////////////////////////////////////////////

// Land Surface Temperature Functions

var TOA = function(img){ // Top of Atmosphere
    return img.addBands(img.expression('0.0003342 * B10 + 0.1',{
        'B10':img.select('B10')})
        .rename('TOA'));
}

var BT = function(img){ // Brightness Temperature
    return img.addBands(img.expression('(1321.0789 / log((774.8853 / TOA) + 1)) - 273.15',{
        'TOA':img.select('TOA')})
        .rename('BT'));
}

var NDVI = function(img){ // Normalized Difference Vegetation Index
    return img.addBands(img.normalizedDifference(['B5', 'B4'])
        .rename('NDVI'));
}

var PV = function(img){ // Proportion of Vegetation 
    return img.addBands(img.expression('((NDVI - 0.216901)/(0.632267 - 0.216901))*((NDVI - 0.216901) / (0.632267 - 0.216901))',{
        'NDVI':img.select('NDVI')})
        .rename('PV'));
}

var Emissivity = function(img){ 
    return img.addBands(img.expression('0.004 * PV + 0.986',{
        'PV':img.select('PV')})
        .rename('Emissivity'));
}

var LST = function(img){ // Land Surface Temperature
    return img.addBands(img.expression('(BT / (1 + (0.00115 * BT / 1.4388) * log(Emissivity)))',{
        'BT': img.select('BT'),
        'Emissivity': img.select('Emissivity')})
        .rename('LST'));
}


// Image Collection

var Landsat = ee.ImageCollection('LANDSAT/LC08/C01/T2')
            .filterBounds(blacksea)
            .filterDate(start_date,end_date);           
            

// Processings

var TOA_Band = Landsat.map(TOA);

var BT_Band = TOA_Band.map(BT);
    
var NDVI_Band = BT_Band.map(NDVI);
    
var PV_Band = NDVI_Band.map(PV);
    
var Emissivity_Band = PV_Band.map(Emissivity);
    
var LST_Band = Emissivity_Band.map(LST);
 

// Map Layers
Map.centerObject(blacksea,11);

Map.addLayer(Landsat);

Map.addLayer(LST_Band);

Map.addLayer(profile);


// Histogram 

var LST_IMG = (ee.Image(LST_Band.first()).select("LST"));

var LST_Histogram = ui.Chart.image.histogram(LST_IMG, blacksea, 10)
    .setSeriesNames(['LST'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

print(LST_Histogram); // Display the histogram.

// Profile Analysis

var LST_Pixels = LST_IMG.reduceRegion(ee.Reducer.toList(), profile);

var LST_Data = ee.Array(LST_Pixels.get("LST"));

var LST_ProfileChart = ui.Chart.array.values(LST_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'DN'},
        colors: ['#e0440e']
    });

print(LST_ProfileChart);// Display the profile.






