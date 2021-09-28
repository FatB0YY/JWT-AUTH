const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        // получаем из заголовка Bearer
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        // отделяем Bearer от токена
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        // валидируем токен аксес
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        // в поле user помешаем данные пользователя
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
