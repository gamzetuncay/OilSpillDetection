/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var blacksea = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Point([35.75392676352578, 43.497847582847264]),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[35.61075569083834, 43.608785904021545],
          [35.61075569083834, 43.394646627264486],
          [35.973316936499536, 43.394646627264486],
          [35.973316936499536, 43.608785904021545]]], null, false),
    line = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.LineString(
        [[35.6499260881909, 43.52707099845072],
         [35.82708062920653, 43.51113764094492]]),
    imageVisParam = {"opacity":1,"bands":["B4","B3","B2"],"gamma":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
article
https://www.mdpi.com/2072-4292/8/10/875
*/
Map.centerObject(blacksea,11);

var sar = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
    .filter(ee.Filter.eq('instrumentMode','IW'))
    .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
    .filterDate('2015-09-20', '2015-09-30')
    .filterBounds(blacksea);
    
//print(sar);
//Map.addLayer(sar.select(['VV']),{min:-40, max:40});


// Filter speckle noise 
// focal median kullanıyor ama sigma lee eklemeye çalışacağım
var filterSpeckles = function(img) {
  var vv = img.select('VV') //select the VV polarization band
  var vv_smoothed = vv.focal_median(150,'circle','meters').rename('VV_Filtered') //Apply a focal median filter
  return img.addBands(vv_smoothed) // Add filtered VV band to original image
}

// Map speckle noise filter across image.
var sar_speckle = sar.map(filterSpeckles)
//print(sar_speckle)
Map.addLayer(sar_speckle.first(),{bands: 'VV_Filtered',min: -40, max: 40}, 'Filtered SAR image')



// add mask for possible oil
var classifyPossibleOil = function(img) {
  var vv = img.select('VV_Filtered')
  var oil = vv.lt(-25).rename('Oil')  //Identify all pixels below threshold and set them equal to 1. All other pixels set to 0
  oil = oil.updateMask(oil) //Remove all pixels equal to 0
  return img.addBands(oil)  //Return image with added classified oil band
}

//Map classification across sentinel-1 collection and print to console to inspect
var sar_oil = sar_speckle.map(classifyPossibleOil)
//print(sar_oil)
Map.addLayer(sar_oil.first(),{bands: 'Oil'}, 'Oil spill mask')


///////// VV histogram and profile analysis //////////
var VV_speckle = (ee.Image(sar_oil.first()).select("VV_Filtered"));

var region = geometry;

// Make the histogram, set the options.
var histogram = ui.Chart.image.histogram(VV_speckle, region, 10)
    .setSeriesNames(['VV_Filtered'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'count of DN'}});

// Display the histogram.
print(histogram);

var profile = line

var VVpixels = VV_speckle.reduceRegion(ee.Reducer.toList(), profile);
var VVdata = ee.Array(VVpixels.get("VV_Filtered"));

var chartVV = ui.Chart.array.values(VVdata, "0")
  .setChartType('LineChart')
  .setOptions({
      hAxis: {title: 'Pixel Number'},
      vAxis: {title: 'DN'},
      colors: ['#e0440e']
  });
print(chartVV);

///////// VH histogram and profile analysis //////////
var VH = (ee.Image(sar_oil.first()).select("VH"));
print(VH)


// Make the histogram, set the options.
var histogramVH = ui.Chart.image.histogram(VH, region, 10)
    .setSeriesNames(['VH_Filtered'])
    .setOptions({
       hAxis: {title: 'DN'},
       vAxis: {title: 'Frequency'}});

// Display the histogram.
print(histogramVH);

var VHpixels = VH.reduceRegion(ee.Reducer.toList(), profile);
var VHdata = ee.Array(VHpixels.get("VH"));

var chartVH = ui.Chart.array.values(VHdata, "0")
  .setChartType('LineChart')
  .setOptions({
      hAxis: {title: 'Pixel Number'},
      vAxis: {title: 'DN'},
      colors: ['#e0440e']
  });
print(chartVH);



var landsat = ee.ImageCollection('LANDSAT/LC08/C01/T2')
    .filterDate('2015-09-20', '2015-10-30')
    .filterBounds(geometry);

print(landsat);
Map.addLayer(landsat);
/***
 * Computes ln(AGB)=5.349+0.96*ln(D^2H)
 * TOA = 0.0003342 * “Band 10” + 0.1
 * BT = (1321.0789 / Ln ((774.8853 / “%TOA%”) + 1)) – 273.15
 * NDVI = (Band 5 – Band 4) / (Band 5 + Band 4)
 * Pv = Square((“NDVI” – 0.216901) / (0.632267 – 0.216901))
 * ε = 0.004 * Pv + 0.986
 * LST = (BT / (1 + (0.00115 * BT / 1.4388) * Ln(ε)))
 */

/*
var LST = function(img) {
  var toa = img.select('B10').multiply(0.0003342).add(0.1) 
  var bt= 
  var ndvi=img.select('B5').subtract(img.select('B4')).divide(img.select('B5').add(img.select('B4')))
  var pv =ndvi.subtract(0.216901).divide(0.632267-0.216901).pow(2)
  var emissivity=.multiply(0.004).add(0.986)
  var lst = bt.divide(bt.multiply(0.00115).divide(1.4388).multiply(emissivity.log()).add(1))
}
*/