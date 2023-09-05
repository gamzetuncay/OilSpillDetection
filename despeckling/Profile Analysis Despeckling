/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var profile = /* color: #e0440e */ee.Geometry.LineString(
        [[29.483160428965693, 43.24757920773356],
         [29.58409731861413, 43.228320291665675]]),
    blacksea = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[29.47313958640859, 43.192299005635455],
          [29.716212096174214, 43.192299005635455],
          [29.716212096174214, 43.313325457204904],
          [29.47313958640859, 43.313325457204904]]]);
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

////    2  Focal Median   

function FocalMedian(img, range, bandName) {
    /*
    Input : img = ee.Image type, the image which is processed
          : range = integer, the radius of focal median circle (ideally 150 for Sentinel 1)
          : band name = string, 
    
    the fuction reduces the noise on the VV 
    with the help of focal median function.
    it saves the original bands and
    adds the new low noise band
    
    Output: image with new band (VV_SpeckleFilter)
    */
    
    var band = img.select(bandName); //select the VV polarization band
    
    var newBandName = bandName.concat('_FocalMedian'); 
    
    var focalMedian = band.focal_median(range,'square','pixels').rename(newBandName);
    
    return img.addBands(focalMedian); // Add filtered band to original image
}

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
    
    //return img.addBands(frost); // Add filtered band to original image
   return img.addBands(frost); // Add filtered band to original image
}

////    4  Gamma Map

function GammaMap(img, kernelSize, bandName) {
  /*
    Input : img = ee.Image type, the image which is processed
          : kernelSize = integer, Square kernel should be odd (typically 3, 5 or 7)
          : band name = string,
          
    the fuction reduces the noise on the band with the help of Gamma MAP Filter function.
    the Gamma MAP filter works on preserving the edges while suppressing the noise. 
    the function saves the original bands and adds the new low noise band
    
    Output: image with new filtered band 
    
    source: https://groups.google.com/forum/#!msg/google-earth-engine-developers/a9W0Nlrhoq0/Hyu96dv1AgAJ
  */
  
  //// ENL = 4.4 for IW GRD Full Resolution with 10x10 m spacing
  // See: https://sentinel.esa.int/web/sentinel/user-guides/sentinel-1-sar/resolutions/level-1-ground-range-detected
  var enl = 4.4;
  // Convert image from dB to natural values
  var band = img.select(bandName);

  // Square kernel, kernelSize should be odd (typically 3, 5 or 7)
  var weights = ee.List.repeat(ee.List.repeat(1,kernelSize),kernelSize);
  
  // ~~(kernelSize/2) does integer division in JavaScript
  var kernel = ee.Kernel.fixed(kernelSize,kernelSize, weights, ~~(kernelSize/2), ~~(kernelSize/2), false);

  // Get mean and variance
  var mean = band.reduceNeighborhood(ee.Reducer.mean(), kernel);
  var variance = band.reduceNeighborhood(ee.Reducer.variance(), kernel);

  // "Pure speckle" threshold
  var ci = variance.sqrt().divide(mean);  // square root of inverse of enl

  // If ci <= cu, the kernel lies in a "pure speckle" area -> return simple mean
  var cu = 1.0/Math.sqrt(enl);
  
  // If cu < ci < cmax the kernel lies in the low textured speckle area -> return the filtered value
  var cmax = Math.sqrt(2.0) * cu;

  var alpha = ee.Image(1.0 + cu*cu).divide(ci.multiply(ci).subtract(cu*cu));
  var b = alpha.subtract(enl + 1.0);
  var d = mean.multiply(mean).multiply(b).multiply(b).add(alpha.multiply(mean).multiply(band).multiply(4.0*enl));
  var f = b.multiply(mean).add(d.sqrt()).divide(alpha.multiply(2.0));
  
  // If ci > cmax do not filter at all (i.e. we don't do anything, other then masking)
  
  // Compose a 3 band image with the mean filtered "pure speckle", the "low textured" filtered and the unfiltered portions
  var gmap = (mean.updateMask(ci.lte(cu))).addBands(f.updateMask(ci.gt(cu)).updateMask(ci.lt(cmax))).addBands(band.updateMask(ci.gte(cmax)));

  gmap = gmap.reduce(ee.Reducer.sum()) // compose
  
  var newBandName = bandName.concat('_GMAP'); 
  
  gmap = gmap.rename(newBandName);
  
  return img.addBands(gmap); // Add filtered band to original image
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

/*
////     MAP LAYERS

Map.addLayer(Sar,
             mapStretchSTD(Sar, 3, 'VV'),
             'VV');

Map.addLayer(FocalMedian(Sar, 9, 'VV'),
             mapStretchSTD(FocalMedian(Sar, 9, 'VV'), 3, 'VV_FocalMedian'),
             'VV Focal Median');

Map.addLayer(LeeSigma(Sar, 9, 'VV'),
             mapStretchSTD(LeeSigma(Sar, 9, 'VV'), 3, 'VV_LeeSigma'), 
            'VV Lee Sigma');
            

Map.addLayer(Frost(Sar, 9, 'VV',  -1),
             mapStretchSTD(Frost(Sar, 9, 'VV',  -1), 3, 'VV_Frost'), 
            'VV Frost');

Map.addLayer(GammaMap(Sar, 9, 'VV'),
             mapStretchSTD(GammaMap(Sar, 9, 'VV'), 3, 'VV_GMAP'), 
            'VV GMAP');


Map.centerObject(blacksea,9);
*/
/*
var Lee = LeeSigma(Sar, 9, 'VV').select('VV_LeeSigma');

Lee = Lee.visualize(mapStretchSTD(Lee, 3, 'VV_LeeSigma'));

// Export the image to Drive.
Export.image.toDrive({
  image: Lee,
  description: 'imageToAsset_VV_LeeSigma',
  region: blacksea,
  scale: 10
});
*/
/*
var profile = ee.Geometry.LineString(
            [[29.483160428965693, 43.24757920773356],
             [29.58409731861413, 43.228320291665675]]
            );
*/


// Profile Analysis
/*
var VV_Pixels = FocalMedian(Sar, 9, 'VV').reduceRegion(ee.Reducer.toList(), profile);

var VV_Data = ee.Array(VV_Pixels.get("VV_FocalMedian"));

var VV_ProfileChart = ui.Chart.array.values(VV_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        title: 'Focal Median Function Profile Analysis',
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'dB'},
        colors: ['#e0440e']
    });

print(VV_ProfileChart);// Display the profile.
*/
/*
var VV_Pixels = LeeSigma(Sar, 9, 'VV').reduceRegion(ee.Reducer.toList(), profile);

var VV_Data = ee.Array(VV_Pixels.get("VV_LeeSigma"));

var VV_ProfileChart = ui.Chart.array.values(VV_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        title: 'Lee Sigma Function Profile Analysis',
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'dB'},
        colors: ['#e0440e']
    });

print(VV_ProfileChart);// Display the profile.
*/
/*
var VV_Pixels = Frost(Sar, 9, 'VV',  -1).reduceRegion(ee.Reducer.toList(), profile);

var VV_Data = ee.Array(VV_Pixels.get("VV_Frost"));

var VV_ProfileChart = ui.Chart.array.values(VV_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        title: 'Frost Function Profile Analysis',
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'dB'},
        colors: ['#e0440e']
    });

print(VV_ProfileChart);// Display the profile.
*/
/*
var VV_Pixels = GammaMap(Sar, 9, 'VV').reduceRegion(ee.Reducer.toList(), profile);

var VV_Data = ee.Array(VV_Pixels.get("VV_GMAP"));

var VV_ProfileChart = ui.Chart.array.values(VV_Data, "0")
    .setChartType('LineChart')
    .setOptions({
        title: 'Gamma MAP Function Profile Analysis',
        hAxis: {title: 'Pixel Number'},
        vAxis: {title: 'dB'},
        colors: ['#e0440e']
    });

print(VV_ProfileChart);// Display the profile.
*/


