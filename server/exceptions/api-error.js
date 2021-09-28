// универсальный класс для ошибок апи
// расширяет дефолтный еррор

module.exports = class ApiError extends Error {
    // добавим поле status и errors
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    // статик можно использовать не создавая эксемпляр класса
    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}
