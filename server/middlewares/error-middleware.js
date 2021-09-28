const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
    console.log(err);
    // если ошибка явл инстансом этого класса
    //  тогда мы сразу возвращаем ответ на клиент
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    // не предусмотрели ошибку :(
    return res.status(500).json({message: 'Непредвиденная ошибка'})

};
