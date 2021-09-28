// читаем .env файл
require('dotenv').config()
const express = require('express');
// чтобы отправлять запросы с браузера без проблем
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 4000;
const app = express()

app.use(express.json());
// чтобы работали res.cookie итд
app.use(cookieParser());
// указываем с каким доменом ему необходимо обмениваться куками
app.use(cors({
    // разрешаем
    credentials: true,
    // url frontend
    origin: process.env.CLIENT_URL
}));

// все роуты
app.use('/api', router);
// ошибки, он должен быть последний всегда !!!
app.use(errorMiddleware);

async function start(){
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}
start()
