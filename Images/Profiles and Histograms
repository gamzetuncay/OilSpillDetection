/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var profile4 = /* color: #0000ff */ee.Geometry.LineString(
        [[29.9895634753233, 43.20800715651794],
         [29.98505736417828, 43.201844718014115]]),
    profile5 = 
    /* color: #999900 */
    /* shown: false */
    ee.Geometry.LineString(
        [[35.70424987066685, 43.52035962395889],
         [35.72317553747593, 43.5204841005973]]),
    imageVisParam = {"opacity":1,"bands":["VV"],"min":-47.2286188717118,"max":-19.242387812639908,"gamma":1},
    geometry = /* color: #00ffff */ee.Geometry.LineString(
        [[41.1524896657165, 41.89419544307023],
         [41.16484928485713, 41.89240648179988]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
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
        .filterDate('2016-03-01','2016-03-10')
        .filterBounds(region010316);
    print(sar1);
    
    // Profile
    var profile1 = ee.Geometry.LineString(
        [[41.1484826266356, 41.90084329276349],
         [41.16418964262681, 41.89633931695397]]);
    var VV_Pixels1 = sar1.first().reduceRegion(ee.Reducer.toList(), geometry);
    var VV_Data1 = ee.Array(VV_Pixels1.get("VV"));
    var VV_ProfileChart1 = ui.Chart.array.values(VV_Data1, "0")
        .setChartType('LineChart')
        .setSeriesNames(['VV Polarization'])
        .setOptions({
            hAxis: {title: 'Pixel Number'},
            vAxis: {title: 'NRCS(dB)'},
            colors: ['red'],
            lineWidth: 6
        });
    print('profile1',VV_ProfileChart1);// Display the profile.
    
    // Histogram
    sar1 = sar1.mosaic().clip(region010316);
    var VV_Histogram1 = ui.Chart.image.histogram(sar1.select('VV'), region010316, 100)
        .setSeriesNames(['VV'])
        .setOptions({
           hAxis: {title: 'NRCS(dB)'},
           vAxis: {title: 'Frequency'},
           colors: ['green']});
    print(VV_Histogram1);

 
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
    
    // Profile
    var profile2_1 = ee.Geometry.LineString(
        [[29.53275424860176, 43.22966583320134],
         [29.551637000066602, 43.232980227895325]]);
    var VV_Pixels2_1 = sar2.first().reduceRegion(ee.Reducer.toList(), profile2_1);
    var VV_Data2_1 = ee.Array(VV_Pixels2_1.get("VV"));
    var VV_ProfileChart2_1 = ui.Chart.array.values(VV_Data2_1, "0")
        .setChartType('LineChart')
        .setSeriesNames(['VV Polarization'])
        .setOptions({
            hAxis: {title: 'Pixel Number'},
            vAxis: {title: 'NRCS(dB)'},
            colors: ['red'],
            lineWidth: 6
        });
    print('profile2_2',VV_ProfileChart2_1);// Display the profile.
    
    var profile2_2 = ee.Geometry.LineString(
        [[29.830900623188285, 43.24413346211278],
         [29.836812211857108, 43.245196337092125]]);
    var VV_Pixels2_2 = sar2.first().reduceRegion(ee.Reducer.toList(), profile2_2);
    var VV_Data2_2 = ee.Array(VV_Pixels2_2.get("VV"));
    var VV_ProfileChart2_2 = ui.Chart.array.values(VV_Data2_2, "0")
        .setChartType('LineChart')
        .setSeriesNames(['VV Polarization'])
        .setOptions({
            hAxis: {title: 'Pixel Number'},
            vAxis: {title: 'NRCS(dB)'},
            colors: ['red'],
            lineWidth: 6
        });
    print('profile2_2',VV_ProfileChart2_2);// Display the profile.

    // Histogram
    sar2 = sar2.mosaic().clip(region080819);
    var VV_Histogram2 = ui.Chart.image.histogram(sar2.select('VV'),region080819, 100)
        .setSeriesNames(['VV'])
        .setOptions({
           hAxis: {title: 'NRCS(dB)'},
           vAxis: {title: 'Frequency'},
           colors: ['green']});
    print(VV_Histogram2);


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
    
    // Profile
    var profile3 = ee.Geometry.LineString(
        [[29.44216012212931, 42.409899287183954],
         [29.452052108976233, 42.40723760125997]]);
    var sar3_1 = ee.Image(sar3.toList(sar3.size()).get(1));
    var VV_Pixels3 = sar3_1.reduceRegion(ee.Reducer.toList(), profile3);
    var VV_Data3 = ee.Array(VV_Pixels3.get("VV"));
    var VV_ProfileChart3 = ui.Chart.array.values(VV_Data3, "0")
        .setChartType('LineChart')
        .setSeriesNames(['VV Polarization'])
        .setOptions({
            hAxis: {title: 'Pixel Number'},
            vAxis: {title: 'NRCS(dB)'},
            colors: ['red'],
            lineWidth: 6
        });
    print('profile3',VV_ProfileChart3);// Display the profile.
    
    // Histogram
    sar3 = sar3.mosaic().clip(region210719);
    var VV_Histogram3 = ui.Chart.image.histogram(sar3.select('VV'), region210719, 100)
        .setSeriesNames(['VV'])
        .setOptions({
           hAxis: {title: 'NRCS(dB)'},
           vAxis: {title: 'Frequency'},
           colors: ['green']});
    
    print(VV_Histogram3);
    
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
    
    // Profile
    var profile4 = ee.Geometry.LineString(
        [[29.9895634753233, 43.20800715651794],
         [29.98505736417828, 43.201844718014115]]);
    var VV_Pixels4 = sar4.first().reduceRegion(ee.Reducer.toList(), profile4);
    var VV_Data4 = ee.Array(VV_Pixels4.get("VV"));
    var VV_ProfileChart4 = ui.Chart.array.values(VV_Data4, "0")
        .setChartType('LineChart')
        .setSeriesNames(['VV Polarization'])
        .setOptions({
            hAxis: {title: 'Pixel Number'},
            vAxis: {title: 'NRCS(dB)'},
            colors: ['red'],
            lineWidth: 6
        });
    print('profile4',VV_ProfileChart4);// Display the profile.
    
    // Histogram
    sar4 = sar4.mosaic().clip(region220519);
    var VV_Histogram4 = ui.Chart.image.histogram(sar4.select('VV'), region220519, 100)
        .setSeriesNames(['VV'])
        .setOptions({
           hAxis: {title: 'NRCS(dB)'},
           vAxis: {title: 'Frequency'},
           colors: ['green']});
    
    print(VV_Histogram4);

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
    
    // Profile
    var  profile5 = ee.Geometry.LineString(
        [[35.70424987066685, 43.52035962395889],
         [35.72317553747593, 43.5204841005973]]);
    var VV_Pixels5 = sar5.first().reduceRegion(ee.Reducer.toList(), profile5);
    var VV_Data5 = ee.Array(VV_Pixels5.get("VV"));
    var VV_ProfileChart5 = ui.Chart.array.values(VV_Data5, "0")
        .setChartType('LineChart')
        .setSeriesNames(['VV Polarization'])
        .setOptions({
            hAxis: {title: 'Pixel Number'},
            vAxis: {title: 'NRCS(dB)'},
            colors: ['red'],
            lineWidth: 6
        });
    print('profile5',VV_ProfileChart5);// Display the profile.

    // Histogram
    sar5 = sar5.mosaic().clip(region250915);
    var VV_Histogram5 = ui.Chart.image.histogram(sar5.select('VV'), region250915, 100)
        .setSeriesNames(['VV Polarization'])
        .setOptions({
           hAxis: {title: 'NRCS(dB)'},
           vAxis: {title: 'Frequency'},
           colors: ['green']});
    
    print(VV_Histogram5);

var imageVisParam = {"opacity":1,"bands":["VV"],"min":-50,"gamma":1}
Map.addLayer(sar1,imageVisParam)
Map.addLayer(profile1)
Map.addLayer(sar2,imageVisParam)
Map.addLayer(profile2_1)
Map.addLayer(profile2_2)
Map.addLayer(sar3,imageVisParam)
Map.addLayer(profile3)
Map.addLayer(sar4,imageVisParam)
Map.addLayer(profile4)
Map.addLayer(sar5,imageVisParam)
Map.addLayer(profile5)
