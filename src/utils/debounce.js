const debounce = (cb, delay = 500) => {
  let lastTimeout = null;

  return function() {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(() => {
      cb.apply(null, arguments);
    }, delay);
  };
};

export default debounce;
