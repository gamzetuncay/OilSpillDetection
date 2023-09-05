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

