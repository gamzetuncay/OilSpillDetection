/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var profile = 
    /* color: #e0440e */
    /* shown: false */
    ee.Geometry.LineString(
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


////    DATASETS

// 1 Study Area
var region220519 = ee.Geometry.Rectangle(
                [30.5878268333208, 42.96969847052448,
                 29.87972286728966, 43.48564490868279], null, true);
    // Dataset
    var Sar1 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-05-22', '2019-05-23')
        .filterBounds(region220519)
        .first()
        .clip(region220519);
        
// 2 Study Area
var region010316 = ee.Geometry.Rectangle(
                [40.913478657799565, 42.151626166366206,
                 41.606601850041095, 41.63567973784369], null, true);
    // Dataset
    var Sar2 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2016-03-01','2016-03-10')
        .filterBounds(region010316)
        .first()
        .clip(region010316);


// 3 Study Area
var region250915 = ee.Geometry.Rectangle(
                [36.215817911076336, 43.323600262718614,
                 35.503564816425694, 43.83954667563497], null, true);
    // Dataset
    var Sar3 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2015-09-25', '2015-09-26')
        .filterBounds(region250915)
        .mosaic()
        .clip(region250915);

var SarCol = [Sar1,Sar2,Sar3];


////    EXECUTION TIME 
var focalexetime = 0;
var leeexetime = 0;
var frostexetime = 0;
var gmapexetime = 0;
var m = [];
var l = [];
var f = [];
var g = [];

var KernelSize = [3,5,7,9,11,13,15];

for(var i = 0; i<7; i++){
  for(var k=0; k<3; k++){
    var Sar = SarCol[k];
  
    for (var j = 0; j<1000; j++){
      var kernelSize = KernelSize[i];
      
      var start1 = new Date().getTime();
      var Focal = FocalMedian(Sar, kernelSize, 'VV');
      var end1 = new Date().getTime()-start1;
      
      var start2 = new Date().getTime();
      var lee = LeeSigma(Sar, kernelSize, 'VV');
      var end2 = new Date().getTime()-start2;
      
      var start3 = new Date().getTime();
      var frost = Frost(Sar, kernelSize, 'VV',  -1);
      var end3 = new Date().getTime()-start3;
      
      var start4 = new Date().getTime();
      var gmap = GammaMap(Sar, kernelSize, 'VV');
      var end4 = new Date().getTime()-start4; 
      
      
      focalexetime = focalexetime + end1;
      leeexetime = leeexetime + end2;
      frostexetime = frostexetime + end3;
      gmapexetime = gmapexetime + end4;
    }
  
    m.push(focalexetime/1000);
    l.push(leeexetime/1000);
    f.push(frostexetime/1000);
    g.push(gmapexetime/1000);
    
    focalexetime = 0;
    leeexetime = 0;
    frostexetime = 0;
    gmapexetime = 0;
  }
}
print('focal',m)
print('lee',l)
print('frost',f)
print('gmap',g)



// The getTime() method returns the number of milliseconds since midnight of January 1, 1970.






