const express = require('express');
const path = require('path');
const app = express();

app.use('/reports', express.static(path.join(__dirname, 'build')));

app.get('/reports/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);