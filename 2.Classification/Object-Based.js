/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var polygon = /* color: #ffc82d */ee.Geometry.Polygon(
        [[[-96.98455810546875, 27.754038315679356],
          [-97.2509765625, 27.82936085978979],
          [-97.39654541015625, 27.60323689456203],
          [-97.1026611328125, 27.520451064122117]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

////    1  Lee Sigma

function LeeSigma(img, kernelSize, bandName) {
    /*
    Input : img = ee.Image type, the image which is processed
          : kernelSize = integer, Square kernel should be odd (typically 3, 5 or 7)
          : band name = string, 
    
    the fuction reduces the noise on the band
    with the help of Lee Sigma Filter function.
    it saves the original bands and
    adds the new low noise band
    
    Output: image with new filtered band 
    */
    
    var band = img.select(bandName);
    
    // ~~(kernelSize/2) does integer division in JavaScript
    var distance_kernel = ee.Kernel.euclidean(~~(kernelSize/2));

    var weights = ee.List.repeat(ee.List.repeat(1,kernelSize),kernelSize);
  
    var kernel = ee.Kernel.fixed(kernelSize, kernelSize, weights, ~~(kernelSize/2),~~(kernelSize/2), false);

    var band_mean = band.reduceNeighborhood(ee.Reducer.mean(), kernel);
    
    var band_square = band.multiply(band);
    
    var band_square_mean = band_square.reduceNeighborhood(ee.Reducer.mean(), kernel);
    
    var band_variance = band_square_mean.subtract( band_mean.multiply(band_mean));
    
    var overall_variance = band.reduceNeighborhood(ee.Reducer.variance(), kernel);
    
    var band_weights = (band_variance.multiply(band_variance)).divide((band_variance.multiply(band_variance)).add(overall_variance.multiply(overall_variance)));
    
    var band_filtered = band_mean.add(band_weights.multiply(band.subtract(band_mean)));
    
    var new_band_name = bandName.concat('_LeeSigma');
    
    var band_filtered2 = band_filtered.rename(new_band_name);
    
    return img.addBands(band_filtered2); //Add filtered band to original image
}

////    DATASET

var blacksea = ee.Geometry.Polygon([
            [[29.47313958640859,43.192299005635455],
             [29.716212096174214,43.192299005635455],
             [29.716212096174214,43.313325457204904],
             [29.47313958640859,43.313325457204904]]
            ]);


            
var start_date = '2019-08-08';
var end_date = '2019-08-09';
var Sar = ee.ImageCollection('COPERNICUS/S1_GRD')
            .filterBounds(blacksea)
            .filterDate(start_date,end_date)           
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV')) 
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
            .filter(ee.Filter.eq('instrumentMode','IW'))
            .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
            .first();

Sar = LeeSigma(Sar, 9, 'VV');

// Load the image from the archive.
var image = Sar
// Define visualization parameters in an object literal.

// Center the map on the image and display.
Map.centerObject(blacksea, 9);

// Compute the histogram of the VV band.  The mean and variance are only FYI.
var histogram = image.select('VV_LeeSigma').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: blacksea, 
  scale: 10,
  bestEffort: true
});
print(histogram);

var VV_Histogram = ui.Chart.image.histogram(image.select('VV_LeeSigma'), blacksea, 10)
    .setSeriesNames(['VV'])
    .setOptions({
       title: 'Histogram of VV Band',
       hAxis: {title: 'dB'},
       colors: ['#55a839'],
       vAxis: {title: 'Frequency'}});

// Chart the histogram
print(VV_Histogram);

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

var threshold = otsu(histogram.get('VV_LeeSigma_histogram'));
print('threshold', threshold);

var classA = image.select('VV').lt(threshold);




print(ee.Number(10.0).pow(threshold.divide(10.0))) // Natural Number

var binary = Sar.select('VV').lt(threshold).selfMask().rename('binary')

var objectID = binary.connectedComponents({
  connectedness: ee.Kernel.square(5),
  maxSize:256
});
Map.addLayer(Sar)

Map.addLayer(objectID.randomVisualizer(),null, 'dark spots');

var objectSize = objectID.select('labels')
  .connectedPixelCount({
    maxSize: 128, eightConnected: true
  });

Map.addLayer(objectSize, null, 'Object n pixels');

var pixelArea = ee.Image.pixelArea();

var objectArea = objectSize.multiply(pixelArea);

Map.addLayer(objectArea, null, 'Object area m^2');

var areaMask = objectArea.gte(10000);

objectID = objectID.updateMask(areaMask);
Map.addLayer(objectID, null, 'Large dark spots');

