/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var polygon = /* color: #ffc82d */ee.Geometry.Polygon(
        [[[-96.98455810546875, 27.754038315679356],
          [-97.2509765625, 27.82936085978979],
          [-97.39654541015625, 27.60323689456203],
          [-97.1026611328125, 27.520451064122117]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
////    3  Frost
function Frost(img, kernelSize, bandName,  dampingFactor){
    /*
    Input : img = ee.Image type, the image which is processed
          : kernelSize = integer, Square kernel should be odd (typically 3, 5 or 7)
          : band name = string,
          : damping factor = integer, it is an exponential damping is the key factor 
                                      in controlling the smoothness of the filter. 
                                      When damping factor is small, the image tends to be smooth. 
    
    the fuction reduces the noise on the band with the help of Frost Filter function.
    the frost filter works on preserving the edges while suppressing the noise. 
    the function saves the original bands and adds the new low noise band
    
    Output: image with new filtered band 
    
    source: https://groups.google.com/forum/#!msg/google-earth-engine-developers/a9W0Nlrhoq0/Hyu96dv1AgAJ
    */
    
    var band = img.select(bandName);
    
    // ~~(kernelSize/2) does integer division in JavaScript
    var distance_kernel = ee.Kernel.euclidean(~~(kernelSize/2));
  
    var weights = ee.List.repeat(ee.List.repeat(1,kernelSize),kernelSize);
    
    var kernel = ee.Kernel.fixed(kernelSize, kernelSize, weights, ~~(kernelSize/2), ~~(kernelSize/2), false);
    
    // Get mean and variance
    var mean = band.reduceNeighborhood(ee.Reducer.mean(), kernel);
    
    var variance = band.reduceNeighborhood(ee.Reducer.variance(), kernel);
    
    var B = variance.multiply(dampingFactor).divide(mean.multiply(mean));
    
    var W = B.exp().reduceNeighborhood(ee.Reducer.mean(), distance_kernel);
    
    var frost = band.multiply(W).reduceNeighborhood(ee.Reducer.sum(), kernel).divide(W.reduceNeighborhood(ee.Reducer.sum(), kernel));
    
    var newBandName = bandName.concat('_Frost'); 
    
    frost = frost.rename(newBandName);
    
   return img.addBands(frost); // Add filtered band to original image
}


// 1 Study Area
var region010316 = ee.Geometry.Rectangle(
                [41.68959635214067, 41.76163098915713,
                40.995101907596016, 42.27757741759697], null, true);    
    // Dataset
    var sar1 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2016-03-08','2016-03-10')
        .filterBounds(region010316);
    print(sar1);
    

// 2 Study Area
var region080819 = ee.Geometry.Rectangle(
                [29.35239035861587,43.39975485811164,
                 30.05949869815924,42.88380842002836], null, true);

    // Dataset
    var sar2 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-08-08','2019-08-09')
        .filterBounds(region080819);
    print(sar2);
    

// 3 Study Area
var region210719 = ee.Geometry.Rectangle(
                [29.180880485613216, 42.809049704488125,
                29.881258903581966, 42.29310326379858], null, true);

    // Dataset
    var sar3 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-07-21', '2019-07-26')
        .filterBounds(region210719);
    print(sar3);
    
    
// 4 Study Area
var region220519 = ee.Geometry.Rectangle(
                [30.5878268333208, 42.96969847052448,
                 29.87972286728966, 43.48564490868279], null, true);

    // Dataset
    var sar4 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-05-22', '2019-05-23')
        .filterBounds(region220519);
    print(sar4);
    
    
// 5 Study Area
var region250915 = ee.Geometry.Rectangle(
                [36.215817911076336, 43.323600262718614,
                 35.503564816425694, 43.83954667563497], null, true);

    // Dataset
    var sar5 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2015-09-25', '2015-09-26')
        .filterBounds(region250915);
    print(sar5);
    
    


sar1 = Frost(sar1.first(), 9, 'VV',-1);
sar2 = Frost(sar2.first(), 9, 'VV',-1);
sar3 = Frost(sar3.first(), 9, 'VV',-1);
sar4 = Frost(sar4.first(), 9, 'VV',-1);
sar5 = Frost(sar5.first(), 9, 'VV',-1);

sar1 = sar1.clip(region010316);
sar2 = sar2.clip(region080819);
sar3 = sar3.clip(region210719);
sar4 = sar4.clip(region220519);
sar5 = sar5.clip(region250915);


// Compute the histogram of the VV band.  The mean and variance are only FYI.
var histogram1 = sar1.select('VV_Frost').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: region010316, 
  scale: 10,
  bestEffort: true
});
var histogram2 = sar2.select('VV_Frost').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: region080819, 
  scale: 10,
  bestEffort: true
});
var histogram3 = sar3.select('VV_Frost').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: region210719, 
  scale: 10,
  bestEffort: true
});
var histogram4 = sar4.select('VV_Frost').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: region220519, 
  scale: 10,
  bestEffort: true
});
var histogram5 = sar5.select('VV_Frost').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: region250915, 
  scale: 10,
  bestEffort: true
});



// Return the DN that maximizes interclass variance in VV (in the region).
var otsu = function(histogram) {
  var counts = ee.Array(ee.Dictionary(histogram).get('histogram'));
  var means = ee.Array(ee.Dictionary(histogram).get('bucketMeans'));
  var size = means.length().get([0]);
  var total = counts.reduce(ee.Reducer.sum(), [0]).get([0]);
  var sum = means.multiply(counts).reduce(ee.Reducer.sum(), [0]).get([0]);
  var mean = sum.divide(total);
  
  var indices = ee.List.sequence(1, size);
  
  // Compute between sum of squares, where each mean partitions the data.
  var bss = indices.map(function(i) {
    var aCounts = counts.slice(0, 0, i);
    var aCount = aCounts.reduce(ee.Reducer.sum(), [0]).get([0]);
    var aMeans = means.slice(0, 0, i);
    var aMean = aMeans.multiply(aCounts)
        .reduce(ee.Reducer.sum(), [0]).get([0])
        .divide(aCount);
    var bCount = total.subtract(aCount);
    var bMean = sum.subtract(aCount.multiply(aMean)).divide(bCount);
    return aCount.multiply(aMean.subtract(mean).pow(2)).add(
           bCount.multiply(bMean.subtract(mean).pow(2)));
  });
  var BSS_Histogram = ui.Chart.array.values(ee.Array(bss), 0, means)
      .setSeriesNames(['VV'])
      .setOptions({
         title: 'Histogram of Between Sum of Squares for VV Band',
         hAxis: {title: 'dB'},
         colors: ['#55a839'],
         vAxis: {title: 'Between Sum of Squares Frequency '}});
  print(BSS_Histogram);
  
  // Return the mean value corresponding to the maximum BSS.
  return means.sort(bss).get([-1]);
};


var threshold1 = otsu(histogram1.get('VV_Frost_histogram'));
print('threshold1', threshold1);
var threshold2 = otsu(histogram2.get('VV_Frost_histogram'));
print('threshold2', threshold2);
var threshold3 = otsu(histogram3.get('VV_Frost_histogram'));
print('threshold3', threshold3);
var threshold4 = otsu(histogram4.get('VV_Frost_histogram'));
print('threshold4', threshold4);
var threshold5 = otsu(histogram5.get('VV_Frost_histogram'));
print('threshold5', threshold5);

var oil1 = sar1.select('VV_Frost').lt(threshold1.add(-6));
var oil2 = sar2.select('VV_Frost').lt(threshold2);
var oil3 = sar3.select('VV_Frost').lt(threshold3);
var oil4 = sar4.select('VV_Frost').lt(threshold4);
var oil5 = sar5.select('VV_Frost').lt(threshold5);

////     MAP LAYERS
var imageVisParam = {"opacity":1,"bands":["VV"],"min":-40,"gamma":1}
Map.addLayer(sar1, imageVisParam, 'sar1')
Map.addLayer(sar2, imageVisParam, 'sar2')
Map.addLayer(sar3, imageVisParam, 'sar3')
Map.addLayer(sar4, imageVisParam, 'sar4')
Map.addLayer(sar5, imageVisParam, 'sar5')

Map.addLayer(oil1.mask(oil1), {palette: 'red'}, 'oil1');
Map.addLayer(oil2.mask(oil2), {palette: 'red'}, 'oil2');
Map.addLayer(oil3.mask(oil3), {palette: 'red'}, 'oil3');
Map.addLayer(oil4.mask(oil4), {palette: 'red'}, 'oil4');
Map.addLayer(oil5.mask(oil5), {palette: 'red'}, 'oil5');