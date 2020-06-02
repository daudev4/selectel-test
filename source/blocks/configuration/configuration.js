export default () => {
  const DATA_URL = `https://api.jsonbin.io/b/5df3c10a2c714135cda0bf0f/1`;
  const MESSAGE_NO_RESULT = `Нет результатов`;
  const CORE_DECLENSIONS = [`ядро`, `ядра`, `ядер`];

  const configuration = document.querySelector(`.configuration`);
  const configurationForm = configuration.querySelector(`.configuration__form`);
  const configurationGroup = configuration.querySelector(`.configuration__group`);
  const configurationStatus = configurationGroup.querySelector(`.configuration__status`);
  const configurationLoader = configurationGroup.querySelector(`.configuration__loader`);

  const messageTemplate = document.querySelector(`#message`);
  const serverCardTemplate = document.querySelector(`#server-card`);
  const serverCardsFragment = document.createDocumentFragment();

  let serverCard;
  let message;

  if (serverCardTemplate) {
    serverCard = serverCardTemplate.content.querySelector(`.server`);
  }

  if (messageTemplate) {
    message = messageTemplate.content.querySelector(`.message`);
  }

  window.load(onLoadSuccess, onLoadError, DATA_URL);

  configurationForm.addEventListener(`change`, window.debounce(() => {
    window.load(onLoadSuccess, onLoadError, DATA_URL);
  }));

  function onLoadSuccess(cards) {
    configurationLoader.classList.add(`hidden`);
    removeCards();
    renderCards(filterCards(cards));
  }

  function onLoadError(statusText) {
    createMessage(statusText);
    configurationLoader.classList.add(`hidden`);
  }

  function createMessage(text) {
    const currentMessage = configurationStatus.querySelector(`.message`);

    if (currentMessage) {
      currentMessage.textContent = text;
    } else {
      const newMessage = message.cloneNode(true);

      newMessage.classList.add(`configuration__message`);
      newMessage.textContent = text;
      configurationStatus.appendChild(newMessage);
    }
  }

  function removeMessage() {
    const currentMessage = configurationStatus.querySelector(`.message`);

    if (currentMessage) {
      currentMessage.parentNode.removeChild(currentMessage);
    }
  }

  function removeCards() {
    configurationGroup.querySelectorAll(`.server`).forEach((card) => {
      card.parentNode.removeChild(card);
    });
  }

  function renderCards(cards) {
    cards.forEach((card) => {
      const newCard = fillCard(card);

      serverCardsFragment.appendChild(newCard);
    });

    configurationGroup.appendChild(serverCardsFragment);
  }

  function calculateCores(count, amount) {
    return parseInt(count, 10) * parseInt(amount, 10);
  }

  function fillCard(data) {
    const server = serverCard.cloneNode(true);

    const coresTotal = calculateCores(data.cpu.count, data.cpu.cores);

    server.querySelector(`.server__name`).textContent = data.name;
    server.querySelector(`.server__cpu-name`).textContent = data.cpu.name;
    server.querySelector(`.server__cpu-count`).textContent = data.cpu.count >= 2 ? `${data.cpu.count} x` : null;
    server.querySelector(`.server__cpu-cores`).textContent = `${coresTotal} ${window.declension(coresTotal, CORE_DECLENSIONS)}`;
    server.querySelector(`.server__ram`).textContent = data.ram;
    server.querySelector(`.server__disk-count`).textContent = data.disk.count >= 2 ? `${data.disk.count} x` : null;
    server.querySelector(`.server__disk-value`).textContent = data.disk.value;
    server.querySelector(`.server__disk-type`).textContent = data.disk.type;
    server.querySelector(`.server__gpu`).textContent = data.gpu ? data.gpu : null;
    server.querySelector(`.server__price-value`).textContent = (data.price / 100).toFixed(2);

    return server;
  }

  const rangeCores = configurationForm.querySelector(`#core-amount`);
  const checkboxGpu = configurationForm.querySelector(`#checkbox-gpu`);
  const checkboxRaid = configurationForm.querySelector(`#checkbox-raid`);
  const checkboxSsd = configurationForm.querySelector(`#checkbox-ssd`);

  function filterCards(cards) {
    const filteredCards = cards.filter((card) => {
      return (
        checkCores(card) &&
        checkGpu(card) &&
        checkRaid(card) &&
        checkSsd(card)
      );
    });

    if (!filteredCards.length) {
      createMessage(MESSAGE_NO_RESULT);
    } else {
      removeMessage();
    }

    return filteredCards;
  }

  function checkCores(card) {
    const rangeCoresValue = parseInt(rangeCores.value, 10);
    const cardCoresTotal = calculateCores(card.cpu.cores, card.cpu.count);

    return rangeCores.value ? rangeCoresValue === cardCoresTotal : true;
  }

  function checkGpu(card) {
    return checkboxGpu.checked ? card.hasOwnProperty(`gpu`) : true;
  }

  function checkRaid(card) {
    return checkboxRaid.checked ? card.disk.count >= 2 : true;
  }

  function checkSsd(card) {
    return checkboxSsd.checked ? card.disk.type === `SSD` : true;
  }
};
