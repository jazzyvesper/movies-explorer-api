// eslint-disable-next-line no-nested-ternary
class MovieError extends Error {
  constructor(status) {
    super(status);
    this.statusCode = status;
    this.message = this.messageError();
  }

  messageError() {
    if (this.statusCode === 400) {
      this.message = 'Переданы некорректные данные!';
    } else if (this.statusCode === 404) {
      this.message = 'Карточка с указанным id не найденa';
    } else if (this.statusCode === 403) {
      this.message = 'Невозможно удалить чужую карточку';
    } else {
      this.message = 'Произошла ошибка';
    }
    return this.message;
  }
}

module.exports = MovieError;
