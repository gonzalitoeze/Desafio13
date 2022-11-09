const express = require('express');
const Contenedor = require('./Contenedor/Contenedor')
const app = express();
const pug = require('pug');
const PORT = 8080;
const routerProd = express.Router();
const productos = new Contenedor([]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/productos', routerProd);

app.set('views', __dirname + './views');
app.set('view engine', 'pug');

app.use('/static', express.static(__dirname + '/public'))

const fs = require("fs");

app.get('/productos', (req, res) => {
    const listaProductos = productos.getAll();
    res.render('lista',{
    lista: listaProductos
    });
});

app.post('/productos', (req, res) => {
    const producto = req.body;
    productos.save(producto);
    res.render('formulario', {});
});

app.get('/formproductos', (req, res) => {
    res.render('formulario', {})
});

const server = app.listen(PORT, () => {
    console.log(`Server listening: ${server.address().port}`);
});
server.on('error', error => console.log(`error ${error}`));