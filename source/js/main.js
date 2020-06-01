// region Blocks
import load from './utils/load';
import debounce from './utils/debounce';
import declension from './utils/declension';
import range from '../blocks/range/range';
import configuration from '../blocks/configuration/configuration';

// endregion

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

document.addEventListener(`DOMContentLoaded`, () => {
  load();
  debounce();
  declension();
  range();
  configuration();
});
