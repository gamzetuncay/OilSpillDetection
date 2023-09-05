/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[26.22801242444855, 40.3126647288803],
          [26.22801242444855, 40.111309059418424],
          [26.490311008432926, 40.111309059418424],
          [26.490311008432926, 40.3126647288803]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Article => https://www.mdpi.com/2072-4292/8/10/875
////////////////////////////////////////////////////////////
// Study Area
var ssen = ee.ImageCollection('COPERNICUS/S2')
            .filterBounds(geometry)
            .filterDate('2016-04-18','2014-04-23'); 
print(ssen)
Map.addLayer(ssen);

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
var end_date = '2019-08-09';

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
             [35.827, 43.511]]
            );
var start_date = '2015-09-24';
var end_date = '2015-10-30';
*/

////////////////////////////////////////////////////////////

//////////////     SENTINEL 2 Functions     ////////////////

////////////////////////////////////////////////////////////

// Normalized Difference Water Index
var NDWI = function(img){ // Normalized Difference Water Index
    return img.addBands(img.normalizedDifference(['B2', 'B11'])
        .rename('NDWI'));
}

// B2/B11
var Ratio_B2B11 = function(img){ 
    return img.addBands(img.expression('B2 / B11',{
        'B2': img.select('B2'),
        'B11': img.select('B11')})
        .rename('Ratio_B2B11'));
}
/*
//B2/B11 * stdDEV(B2)

var StdDEVRatio_B2B11 = function(img){ 
    var Band2 = img.first('B2'); 
    var reducers = ee.Reducer.stdDev();
    var stats = Band2.reduceRegion({
      reducer: reducers, 
      bestEffort: true
    });
    var B2_stdDev = stats.get('B2');
    return img.addBands(img.expression('(B2 * B2_stdDev) / B11',{
        'B2': img.select('B2'),
        'B11': img.select('B11'),
        'B2_stdDev': B2_stdDev})
        .rename('StdDEVRatio_B2B11'));
}
*/
// Image Collection

var Sentinel2 = ee.ImageCollection('COPERNICUS/S2')
            .filterBounds(blacksea)
            .filterDate(start_date,end_date);           
print(Sentinel2)

// Processings

var NDWI_Band = Sentinel2.map(NDWI);

var Ratio_Band = Sentinel2.map(Ratio_B2B11);
    
//var StdDEVRatio_Band = Sentinel2.map(StdDEVRatio_B2B11);
    
 
// Map Layers
Map.centerObject(blacksea,10);

Map.addLayer(Sentinel2);

Map.addLayer(NDWI_Band);

Map.addLayer(Ratio_Band);

Map.addLayer((profile));

//Map.addLayer(StdDEVRatio_Band);

Map.addLayer((profile, blacksea), {color: 'FF0000'})
// HISTOGRAMS
//1 NDWI Histogram 
var NDWI_IMG = (ee.Image(NDWI_Band.first()).select("NDWI"));

var NDWI_Histogram = ui.Chart.image.histogram(NDWI_IMG, blacksea, 10)
    .setSeriesNames(['NDWI'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

print(NDWI_Histogram); // Display the histogram.

//2 Ratio_Band Histogram 
var Ratio_IMG = (ee.Image(Ratio_Band.first()).select("Ratio_B2B11"));

var Ratio_Histogram = ui.Chart.image.histogram(Ratio_IMG, blacksea, 10)
    .setSeriesNames(['Ratio_B2B11'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

print(Ratio_Histogram); // Display the histogram.
/*
//3 StdDEVRatio_B2B11 Histogram

var StdDEVRatio_IMG = ee.Image(StdDEVRatio_Band.select("StdDEVRatio_B2B11"));

var StdDEVRatio_Histogram = ui.Chart.image.histogram(StdDEVRatio_IMG, blacksea, 10)
    .setSeriesNames(['StdDEVRatio_B2B11'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

print(StdDEVRatio_Histogram); // Display the histogram.
*/

// PROFILE ANALYSIS
//1 NDWI Profile Analysis
var NDWI_Pixels = NDWI_IMG.reduceRegion(ee.Reducer.toList(), profile);

var NDWI_Data = ee.Array(NDWI_Pixels.get("NDWI"));

var NDWI_ProfileChart = ui.Chart.array.values(NDWI_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'DN'},
        colors: ['#e0440e']
    });

print(NDWI_ProfileChart);// Display the profile.

//2 Ratio Profile Analysis
var Ratio_Pixels = Ratio_IMG.reduceRegion(ee.Reducer.toList(), profile);

var Ratio_Data = ee.Array(Ratio_Pixels.get("Ratio_B2B11"));

var Ratio_ProfileChart = ui.Chart.array.values(Ratio_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'DN'},
        colors: ['#e0440e']
    });

print(Ratio_ProfileChart);// Display the profile.
/*
//3 StdDEVRatio_B2B11 Profile Analysis
var StdDEVRatio_Pixels = StdDEVRatio_IMG.reduceRegion(ee.Reducer.toList(), profile);

var StdDEVRatio_Data = ee.Array(Ratio_Pixels.get("StdDEVRatio_B2B11"));

var StdDEVRatio_ProfileChart = ui.Chart.array.values(Ratio_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'DN'},
        colors: ['#e0440e']
    });

print(StdDEVRatio_ProfileChart);// Display the profile.
*/


