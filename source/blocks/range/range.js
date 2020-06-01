export default () => {
  let root = document.documentElement;
  const range = document.querySelector(`.range`);
  const rangeInput = range.querySelector(`.range__input`);
  const rangeMin = range.querySelector(`.range__min`);
  const rangeMax = range.querySelector(`.range__max`);
  const rangeOutputValue = range.querySelector(`.range__output-value`);
  const rangeOutputUnit = range.querySelector(`.range__output-unit`);
  const rangeOutputUnits = [`ядро`, `ядра`, `ядер`];
  const rangeInputMax = rangeInput.max;
  const rangeInputMin = rangeInput.min;

  rangeMin.textContent = rangeInputMin;
  rangeMax.textContent = rangeInputMax;

  function fillRange(element) {
    const fillPercent = ((element.value - rangeInputMin) / (rangeInputMax - rangeInputMin)) * 100;

    root.style.setProperty(`--fill-percent`, `${fillPercent}%`);
  }

  fillRange(rangeInput);

  rangeInput.addEventListener(`input`, (evt) => {
    fillRange(evt.target);

    rangeOutputUnit.textContent = window.declension(evt.target.value, rangeOutputUnits);
    rangeOutputValue.value = evt.target.value;
  });
};
