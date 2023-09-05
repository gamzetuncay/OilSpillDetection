// DATE
var start_date = '2017-01-01';
var end_date = '2017-12-31';

// REGION
var region = ee.FeatureCollection(locations);

// CALCULATED INDICES
///// Normalized Difference Vegetation Index (NDVI):
// Landsat 8: (Band 5 – Band 4) / (Band 5 + Band 4)
var addNDVI8 = function(image) {
	return image.addBands(image.normalizedDifference(['B5', 'B4']).rename('NDVI'));
};
// Enhanced Vegetation Index (EVI)
// Landsat 8: 2.5 * ((Band 5 – Band 4) / (Band 5 + 6 * Band 4 – 7.5 * Band 2 + 1))
var addEVI8 = function(image) {
	return image.addBands(image.expression('2.5*((B5-B4)/(B5+6*B4-7.5*B2+1))', {
		'B2': image.select('B2'), 
		'B4': image.select('B4'), 
		'B5': image.select('B5')
}).rename('EVI')
)};
///// Soil Adjusted Vegetation Index (SAVI)
// Landsat 8: ((Band 5 – Band 4) / (Band 5 + Band 4 + 0.5)) * (1.5)
var addSAVI8 = function(image) {
	return image.addBands(image.expression('((B5-B4)/(B5+B4+0.5))*1.5', {
		'B4': image.select('B4'), 
		'B5': image.select('B5')
}).rename('SAVI')
)};
///// Modified Soil Adjusted Vegetation Index (MSAVI)
// Landsat 8: (2 * Band 5 + 1 – sqrt ((2 * Band 5 + 1)^2 – 8 * (Band 5 – Band 4))) / 2
var addMSAVI8 = function(image) {
	return image.addBands(image.expression('(2*B5+1-sqrt((2*B5+1)**2-8*(B5-B4)))/2', {
		'B4': image.select('B4'), 
		'B5': image.select('B5')
}).rename('MSAVI')
)};
///// Normalized Difference Moisture Index (NDMI)
// Landsat 8: (Band 5 – Band 6) / (Band 5 + Band 6)
var addNDMI8 = function(image) {
	return image.addBands(image.normalizedDifference(['B5', 'B6']).rename('NDMI'));
};
///// Normalized Burn Ratio (NBR)
// Landsat 8: (Band 5 – Band 7) / (Band 5 + Band 7)
var addNBR8 = function(image) {
	return image.addBands(image.normalizedDifference(['B5', 'B7']).rename('NBR'));
};
///// Normalized Burn Ratio 2 (NBR2)
// Landsat 8: (Band 6 – Band 7) / (Band 6 + Band 7)
var addNBR28 = function(image) {
	return image.addBands(image.normalizedDifference(['B6', 'B7']).rename('NBR2'));
};
///// Normalized Difference Water Index (NDWI)
// Landsat 8: (Band 3 – Band 5) / (Band 3 + Band 5)
var addNDWI8 = function(image) {
	return image.addBands(image.normalizedDifference(['B3', 'B5']).rename('NDWI'));
};

// IMAGE COLLECTION
var l8toa = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT_TOA')
	.filterBounds(region)
	.filterDate(start_date, end_date)
	.map(addNDVI8)
	.map(addEVI8)
	.map(addSAVI8)
	.map(addMSAVI8)
	.map(addNDMI8)
	.map(addNBR8)
	.map(addNBR28)
	.map(addNDWI8)
	.map(cloudMask);

var l8toa_sel = l8toa.select('B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'NDVI', 'EVI', 'SAVI', 'MSAVI', 'NDMI', 'NBR', 'NBR2', 'NDWI');

// CONVERT THERMAL BANDS TO CELSIUS
var toCelsius_l8 = function(image){
	var time = image.get('system:time_start');
	var celsius = image.expression('(B10/(1+(10.8*B10/14388)*log((0.004*((ndvi-0.2)/0.3)+0.986))))-273',{'ndvi': image.select('NDVI'), 'B10': image.select('B10')})
	.rename("celsius")
	.set('system:time_start',time);
	return celsius;
};

var temp_l8 = l8toa_sel.map(toCelsius_l8);

// Visualization test

// Also worth seeing is this: https://developers.google.com/earth-engine/landsat

var temp_median = temp_l8.median();

var visParams = {min: [0],max: [40]};

Map.addLayer(temp_median, visParams, 'Land Surface Temperature');











