/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageVisParam = {"opacity":1,"bands":["VV"],"min":-31.915225122880024,"max":-5.762524957436382,"gamma":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
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

////     DATASET

// 1 Study Area
var region080316 = ee.Geometry.Rectangle(
                [41.68959635214067, 41.76163098915713,
                40.995101907596016, 42.27757741759697], null, true);

    var sar1 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2016-03-08','2016-03-10')
        .filterBounds(region080316);

// 2 Study Area
var region080819 = ee.Geometry.Rectangle(
                [29.35239035861587,43.39975485811164,
                 30.05949869815924,42.88380842002836], null, true);

    var sar2 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-08-08','2019-08-09')
        .filterBounds(region080819);
    
// 3 Study Area
var region210719 = ee.Geometry.Rectangle(
                [29.180880485613216, 42.809049704488125,
                29.881258903581966, 42.29310326379858], null, true);

    var sar3 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-07-21', '2019-07-26')
        .filterBounds(region210719);

// 4 Study Area
var region220519 = ee.Geometry.Rectangle(
                [30.5878268333208, 42.96969847052448,
                 29.87972286728966, 43.48564490868279], null, true);

    var sar4 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2019-05-22', '2019-05-23')
        .filterBounds(region220519);

// 5 Study Area
var region250915 = ee.Geometry.Rectangle(
                [36.215817911076336, 43.323600262718614,
                 35.503564816425694, 43.83954667563497], null, true);

    var sar5 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation','VH'))
        .filter(ee.Filter.eq('instrumentMode','IW'))
        .filter(ee.Filter.eq('orbitProperties_pass','DESCENDING'))
        .filterDate('2015-09-25', '2015-09-26')
        .filterBounds(region250915);

// List of study areas and images

var regions = ee.List([region080316, region080819, region210719, region220519, region250915]);
var images = ee.List([sar1, sar2, sar3, sar4, sar5]);

var couple = images.zip(regions);

for (var i = 0; i<5; i++){
  var re = ee.List(couple.get(i)).get(1);
  var descriptionName = 'image'.concat((i+1).toString());
  var imcol = ee.ImageCollection(ee.List(couple.get(i)).get(0));
  print(imcol)

  
  if(i==1 || i==2){
    var imcol = ee.ImageCollection(ee.List(couple.get(i)).get(0));
    var parameter = mapStretchSTD(imcol.first(), 3, 'VV');
    imcol = imcol.map(function(image){
      return image.visualize(parameter);
    })
    var im = imcol.mosaic();
  }
  
  else{
    var im = ee.ImageCollection(ee.List(couple.get(i)).get(0)).first();
    im = im.visualize(mapStretchSTD(im, 3, 'VV'));
  }

  print(im)
  
  Export.image.toDrive({
    image: im,
    folder: 'Bitirme/görüntüler',
    description: descriptionName,
    scale: 10,
    region: re
    });
  
}

