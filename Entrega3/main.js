const express = require("express");
const Contenedor = require("./Contenedor");
const productos = new Contenedor("./productos.json");
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(
        `Servidor http escuchando en el puerto ${server.address().port}`
    );
});
server.on("error", error => console.log(`Error en servidor: ${error.message}`));

app.get("/", (req, res) => {
    try {
        res.send(
            '<div style="color: green; text-align: center"><h1>Bienvenidos al servidor express</h1></div> </hr> <h3 style="color: black; text-align:center">Desafío entregable n°3</h3>'
        );
    } catch (error) {
        console.log(`Error cargando el proyecto: ${error}`);
    }
});

app.get("/productos", (req, res) => {
    const ejecutar = async () => {
        try {
            const arrayProductos = await productos.getAll();
            let card = ``;
            arrayProductos.map(
                item =>
                    (card += `<div style="background-color: white; color: white; text-align: center; height: auto; width: 300px"><h2>Nombre: ${item.title}</h2><h3>Precio: ${item.price}</h3><img style="margin-bottom: 10px" height="250px" src="${item.thumbnail}"></div>`)
            );
            res.send(
                `<h1 style="text-align: center">Todos los productos:</h1><section style="display: flex; justify-content: space-around">${card}</section>`
            );
        } catch (error) {
            console.log(`Error obteniendo todos los productos: ${error}`);
        }
    };
    ejecutar();
});

app.get("/random", (req, res) => {
    const ejecutar = async () => {
        try {
            const arrayProductos = await productos.getAll();
            let numero = Math.floor(Math.random() * arrayProductos.length);
            const producto = await productos.getById(numero + 1);
            let card = `<div style="background-color: black; color: white; text-align: center; height: auto; width: 300px"><h2>Nombre: ${producto[0].title}</h2> <h3>Precio: ${producto[0].price}</h3> <img style="margin-bottom: 10px"height="250px" src="${producto[0].thumbnail}"></div>`;
            res.send(
                `<h1 style="text-align: center">Producto al azar:</h1><section style="display: flex; justify-content: space-around">${card}</section>`
            );
        } catch (error) {
            console.log(`Error obteniendo un producto al azar: ${error}`);
        }
    };
    ejecutar();
});




// const express = require('express');
// const app = express();
// const Contenedor = require('./Contenedor')
// const productos = require('./productos.json')
// const puerto = 8080;

// app.get('/', (req, res) => {
//     try {
//         res.end('<h1 style="color:green">Bienvenidos al servidor express</h1> </hr> <h3>Desafío entregable n°3</h3>');
//     } catch (err) {
//         console.log(`Error al cargar ${err}`);
//     }
// });

// app.get('/productos', (req, res) => {
//     const run = async () => {
//         try {
//             const arrayProductos = await productos.getAll();
//             let card = ``;
//             arrayProductos.map(
//                 item => 
//                 (card += `<div style="background-color: black; color: white; text-align: center; height: auto; width: 300px"><h2>Nombre: ${item.title}</h2><h3>Precio: ${item.price}</h3><img style="margin-bottom: 10px" height="250px" src="${item.thumbnail}"></div>`)
//             )
//             res.send(`<h1 style="text-align: center">Todos los productos:</h1><section style="display: flex; justify-content: space-around">${card}</section>`)
//         } catch (err) {
//                 console.log(`Error en carga de productos ${err}`);
//             } 
//     };
//     run();
// })

// app.get('/prodRANDOM', (req, res) => {
//     const run = async () => {
//         try {
//             const arrayProductos = await productos.getAll();
//             let numberRandom = Math.floor(Math.random() * productos.length)
//             const producto = await productos.getById(numero + 1);
//             let card = `<div style="background-color: black; color: white; text-align: center; height: auto; width: 300px"><h2>Nombre: ${producto[0].title}</h2> <h3>Precio: ${producto[0].price}</h3> <img style="margin-bottom: 10px"height="250px" src="${producto[0].thumbnail}"></div>`;
//             res.send(
//                 `<h1 style="text-align: center">Producto al azar:</h1><section style="display: flex; justify-content: space-around">${card}</section>`
//             );
//         } catch (error) {
//             console.log(`Error obteniendo un producto al azar: ${error}`);
//         }
//     };
//     run();
// })

// const conexionServidor = app.listen(puerto, () => {
//     console.log(`Aplicación escuchando en el puerto ${conexionServidor.address().port}`);
// });

// conexionServidor.on('Error', error => console.log(`Ha ocurido un error: ${error}`));