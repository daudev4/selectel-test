(function () {
  'use strict';

  var load = (function () {
    var XHR_TIMEOUT = 10000;
    var HTTP_STATUS_OK = 200;
    var MESSAGE_CONNECTION_ERROR = "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F";

    var load = function load(onSuccess, onError, url, data) {
      var httpMethod = data ? "POST" : "GET";
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function () {
        if (xhr.status === HTTP_STATUS_OK) {
          onSuccess(JSON.parse(xhr.responseText));
        } else {
          onError(MESSAGE_CONNECTION_ERROR); // onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
        }
      });
      xhr.addEventListener("error", function () {
        onError(MESSAGE_CONNECTION_ERROR);
      });
      xhr.addEventListener("timeout", function () {
        onError("\u0417\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u0443\u0441\u043F\u0435\u043B \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C\u0441\u044F \u0437\u0430 ".concat(xhr.timeout, " \u043C\u0441"));
      });
      xhr.open(httpMethod, url);
      xhr.timeout = XHR_TIMEOUT;
      xhr.send(data);
    };

    window.load = load;
  });

  var debounce = (function () {
    var DEBOUNCE_INTERVAL = 500;

    var debounce = function debounce(callback) {
      var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEBOUNCE_INTERVAL;
      var timeout = null;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        clearTimeout(timeout);
        timeout = setTimeout(function () {
          return callback.apply(void 0, args);
        }, wait);
      };
    };

    window.debounce = debounce;
  });

  var declension = (function () {
    function declOfNum(n, titles) {
      var index;

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
  });

  var range = (function () {
    var root = document.documentElement;
    var range = document.querySelector(".range");
    var rangeInput = range.querySelector(".range__input");
    var rangeMin = range.querySelector(".range__min");
    var rangeMax = range.querySelector(".range__max");
    var rangeOutputValue = range.querySelector(".range__output-value");
    var rangeOutputUnit = range.querySelector(".range__output-unit");
    var rangeOutputUnits = ["\u044F\u0434\u0440\u043E", "\u044F\u0434\u0440\u0430", "\u044F\u0434\u0435\u0440"];
    var rangeInputMax = rangeInput.max;
    var rangeInputMin = rangeInput.min;
    rangeMin.textContent = rangeInputMin;
    rangeMax.textContent = rangeInputMax;

    function fillRange(element) {
      var fillPercent = (element.value - rangeInputMin) / (rangeInputMax - rangeInputMin) * 100;
      root.style.setProperty("--fill-percent", "".concat(fillPercent, "%"));
    }

    fillRange(rangeInput);
    rangeInput.addEventListener("change", function (evt) {
      fillRange(evt.target);
      rangeOutputUnit.textContent = window.declension(evt.target.value, rangeOutputUnits);
      rangeOutputValue.textContent = evt.target.value;
    });
  });

  var configuration = (function () {
    var DATA_URL = "https://api.jsonbin.io/b/5df3c10a2c714135cda0bf0f/1";
    var MESSAGE_NO_RESULT = "\u041D\u0435\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432";
    var CORE_DECLENSIONS = ["\u044F\u0434\u0440\u043E", "\u044F\u0434\u0440\u0430", "\u044F\u0434\u0435\u0440"];
    var configuration = document.querySelector(".configuration");
    var configurationForm = configuration.querySelector(".configuration__form");
    var configurationGroup = configuration.querySelector(".configuration__group");
    var configurationStatus = configurationGroup.querySelector(".configuration__status");
    var configurationLoader = configurationGroup.querySelector(".configuration__loader");
    var messageTemplate = document.querySelector("#message");
    var serverCardTemplate = document.querySelector("#server-card");
    var serverCardsFragment = document.createDocumentFragment();
    var serverCard;
    var message;

    if (serverCardTemplate) {
      serverCard = serverCardTemplate.content.querySelector(".server");
    }

    if (messageTemplate) {
      message = messageTemplate.content.querySelector(".message");
    }

    window.load(onLoadSuccess, onLoadError, DATA_URL);
    configurationForm.addEventListener("change", window.debounce(function () {
      window.load(onLoadSuccess, onLoadError, DATA_URL);
    }));

    function onLoadSuccess(cards) {
      configurationLoader.classList.add("hidden");
      removeCards();
      renderCards(filterCards(cards));
    }

    function onLoadError(statusText) {
      createMessage(statusText);
      configurationLoader.classList.add("hidden");
    }

    function createMessage(text) {
      var currentMessage = configurationStatus.querySelector(".message");

      if (currentMessage) {
        currentMessage.textContent = text;
      } else {
        var newMessage = message.cloneNode(true);
        newMessage.classList.add("configuration__message");
        newMessage.textContent = text;
        configurationStatus.appendChild(newMessage);
      }
    }

    function removeMessage() {
      var currentMessage = configurationStatus.querySelector(".message");

      if (currentMessage) {
        currentMessage.parentNode.removeChild(currentMessage);
      }
    }

    function removeCards() {
      configurationGroup.querySelectorAll(".server").forEach(function (card) {
        card.parentNode.removeChild(card);
      });
    }

    function renderCards(cards) {
      cards.forEach(function (card) {
        var newCard = fillCard(card);
        serverCardsFragment.appendChild(newCard);
      });
      configurationGroup.appendChild(serverCardsFragment);
    }

    function calculateCores(count, amount) {
      return parseInt(count, 10) * parseInt(amount, 10);
    }

    function fillCard(data) {
      var server = serverCard.cloneNode(true);
      var coresTotal = calculateCores(data.cpu.count, data.cpu.cores);
      server.querySelector(".server__name").textContent = data.name;
      server.querySelector(".server__cpu-name").textContent = data.cpu.name;
      server.querySelector(".server__cpu-count").textContent = data.cpu.count >= 2 ? "".concat(data.cpu.count, " x") : null;
      server.querySelector(".server__cpu-cores").textContent = "".concat(coresTotal, " ").concat(window.declension(coresTotal, CORE_DECLENSIONS));
      server.querySelector(".server__ram").textContent = data.ram;
      server.querySelector(".server__disk-count").textContent = data.disk.count >= 2 ? "".concat(data.disk.count, " x") : null;
      server.querySelector(".server__disk-value").textContent = data.disk.value;
      server.querySelector(".server__disk-type").textContent = data.disk.type;
      server.querySelector(".server__gpu").textContent = data.gpu ? data.gpu : null;
      server.querySelector(".server__price-value").textContent = data.price / 100;
      return server;
    }

    var rangeCores = configurationForm.querySelector("#core-amount");
    var checkboxGpu = configurationForm.querySelector("#checkbox-gpu");
    var checkboxRaid = configurationForm.querySelector("#checkbox-raid");
    var checkboxSsd = configurationForm.querySelector("#checkbox-ssd");

    function filterCards(cards) {
      var filteredCards = cards.filter(function (card) {
        return checkCores(card) && checkGpu(card) && checkRaid(card) && checkSsd(card);
      });

      if (!filteredCards.length) {
        createMessage(MESSAGE_NO_RESULT);
      } else {
        removeMessage();
      }

      return filteredCards;
    }

    function checkCores(card) {
      var rangeCoresValue = parseInt(rangeCores.value, 10);
      var cardCoresTotal = calculateCores(card.cpu.cores, card.cpu.count);
      return rangeCores.value ? rangeCoresValue === cardCoresTotal : true;
    }

    function checkGpu(card) {
      return checkboxGpu.checked ? card.hasOwnProperty("gpu") : true;
    }

    function checkRaid(card) {
      return checkboxRaid.checked ? card.disk.count >= 2 : true;
    }

    function checkSsd(card) {
      return checkboxSsd.checked ? card.disk.type === "SSD" : true;
    }
  });

  // region Blocks

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  document.addEventListener("DOMContentLoaded", function () {
    load();
    debounce();
    declension();
    range();
    configuration();
  });

}());
//# sourceMappingURL=main.js.map
