const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/save', (req, res) => {
  const data = req.body;
  const fileName = data.mode === '2D' ? 'annotations2D.json' : 'annotations3D.json';
  fs.writeFileSync(fileName, JSON.stringify(data.annotations, null, 2));
  res.json({ message: `${data.mode} annotations saved successfully.` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
