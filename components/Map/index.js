import React, {memo, useState, useEffect, useMemo, useCallback} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {View, StyleSheet} from 'react-native';
import superCluster from 'supercluster';

import {throttle} from '../../lib/utils';
import {getZoomLevel} from '../../lib/calc';

import MapClusterMarker from '../MapClusterMarker';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const Map = ({markers = [], region: defaultRegion, maxZoom = 17, ...props}) => {
  const [region, setRegion] = useState(defaultRegion);
  const [clusters, setClusters] = useState([]);

  const supercluster = useMemo(
    () =>
      new superCluster({
        radius: 60,
        maxZoom,
      }),
    [maxZoom],
  );

  useEffect(() => {
    supercluster.load(
      markers.map(({id, coordinate, ...rest}, i) => {
        const mid = id || `marker-${i}`;
        return {
          properties: {id: mid},
          Marker: (
            <Marker key={mid} id={mid} coordinate={coordinate} {...rest} />
          ),
          geometry: {
            type: 'Point',
            coordinates: [coordinate.longitude, coordinate.latitude],
          },
        };
      }),
    );
  }, [supercluster, markers]);

  useEffect(() => {
    const {longitude, longitudeDelta, latitude, latitudeDelta} = region;

    const bounds = [
      longitude - longitudeDelta / 2,
      latitude - latitudeDelta / 2,
      longitude + longitudeDelta / 2,
      latitude + latitudeDelta / 2,
    ];

    const zoomLevel = getZoomLevel(bounds, maxZoom + 1);
    const cs = supercluster.getClusters(bounds, zoomLevel);

    const clusterMarkers = cs.map(cluster => {
      const {
        Marker: MarkerComponent,
        properties: {cluster_id: id},
      } = cluster;
      return id ? (
        <MapClusterMarker key={id} id={id} cluster={cluster} />
      ) : (
        MarkerComponent
      );
    });

    setClusters(clusterMarkers);
  }, [region, supercluster, maxZoom]);

  const setRegionThrottle = useMemo(() => throttle(setRegion, 1250), []);
  const onRegionChangeComplete = useCallback(
    r => setRegionThrottle(r),
    [setRegionThrottle],
  );

  return (
    <View style={styles.container}>
      <MapView
        {...props}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region}>
        {clusters}
      </MapView>
    </View>
  );
};

export default memo(Map);
