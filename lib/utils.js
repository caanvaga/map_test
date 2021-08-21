export const throttle = (fn, limit) => {
  let waiting = false;
  return function () {
    if (!waiting) {
      fn.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
};

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
