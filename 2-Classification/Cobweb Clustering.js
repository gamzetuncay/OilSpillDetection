

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


////     Map Setting Function

function mapStretchSTD(img, sigma, band_name){
      /*
    Input : img = ee.Image type, the image which is processed
          : sigma = integer,  σ (typically 1, 2, or 3)
          : band name = string
    
    the fuction sets the visualisation paramaters of image
    
    Output: dictionary
    */
    
    var mean = img.reduceRegion({
     reducer: ee.Reducer.mean(),
      geometry: img.geometry(),
     bestEffort: true});
     
    var std = img.reduceRegion({
      reducer: ee.Reducer.stdDev(),
      geometry: img.geometry(),
      bestEffort: true});
      
    var min = ee.Dictionary(mean.map(function(key, val){
        return ee.Number(val).subtract(ee.Number(std.get(key)).multiply(sigma));
      }).getInfo());
    var max = ee.Dictionary(mean.map(function(key, val){
        return ee.Number(val).add(ee.Number(std.get(key)).multiply(sigma));
      }).getInfo());
  
    return {bands:band_name,
           min: min.get(band_name).getInfo(),
           max: max.get(band_name).getInfo()};
}


////     MAP LAYERS

Map.addLayer(Sar,
             mapStretchSTD(Sar, 3, 'VV'),
             'VV');

Map.addLayer(LeeSigma(Sar, 9, 'VV'),
             mapStretchSTD(LeeSigma(Sar, 9, 'VV'), 3, 'VV_LeeSigma'), 
            'VV Lee Sigma');


// Display the sample region.
var LeeSigma = LeeSigma(Sar, 9, 'VV',  -1).select('VV_LeeSigma');

// Make the training dataset.
var training = LeeSigma.sample({
  region: blacksea,
  scale: 10,
  numPixels: 5000
});
/*
// Instantiate the clusterer and train it.
var clusterer = ee.Clusterer.wekaCascadeKMeans(2,2).train(training);

// Cluster the input using the trained clusterer.
var result = LeeSigma.cluster(clusterer,'Oil');
*/
var clusterer = ee.Clusterer.wekaCobweb().train(training);
var result = LeeSigma.cluster(clusterer, 'Oil');
// Histogram of Clustered Image

var Cluster_Histogram = ui.Chart.image.histogram(result.select('Oil'), blacksea, 10)
    .setOptions({
       title: 'Histogram of VV Band',
       hAxis: {title: 'Classes'},
       colors: ['#55a839'],
       vAxis: {title: 'Frequency'}});
       
print(Cluster_Histogram)

result = result.select('Oil').gte(4);
result = result.mask(result);
// Display the clusters with random colors.

Map.addLayer(result, {palette: '#55a839'}, 'clusters');
