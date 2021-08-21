const getLatitudRadio = latitud => {
  const sin = Math.sin((latitud * Math.PI) / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
};

const calculateZoom = fraction => {
  return Math.floor(Math.log(1 / fraction) / Math.LN2);
};

export const getZoomLevel = (bounds, maxZoom) => {
  const latFraction =
    (getLatitudRadio(bounds[3]) - getLatitudRadio(bounds[1])) / Math.PI;
  const lngDiff = bounds[2] - bounds[0];
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = calculateZoom(latFraction);
  const lngZoom = calculateZoom(lngFraction);

  return Math.min(latZoom, lngZoom, maxZoom);
};
