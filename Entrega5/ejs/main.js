const express = require('express');
const app = express();
const PORT = 8080;
// const fs = require('fs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

const fs = require("fs");

class Contenedor {
    constructor(file) {
        this.file = file;
    }

    exists(file) {
        /* verifico si existe el archivo */
        try {
            if (!fs.existsSync(file)) {
                throw new Error("El archivo no existe");
            } else {
                return true;
            }
        } catch (error) {
            console.log(`Error buscando el archivo: ${error.message}`);
        }
    }

    async readFile(file) {
        try {
            /* leo el archivo */
            const data = await fs.readFileSync(file);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error al leer el archivo: ${error.message}`);
        }
    }

    async writeFile(file, contenido) {
        try {
            /* escribir archivo */
            await fs.writeFileSync(file, JSON.stringify(contenido, null, 4));
        } catch (error) {
            console.log(`Error escribiendo el archivo: ${error.message}`);
        }
    }

    async save(producto) {
        try {
            /* busco si existe el archivo con datos y si no tiene datos agrego el producto con id: 1 */
            if (!this.exists(this.file)) {
                console.log(`Se procede a crear datos nuevos`);
                let arrayProductos = [];
                producto = { id: 1, ...producto };
                arrayProductos.push(producto);
                console.log(`Agregando producto...`);
                await fs.writeFile(this.file, arrayProductos);
                console.log(
                    `Se agrego el producto nuevo con el id: ${producto.id}`
                );
                return producto.id;
            } else {
                /* si el archivo existe, primero verifico si esta vacio */
                if (this.readFile(this.file)) {
                    console.log(`Leyendo archivo...`);
                    const data = await this.readFile(this.file);
                    if (data.length === 0) {
                        /* Si el archivo esta vacio le asigno el id: 1 */
                        producto = { id: 1, ...producto };
                    } else {
                        /* si ya tiene algun producto, se le asigna el nro de id que siga */
                        let ultimoId = data[data.length - 1].id;
                        producto = { id: ultimoId + 1, ...producto };
                    }
                    console.log(`Agregando producto al archivo...`);
                    data.push(producto);
                    /* se escribe el producto */
                    this.writeFile(this.file, data);
                    console.log(
                        `Se agrego el nuevo producto con el id: ${producto.id}`
                    );
                    return producto.id;
                }
            }
        } catch (error) {
            console.log(`Error agregando el producto: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            /* chequeo que exista el documento */
            if (this.exists(this.file)) {
                const data = await this.readFile(this.file);
                /* uso filter para buscar el producto con el id que queramos */
                const dataId = data.filter(item => item.id === id);
                if (dataId.length === 0) {
                    throw new Error(
                        "No se encontro un producto con el id solicitado"
                    );
                } else {
                    console.log(`Producto con id ${id} encontrado:\n`, dataId);
                    return dataId;
                }
            }
        } catch (error) {
            console.log(`Error buscando producto con el id: ${error.message}`);
        }
    }

    async getAll() {
        /* chequeo si existe el documento */
        try {
            if (this.exists(this.file)) {
                console.log(`Leyendo archivo...`);
                const data = await this.readFile(this.file);
                /* una vez que verifico si existe, veo si esta vacio o tiene contenido */
                if (data.length !== 0) {
                    console.log(`Archivo con contenido:`);
                    console.log(data);
                    return data;
                } else {
                    throw new Error(`El archivo ${this.file} esta vacio`);
                }
            }
        } catch (error) {
            console.log(
                `Error obteniendo todos los productos: ${error.message}`
            );
        }
    }

    async deleteById(id) {
        /* chequeo si existe el documento */
        try {
            if (this.exists(this.file)) {
                const data = await this.readFile(this.file);
                /* verifico que exista el id */
                console.log(`Buscando producto con el id solicitado...`);
                if (data.some(item => item.id === id)) {
                    const data = await this.readFile(this.file);
                    /* elimino producto */
                    console.log(`Eliminando producto con id solicitado...`);
                    const datos = data.filter(item => item.id !== id);
                    this.writeFile(this.file, datos);
                    console.log(`Producto con el id ${id} eliminado`);
                } else {
                    throw new Error(
                        `No se encontro el producto con el id ${id}`
                    );
                }
            }
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando el producto con el id solicitado: ${error.message}`
            );
        }
    }

    async deleteAll() {
        try {
            /* chequeo si existe el documento */
            let nuevoArray = [];
            console.log(`Borrando datos...`);
            await this.writeFile(this.file, nuevoArray);
            console.log(
                `Se borraron todos los datos del archivo ${this.file}`
            );
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando los datos: ${error.message}`
            );
        }
    }
}
      
const productos = new Contenedor([]);

app.get('/productos', (req, res) => {
    const listaProductos = productos.getAll();
    res.render('lista', {
        productos: listaProductos
    });
});
app.post('/productos', (req, res) => {
    const producto = req.body;
    productos.save(producto);
    res.render('formulario', {});
});
app.get('/formproductos', (req, res) => {
    res.render('formulario', {});
});

const server = app.listen(PORT, () => {
    console.log(`Server listening: ${server.address().port}`)
});
server.on('error', error => console.log(`error ${error}`));