// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');

app.use(cors());

app.use("/reports", express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./src/auth/passport.js')(passport);


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);

console.log("Servidor Rodando na porta 3000");