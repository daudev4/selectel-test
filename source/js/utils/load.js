export default () => {

  const XHR_TIMEOUT = 10000;
  const HTTP_STATUS_OK = 200;
  const MESSAGE_CONNECTION_ERROR = `Ошибка соединения`;

  const load = function (onSuccess, onError, url, data) {
    const httpMethod = data
      ? `POST`
      : `GET`;
    const xhr = new XMLHttpRequest();

    xhr.responseType = `json`;
    xhr.addEventListener(`load`, function () {
      if (xhr.status === HTTP_STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError(MESSAGE_CONNECTION_ERROR);
        // onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
      }
    });
    xhr.addEventListener(`error`, function () {
      onError(MESSAGE_CONNECTION_ERROR);
    });
    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
    });

    xhr.timeout = XHR_TIMEOUT;

    xhr.open(httpMethod, url);
    xhr.send(data);
  };

  window.load = load;
};
