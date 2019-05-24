var express = require('express');
var app = express();

app.engine('pug', require('pug').__express)
app.set('views', './templates/views');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.all('/', require('./routes/views/index'));

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})