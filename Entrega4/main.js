const express = require('express');
const routerProductos = require('./routes/productos.js');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use('/static', express.static(__dirname + '/public'));

app.use('/api', routerProductos);

const server = app.listen(PORT, () => {
    console.log(`escuchando del puerto ${server.address().port}`);
});
server.on('error', error => console.log(`Error ${error}`));