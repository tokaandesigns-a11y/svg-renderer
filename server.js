const express = require('express');
const { Resvg } = require('@resvg/resvg-js');

const app = express();

app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/render-svg', (req, res) => {
  try {
    const svg = req.body && req.body.svg;
    if (!svg) {
      return res.status(400).json({ error: 'Missing svg' });
    }

    const png = new Resvg(svg).render().asPng();

    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(png));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('renderer running on port ' + PORT);
});
