# Prava Bormi — Yo'l belgilari testi (WebApp)

O'zbekiston haydovchilik imtihoniga tayyorgarlik uchun yo'l belgilari testi.
Telegram WebApp sifatida ishlaydi. Uch til: o'zbek (lotin/kirill), rus.

## Struktura
- `webapp/` — test interfeysi (index.html, app.js, style.css, questions.json)
- `images/signs/` — 12 ta yo'l belgisi (PNG)

## GitHub Pages URL
Settings → Pages → Source: main branch → /(root) yoqilgandan keyin:
`https://cubimade.github.io/pravabormi-webapp/webapp/`

## Botga ulash
```python
from aiogram.types import WebAppInfo, InlineKeyboardButton
button = InlineKeyboardButton(
    text="📝 Testni boshlash",
    web_app=WebAppInfo(url="https://cubimade.github.io/pravabormi-webapp/webapp/")
)
```
