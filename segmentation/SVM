/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #ff8d4f */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[41.101017919801635, 41.9736540602717],
                  [41.10385033252136, 41.97033580008035],
                  [41.106253591798705, 41.974355977775865],
                  [41.10316368701355, 41.976908339854916]]]),
            {
              "Landcover": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.123720136903685, 41.984883812061334],
                  [41.126466718934935, 41.98217226359162],
                  [41.12852665545837, 41.98555370624699],
                  [41.125994650148314, 41.98778663595922]]]),
            {
              "Landcover": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.15521772261516, 41.95129773762096],
                  [41.156676844319264, 41.95043598053186],
                  [41.15732057448284, 41.9515211542238],
                  [41.15594728346721, 41.95257439337524]]]),
            {
              "Landcover": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.13912446852581, 41.94899969282729],
                  [41.138652399739186, 41.9519679850802],
                  [41.1367641245927, 41.95308504851735]]]),
            {
              "Landcover": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.146677569111745, 41.93402845698524],
                  [41.149424151142995, 41.93402845698524],
                  [41.148394182881276, 41.937348607902045],
                  [41.145905092915456, 41.937603996967255]]]),
            {
              "Landcover": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.15228564131621, 41.90209475259613],
                  [41.15503222334746, 41.89934773840847],
                  [41.157177990559376, 41.89973104980799],
                  [41.15726382124785, 41.901647572292994],
                  [41.15657717574004, 41.9038195615722],
                  [41.15340144026641, 41.903883442491335]]]),
            {
              "Landcover": 1,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.1764898954666, 41.9033723933486],
                  [41.176404064778126, 41.90126427239769],
                  [41.1764898954666, 41.899219967430646],
                  [41.178206509236134, 41.89877276699509],
                  [41.17880732405547, 41.90049766570455],
                  [41.17846400130156, 41.90318074886551],
                  [41.176661556843555, 41.9047138886241]]]),
            {
              "Landcover": 1,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.17641103113566, 41.772465536197295],
                  [41.177955983528236, 41.772785596416966],
                  [41.17555272425089, 41.775282011320506]]]),
            {
              "Landcover": 1,
              "system:index": "7"
            })]),
    geometry2 = 
    /* color: #8cff3b */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[41.01831090296183, 41.89544287146677],
                  [41.01831090296183, 41.88266372699245],
                  [41.03204381311808, 41.88266372699245],
                  [41.03204381311808, 41.89544287146677]]], null, false),
            {
              "Landcover": 2,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.222931264289954, 41.91894981771527],
                  [41.222931264289954, 41.9107744703105],
                  [41.231171010383704, 41.9107744703105],
                  [41.231171010383704, 41.91894981771527]]], null, false),
            {
              "Landcover": 2,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.59852635706339, 42.10516543215791],
                  [41.59852635706339, 42.10312766791361],
                  [41.60264623011027, 42.10312766791361],
                  [41.60264623011027, 42.10516543215791]]], null, false),
            {
              "Landcover": 2,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.56453740442667, 41.846357017968316],
                  [41.56453740442667, 41.84328790064789],
                  [41.569000600227454, 41.84328790064789],
                  [41.569000600227454, 41.846357017968316]]], null, false),
            {
              "Landcover": 2,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[41.058136342414954, 42.15074327866161],
                  [41.058136342414954, 42.14667061581598],
                  [41.06328618372355, 42.14667061581598],
                  [41.06328618372355, 42.15074327866161]]], null, false),
            {
              "Landcover": 2,
              "system:index": "4"
            })]);
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

///////////////DATASET
// 1 Study Area
var region010316 = ee.Geometry.Rectangle(
                [41.68959635214067, 41.76163098915713,
                40.995101907596016, 42.27757741759697], null, true);    
    // Dataset
    var sar010316 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2016-03-01','2016-03-10')
        .filterBounds(region010316)
        .mosaic()
        .clip(region010316);

 
// 2 Study Area
var region080819 = ee.Geometry.Rectangle(
                [29.35239035861587,43.39975485811164,
                 30.05949869815924,42.88380842002836], null, true);

    // Dataset
    var sar080819 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-08-08','2019-08-09')
        .filterBounds(region080819)
        .mosaic()
        .clip(region080819);


// 3 Study Area
var region210719 = ee.Geometry.Rectangle(
                [29.180880485613216, 42.809049704488125,
                29.881258903581966, 42.29310326379858], null, true);

    // Dataset
    var sar210719 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-07-21', '2019-07-26')
        .filterBounds(region210719)
        .mosaic()
        .clip(region210719);


// 4 Study Area
var region220519 = ee.Geometry.Rectangle(
                [30.5878268333208, 42.96969847052448,
                 29.87972286728966, 43.48564490868279], null, true);

    // Dataset
    var sar220519 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-05-22', '2019-05-23')
        .filterBounds(region220519)
        .mosaic()
        .clip(region220519);


// 5 Study Area
var region250915 = ee.Geometry.Rectangle(
                [36.215817911076336, 43.323600262718614,
                 35.503564816425694, 43.83954667563497], null, true);

    // Dataset
    var sar250915 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2015-09-25', '2015-09-26')
        .filterBounds(region250915);



// Display the sample region.
var LeeSigma010316 = LeeSigma(sar010316, 7, 'VV',  -1).select('VV_LeeSigma');

Map.addLayer(LeeSigma010316)

var trainingareas = geometry.merge(geometry2)

var training = LeeSigma010316.sampleRegions({
  collection: trainingareas,
  properties: ['Landcover'],
  scale: 10
})

// Instantiate the clusterer and train it.
var classifier = ee.Classifier.libsvm().train({
  features: training,
  classProperty: "Landcover"
});

var classified = LeeSigma010316.classify(classifier);

var mapViz = {
  min:1,
  max:2,
  scale: 10,
  palette: ['blue','black']
};


Map.addLayer(classified, mapViz, 'SVM');












