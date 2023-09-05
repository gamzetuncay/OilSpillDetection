// LST COMPUTATION 

var TOA = function(image) {
	return image.addBands(image.expression('0.0003342 * B10 + 0.1', {
		'B10': image.select('B10')
}).rename('TOA')
)};

var BT = function(image) {
	return image.addBands(image.expression('(1321.0789 / log((774.8853 / TOA) + 1)) – 273.15', {
		'TOA': image.select('TOA')
}).rename('BT')
)};

var NDVI = function(image) {
	return image.addBands(image.normalizedDifference(['B5', 'B4']).rename('NDVI'));
};

var PV = function(image) {
	return image.addBands(image.expression('((NDVI – 0.216901) / (0.632267 – 0.216901))*((NDVI – 0.216901) / (0.632267 – 0.216901))', {
		'NDVI': image.select('NDVI')
}).rename('PV')
)};
var Emissivity = function(image) {
	return image.addBands(image.expression('0.004 * PV + 0.986', {
		'PV': image.select('PV')
}).rename('Emissivity')
)};
var LST = function(image) {
	return image.addBands(image.expression('(BT / (1 + (0.00115 * BT / 1.4388) * log(Emissivity)))', {
		'BT': image.select('BT'),
		'Emissivity': image.select('Emissivity')
}).rename('LST')
)};
