class AuthError extends Error {
  constructor(status) {
    super(status);
    this.statusCode = status;
    this.message = this.messageError();
  }

  messageError() {
    if (this.statusCode === 400) {
      this.message = 'Переданы некорректные данные!';
    } else if (this.statusCode === 401) {
      this.message = 'Необходима авторизация';
    } else if (this.statusCode === 500) {
      this.message = 'Произошла ошибка';
    }
    return this.message;
  }
}

module.exports = AuthError;
