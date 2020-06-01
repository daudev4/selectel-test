export default () => {
  const DEBOUNCE_INTERVAL = 500;

  const debounce = (callback, wait = DEBOUNCE_INTERVAL) => {
    let timeout = null;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), wait);
    };
  };

  window.debounce = debounce;
};
