'use strict';

import strings from './i18n/strings'

export function shouldPresentWeather(desiredWeather, weather) {
  return (weather && weather.weather &&
    weather.weather[0].description
    && weather.weather[0].id
    && compareDesiredWeather(desiredWeather, weather.weather[0].id));
}

export function compareDesiredWeather(desiredWeather, weatherId) {
  switch (desiredWeather) {
    case '1': {
      return true;
    }
    case '800': {
      return desiredWeather === weatherId.toString();
    }
    case '5':
    case '6': {
      return weatherId.toString().startsWith(desiredWeather);
    }
    case '80': {
      return weatherId.toString().startsWith(desiredWeather) && weatherId.toString() !== '800'
    }
    default: {
      return false;
    }
  }
}

export function getWeatherStringFromId(id) {
  switch (id) {
    case '1': {
      return strings.all;
    }
    case '800': {
      return strings.clear;
    }
    case '5': {
      return strings.rain;
    }
    case '6': {
      return strings.snow;
    }
    case '80': {
      return strings.clouds;
    }
    default: {
      return '';
    }
  }
}

export function getWeatherBannerImages() {
  return new Map([
    {
      title: '01d',
      file: require('../img/01d.jpg'),
    },
    {
      title: '01n',
      file: require('../img/01d.jpg'),
    },
    {
      title: '02d',
      file: require('../img/02d.jpg'),
    },
    {
      title: '02n',
      file: require('../img/02d.jpg'),
    },
    {
      title: '03d',
      file: require('../img/03d.jpg'),
    },
    {
      title: '03n',
      file: require('../img/03d.jpg'),
    },
    {
      title: '04d',
      file: require('../img/04d.jpg'),
    },
    {
      title: '04n',
      file: require('../img/04d.jpg'),
    },
    {
      title: '09d',
      file: require('../img/09d.jpg'),
    },
    {
      title: '09n',
      file: require('../img/09d.jpg'),
    },
    {
      title: '10d',
      file: require('../img/10d.jpg'),
    },
    {
      title: '10n',
      file: require('../img/10d.jpg'),
    },
    {
      title: '11d',
      file: require('../img/11d.jpg'),
    },
    {
      title: '11n',
      file: require('../img/11d.jpg'),
    },
    {
      title: '13d',
      file: require('../img/13d.jpg'),
    },
    {
      title: '13n',
      file: require('../img/13d.jpg'),
    },
    {
      title: '50d',
      file: require('../img/50d.jpg'),
    },
    {
      title: '50n',
      file: require('../img/50d.jpg'),
    },
  ].map((i) => [i.title, i.file]));
}

export function getWeatherIconImages() {
  return new Map([
    {
      title: '01d',
      file: require('../img/01di.png'),
    },
    {
      title: '01n',
      file: require('../img/01di.png'),
    },
    {
      title: '02d',
      file: require('../img/02di.png'),
    },
    {
      title: '02n',
      file: require('../img/02di.png'),
    },
    {
      title: '03d',
      file: require('../img/03di.png'),
    },
    {
      title: '03n',
      file: require('../img/03di.png'),
    },
    {
      title: '04d',
      file: require('../img/04di.png'),
    },
    {
      title: '04n',
      file: require('../img/04di.png'),
    },
    {
      title: '09d',
      file: require('../img/09di.png'),
    },
    {
      title: '09n',
      file: require('../img/09di.png'),
    },
    {
      title: '10d',
      file: require('../img/10di.png'),
    },
    {
      title: '10n',
      file: require('../img/10di.png'),
    },
    {
      title: '11d',
      file: require('../img/11di.png'),
    },
    {
      title: '11n',
      file: require('../img/11di.png'),
    },
    {
      title: '13d',
      file: require('../img/13di.png'),
    },
    {
      title: '13n',
      file: require('../img/13di.png'),
    },
    {
      title: '50d',
      file: require('../img/50di.png'),
    },
    {
      title: '50n',
      file: require('../img/50di.png'),
    },
  ].map((i) => [i.title, i.file]));
}

export function convertKelvinToCelsius(kelvin) {
  return Math.round(Number(kelvin) - 273.15);
}

export function sortMapByDistance(unsortedMap) {
  let sortedMap = new Map();

  Array.from(unsortedMap.keys())
    .sort((a, b) => Number(a.distance) - Number(b.distance))
    .forEach(key => sortedMap.set(key, unsortedMap.get(key)));

  return sortedMap;
}

export function getWeatherDescription(id) {
  switch (id) {
    case 200:
      return strings.thunderstormWithLightRain;
    case 201:
      return strings.thunderstormWithRain;
    case 202:
      return strings.thunderstormWithHeavyRain;
    case 210:
      return strings.lightThunderstorm;
    case 211:
      return strings.thunderstorm;
    case 212:
      return strings.heavyThunderstorm;
    case 221:
      return strings.raggedThunderstorm;
    case 230:
      return strings.thunderstormWithLightDrizzle;
    case 231:
      return strings.thunderstormWithDrizzle;
    case 232:
      return strings.thunderstormWithHeavyDrizzle;
    case 300:
      return strings.lightIntensityDrizzle;
    case 301:
      return strings.drizzle;
    case 302:
      return strings.heavyIntensityDrizzle;
    case 310:
      return strings.lightIntensityDrizzleRain;
    case 311:
      return strings.drizzleRain;
    case 312:
      return strings.heavyIntensityDrizzleRain;
    case 313:
      return strings.showerRainAndDrizzle;
    case 314:
      return strings.heavyShowerRainAndDrizzle;
    case 321:
      return strings.showerDrizzle;
    case 500:
      return strings.lightRain;
    case 501:
      return strings.moderateRain;
    case 502:
      return strings.heavyIntensityRain;
    case 503:
      return strings.veryHeavyRain;
    case 504:
      return strings.extremeRain;
    case 511:
      return strings.freezingRain;
    case 520:
      return strings.lightIntensityShowerRain;
    case 521:
      return strings.showerRain;
    case 522:
      return strings.heavyIntensityShowerRain;
    case 531:
      return strings.raggedShowerRain;
    case 600:
      return strings.lightSnow;
    case 601:
      return strings.snow;
    case 602:
      return strings.heavySnow;
    case 611:
      return strings.sleet;
    case 612:
      return strings.showerSleet;
    case 615:
      return strings.lightRainAndSnow;
    case 616:
      return strings.rainAndSnow;
    case 620:
      return strings.lightShowerSnow;
    case 621:
      return strings.showerSnow;
    case 622:
      return strings.heavyShowerSnow;
    case 701:
      return strings.mist;
    case 711:
      return strings.smoke;
    case 721:
      return strings.haze;
    case 731:
      return strings.sandDustWhirls;
    case 741:
      return strings.fog;
    case 751:
      return strings.sand;
    case 761:
      return strings.dust;
    case 762:
      return strings.volcanicAsh;
    case 771:
      return strings.squalls;
    case 781:
      return strings.tornado;
    case 800:
      return strings.clearSky;
    case 801:
      return strings.fewClouds;
    case 802:
      return strings.scatteredClouds;
    case 803:
      return strings.brokenClouds;
    case 804:
      return strings.overcastClouds;
    case 900:
      return strings.tornado;
    case 901:
      return strings.tropicalStorm;
    case 902:
      return strings.hurricane;
    case 903:
      return strings.cold;
    case 904:
      return strings.hot;
    case 905:
      return strings.windy;
    case 906:
      return strings.hail;
    case 951:
      return strings.calm;
    case 952:
      return strings.lightBreeze;
    case 953:
      return strings.gentleBreeze;
    case 954:
      return strings.moderateBreeze;
    case 955:
      return strings.freshBreeze;
    case 956:
      return strings.strongBreeze;
    case 957:
      return strings.highWindNearGale;
    case 958:
      return strings.gale;
    case 959:
      return strings.severeGale;
    case 960:
      return strings.storm;
    case 961:
      return strings.violentStorm;
    case 962:
      return strings.hurricane;
    default:
      return undefined;
  }
}