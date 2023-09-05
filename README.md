# SENTINEL-1 BIG DATA ANALYSIS WITH GOOGLE EARTH ENGINE FOR VESSEL TRACKING IN BLACKSEA

http://doi.org/10.13140/RG.2.2.34532.35209

The development and increase of maritime transportation are the important factors in terms of oil pollution in the seas and oceans. Although countries, unions and commissions take precautions for oil spill, a lot of vessels do not consider the rules and laws. Failure to comply with these rules and laws results in various effects on the environment over time.

With the development of Synthetic Aperture Radar technologies and cloud-based systems, the oil spill caused by vessels can be detected and its morphological properties obtained using various algorithms.

The Black Sea as inland water body is the main trade route of the countries in the region. With increased trade volume and the region's coverage of the world's fifth most important oil transfer transition, it has been a region where oil spills have been seen continuously over the years.Within the scope of the study, oil spill detection and analysis were carried out on Sentinel-1 radar images obtained between 2015 and 2019. For the purpose of speckle noise reduction, Local Median, Frost, Gamma MAP and Lee Sigma filters were performed. The best despeckling filter was determined and it was used for detection and morphological analysis. Based on the results of the different images, the most inaccurate method was observed as Canny Edge detection, while Otsu Thresholding was the method with the best reliability within itself. .The outcomes of clustering algorithms were found to be similar to each other. Also, the same outcomes were shown for both classification algorithms.

### DATASET

A total of 7 subsets of Sentinel-1 Level 1 GRD images consisting of different transitions and segments were used in this study; 2 mosaics consisting of 2 images and 3 single images. Two of the single images were confirmed in a previous oil leak detection study.

![alt text](https://github.com/gamzetuncay/OilSpillDetection/blob/main/README_IMAGES/Dataset.png)

### METHODOLOGY

1. Image Processing

- Despeckling: Local Median Filter, Lee Filter, Gamma MAP Filter, Frost Filter
- Thresholding: Otsu Thresholding
- Edge Detection: Canny Edge Detection

2. Classification

- K-Means Clustering
- X-Means Clustering
- Cobweb Clustering
- Random Forest Classification
- Support Vector Machine Classification

3. Results

- Transect Based Analysis
- Kernel Size Optimization
- Execution Times
- Morphology Analysis with Ground Truth

### Sample Morphology Analysis

![Morphology Analysis](https://github.com/gamzetuncay/OilSpillDetection/blob/main/README_IMAGES/MorphologyAnalysis.jpg?raw=true)
