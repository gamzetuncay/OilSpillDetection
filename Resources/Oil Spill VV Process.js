/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #e0440e */ee.Geometry.LineString(
        [[29.483160428965693, 43.24757920773356],
         [29.58409731861413, 43.228320291665675]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Article => https://www.mdpi.com/2072-4292/8/10/875
////////////////////////////////////////////////////////////
// Study Area

var blacksea = ee.Geometry.Polygon([
            [[29.47313958640859,43.192299005635455],
             [29.716212096174214,43.192299005635455],
             [29.716212096174214,43.313325457204904],
             [29.47313958640859,43.313325457204904]]
            ]);


var profile = geometry;
/*
var profile = ee.Geometry.LineString(
            [[29.483160428965693, 43.24757920773356],
             [29.58409731861413, 43.228320291665675]]
            );
*/

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
var end_date = '2015-09-26';
*/
////////////////////////////////////////////////////////////

////////////////     VV Band Functions     /////////////////

////////////////////////////////////////////////////////////

// Preprocessing Fuctions

var SpeckleFilter = function(img) {
    /*
    Input : image (img)
    
    the fuction reduces the noise on the VV 
    with the help of focal median function.
    it saves the original bands and
    adds the new low noise band
    
    Output: image with new band (VV_SpeckleFilter)
    */
    
    var VVband = img.select('VV'); //select the VV polarization band
    var VV_SpeckleFilter = VVband.focal_median(150,'circle','meters').rename('VV_SpeckleFilter');
    return img.addBands(VV_SpeckleFilter); // Add filtered VV band to original image
}

var OilSpillMask = function(img) {
    /*
    Input : image (img)
    
    the fuction mask the possible oil on the VV band
    with the help of threshold.
    it saves the original bands and
    adds the new oil mask band
    
    Output: image with new band
    */
  var VV_SpeckleFilter = img.select('VV_SpeckleFilter');
  //Identify all pixels below threshold and set them equal to 1. All other pixels set to 0
  var VV_OilSpillMask = VV_SpeckleFilter.lt(-25).rename('VV_OilSpillMask'); 
  VV_OilSpillMask = VV_OilSpillMask.updateMask(VV_OilSpillMask); //Remove all pixels equal to 0
  return img.addBands(VV_OilSpillMask);  //Return image with added classified oil band
}

// Image Collection

/* GRD :Imagery in the Earth Engine 'COPERNICUS/S1_GRD' 
Sentinel-1 ImageCollection is consists of Level-1 
Ground Range Detected (GRD) scenes processed to 
backscatter coefficient (σ°) in decibels (dB). */

var Sar = ee.ImageCollection('COPERNICUS/S1_GRD')
            .filterBounds(blacksea)
            .filterDate(start_date,end_date)           
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV')) 
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
            .filter(ee.Filter.eq('instrumentMode','IW'))
            .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'));

// Processings

var VV_SpeckleFilter = Sar.map(SpeckleFilter);

var VV_OilMask = VV_SpeckleFilter.map(OilSpillMask);

// Map Layers
Map.centerObject(blacksea,11);

Map.addLayer(Sar.first(),{bands: 'VV',min: -40, max: 40}, 'VV');

Map.addLayer(VV_SpeckleFilter.first(),{bands: 'VV_SpeckleFilter',min: -40, max: 40}, 'VV Speckle Filtered');

Map.addLayer(VV_OilMask.first(),{bands: 'VV_OilSpillMask'}, 'VV Oil Spill Mask');

Map.addLayer(profile);
// Histogram 

var VV_SpeckleFilterIMG = (ee.Image(VV_SpeckleFilter.first()).select("VV_SpeckleFilter"));

var VV_Histogram = ui.Chart.image.histogram(VV_SpeckleFilterIMG, blacksea, 10)
    .setSeriesNames(['VV_SpeckleFilter'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

print(VV_Histogram); // Display the histogram.

// Profile Analysis

var VV_Pixels = VV_SpeckleFilterIMG.reduceRegion(ee.Reducer.toList(), profile);

var VV_Data = ee.Array(VV_Pixels.get("VV_SpeckleFilter"));

var VV_ProfileChart = ui.Chart.array.values(VV_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        title: 'VV Band Profile Analysis',
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'dB'},
        colors: ['#e0440e']
    });

print(VV_ProfileChart);// Display the profile.
