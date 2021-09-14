class UserError extends Error {
  constructor(status, newMessage) {
    super(status);
    this.statusCode = status;
    this.newMessage = newMessage;
    this.message = this.messageError();
  }

  messageError() {
    if (this.statusCode === 400) {
      this.message = 'Переданы некорректные данные!';
    } else if (this.statusCode === 404 && !this.newMessage) {
      this.message = 'Пользователь с указанным id не найден!';
    } else if (this.statusCode === 404 && this.newMessage) {
      this.message = this.newMessage;
    } else if (this.statusCode === 401) {
      this.message = 'Ошибка авторизации. Неверный email или пароль';
    } else if (this.statusCode === 409) {
      this.message = 'Пользователь с таким email уже существует';
    } else if (this.statusCode === 500) {
      this.message = 'Произошла ошибка';
    }
    return this.message;
  }
}

module.exports = UserError;
