const Contenedor = require('./Contenedor.js');

let contenedor = new Contenedor ('productos.txt');

let producto1 = {
    id: 1,
    title: 'producto1',
    desc: 'un producto1',
    price: 100,
}
let producto2 = {
    id: 2,
    title: 'producto2',
    desc: 'un producto2',
    price: 200
}
let producto3 = {
    id: 3,
    title: 'producto3',
    desc: 'un producto3',
    price: 300
}

metodos = async() => {
    console.log(await contenedor.save(producto1))
    console.log(await contenedor.save(producto2))
    console.log(await contenedor.save(producto3))
    console.log(await contenedor.getAll())
}
metodos()