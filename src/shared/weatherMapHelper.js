'use strict';

import {getWeatherDescription} from './weatherHelper';

export function createFeaturePoints(nearbyCitiesShown) {
  let features = [];
  nearbyCitiesShown.forEach((weather, city) => {
    features.push({
      'type': 'Feature',
      'properties': {
        '_id': city.geonameId,
        'index': features.length,
        'cityname': city.name,
        'weatherdescription': getWeatherDescription(weather.weather[0].id),
        'weathericon': weather.weather[0].icon
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          Number(city.lng),
          Number(city.lat)
        ]
      }
    });
  });
  return features;
}

export function calculateDeltas(initialPoint, points) {
  let minX = initialPoint.latitude,
    maxX = initialPoint.latitude,
    minY = initialPoint.longitude,
    maxY = initialPoint.longitude;
  if (points.length > 0) {
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });
  }

  const deltaX = (maxX - minX) + 0.8;
  const deltaY = (maxY - minY) + 0.8;

  return {deltaX, deltaY}
}