/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var profile = /* color: #e0440e */ee.Geometry.LineString(
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



var start_date = '2019-08-08';
var end_date = '2019-08-09';
/*
var profile = ee.Geometry.LineString(
            [[29.483160428965693, 43.24757920773356],
             [29.58409731861413, 43.228320291665675]]
            );
*/
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

////////////////     VH Band Functions     /////////////////

////////////////////////////////////////////////////////////

// Preprocessing Fuctions

var SpeckleFilter = function(img) {
    /*
    Input : image (img)
    
    the fuction reduces the noise on the VH 
    with the help of focal median function.
    it saves the original bands and
    adds the new low noise band
    
    Output: image with new band (VH_SpeckleFilter)
    */
    
    var VH_Band = img.select('VH'); //select the VV polarization band
    var VH_SpeckleFilter = VH_Band.focal_median(150,'circle','meters').rename('VH_SpeckleFilter');
    return img.addBands(VH_SpeckleFilter); // Add filtered VH band to original image
}

var OilSpillMask = function(img) {
    /*
    Input : image (img)
    
    the fuction mask the possible oil on the VH band
    with the help of threshold.
    it saves the original bands and
    adds the new oil mask band
    
    Output: image with new band (VH_OilSpillMask)
    */
  var VH_SpeckleFilter = img.select('VH_SpeckleFilter');
  //Identify all pixels below threshold and set them equal to 1. All other pixels set to 0
  var VH_OilSpillMask = VH_SpeckleFilter.lt(-40).rename('VH_OilSpillMask'); 
  VH_OilSpillMask = VH_OilSpillMask.updateMask(VH_OilSpillMask); //Remove all pixels equal to 0
  return img.addBands(VH_OilSpillMask);  //Return image with added classified oil band
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

var VH_SpeckleFilter = Sar.map(SpeckleFilter);

var VH_OilMask = VH_SpeckleFilter.map(OilSpillMask);

// Map Layers
Map.centerObject(blacksea,10);

Map.addLayer(Sar.first(),{bands: 'VH',min: -39, max: -22}, 'VH');

Map.addLayer(VH_SpeckleFilter.first(),{bands: 'VH_SpeckleFilter',min: -40, max: -20}, 'VH Speckle Filtered');

Map.addLayer(VH_OilMask.first(),{bands: 'VH_OilSpillMask'}, 'VH Oil Spill Mask');

Map.addLayer(profile);
// Histogram 

var VH_SpeckleFilterIMG = (ee.Image(VH_SpeckleFilter.first()).select("VH_SpeckleFilter"));

var VH_Histogram = ui.Chart.image.histogram(VH_SpeckleFilterIMG, blacksea, 10)
    .setSeriesNames(['VH_SpeckleFilter'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

print(VH_Histogram); // Display the histogram.

// Profile Analysis

var VH_Pixels = VH_SpeckleFilterIMG.reduceRegion(ee.Reducer.toList(), profile);

var VH_Data = ee.Array(VH_Pixels.get("VH_SpeckleFilter"));

var VH_ProfileChart = ui.Chart.array.values(VH_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        title: 'VH Band Profile Analysis',
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'dB'},
        colors: ['#e0440e']
    });

print(VH_ProfileChart);// Display the profile.
