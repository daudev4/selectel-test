export default () => {
  function declOfNum(n, titles) {
    let index;

    if (n % 10 === 1 && n % 100 !== 11) {
      index = 0;
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
      index = 1;
    } else {
      index = 2;
    }
    return titles[index];
  }

  window.declension = declOfNum;
};
