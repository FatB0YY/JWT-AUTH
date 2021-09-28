// // логика для работы с почтой

const nodemailer = require('nodemailer')

class MailService {
  // инициализация почтового клиента
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  // логика по отправки письма для активации
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      // своя почта, от кого исходит письмо
      from: process.env.SMTP_USER,
      // куда
      to: to,
      // тема
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    })
  }
}

module.exports = new MailService()
