const express = require('express');
const moment = require('moment');
const aplicacion = express();

const puerto = 8080;
let visitas = 0;

aplicacion.get('/', (peticion, respuesta) => {
    respuesta.end('<h1 style="color:blue">Bienvenidos al servidor express</h1>')
});

aplicacion.get('/visitas', (peticion, respuesta) => {
    visitas ++;
    respuesta.end(`Cantidad de visitas: ${visitas}`);
});

aplicacion.get('/fyh', (peticion, respuesta) => {
    const ahora = moment(new Date());
    const ahoraFormateado = ahora.format('DD/MM/yyyy hh:mm:ss');
    respuesta.send({
        fyh: ahoraFormateado
    });
});

const conexionServidor = aplicacion.listen(puerto, () => {
    console.log(`Aplicación escuchando en el puerto ${conexionServidor.address().port}`);
});

conexionServidor.on('Error', error => console.log(`Ha ocurido un error: ${error}`));