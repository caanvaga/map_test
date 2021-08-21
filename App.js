import React from 'react';
import type {Node} from 'react';

import {getRandomArbitrary} from './lib/utils';

import Map from './components/Map';

const getRandomValue = (v, m) => v + getRandomArbitrary(m * -1, m) / 100000;

const region = {
  latitude: 19.466105323154473,
  longitude: -99.1250210814178,
  latitudeDelta: 0.20826949712076015,
  longitudeDelta: 0.11085871607066622,
};

const numberMarkers = 9000;
const maxSeparation = 100000;
const markers = [...Array(numberMarkers).keys()].map(() => ({
  coordinate: {
    latitude: getRandomValue(region.latitude, maxSeparation),
    longitude: getRandomValue(region.longitude, maxSeparation),
  },
}));

const App: () => Node = () => <Map markers={markers} region={region} />;

export default App;
