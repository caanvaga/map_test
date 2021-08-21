import React, {memo, useMemo} from 'react';
import {Marker} from 'react-native-maps';
import {View, Text, StyleSheet} from 'react-native';

const getStyles = ({size, outerskirt}) =>
  StyleSheet.create({
    clusterWrapper: {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(34, 32, 100, 0.25)',
    },
    cluster: {
      width: size - outerskirt,
      height: size - outerskirt,
      borderRadius: (size - outerskirt) / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(34, 32, 100)',
    },
    clusterText: {
      fontSize: 12,
      color: 'rgb(250, 250, 250)',
    },
  });

const MapClusterMarker = ({cluster, size = 40, outerskirt = 10}) => {
  const {
    properties: {cluster_id: id, point_count},
    geometry: {coordinates},
  } = cluster;
  const coordinate = useMemo(
    () => ({latitude: coordinates[1], longitude: coordinates[0]}),
    [coordinates],
  );
  const anchor = useMemo(() => ({x: 0.5, y: 0.5}), []);
  const styles = useMemo(
    () => getStyles({size, outerskirt}),
    [size, outerskirt],
  );

  const content = useMemo(
    () => (
      <View style={styles.clusterWrapper}>
        <View style={styles.cluster}>
          <Text style={styles.clusterText}>{point_count}</Text>
        </View>
      </View>
    ),
    [point_count, styles],
  );

  return (
    <Marker
      id={id}
      tracksViewChanges={false}
      coordinate={coordinate}
      width={size}
      height={size}
      anchor={anchor}>
      {content}
    </Marker>
  );
};

export default memo(MapClusterMarker);
