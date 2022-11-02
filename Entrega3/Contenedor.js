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

module.exports = Contenedor;






// const fs = require('fs');

// class Contenedor {
//     constructor(file) {
//         this.file = file;
//     }

//     async save (producto) {
//         try {
//             //generar el archivo/file
//             if (fs.existsSync(this.file)) {

//                 //en el caso de que el archivo de objetos exista debemos leer el archivo
//                 let productos = await this.getAll();
//                 if (productos.length > 0) {
//                     let lastId = productos[productos.length-1].id+1 //al ultimo objeto del id le suma 1 y se lo asigna

//                     let newProducto = {
//                         id: lastId,
//                         ...producto
//                     }
//                     productos.push(newProducto);
//                     //en este caso hay que sobreescribir el archivo pero enviándole el "result".
//                     await fs.promises.writeFile(this.file, JSON.stringify(productos, null, 2))
//                     return lastId;

//                 } else {
//                     let lastId=1

//                     let newProducto = {
//                         id: lastId,
//                         ...producto
//                     }
//                     productos.push(newProducto);
//                     //en este caso hay que sobreescribir el archivo pero enviándole el "result".
//                     await fs.promises.writeFile(this.file, JSON.stringify(productos, null, 2))
//                     return lastId;
//                 }
                
//             } else {

//                 //generar un producto/objeto con id1 ya que es la creación del archivo
//                 let newProducto = {
//                     id: 1,
//                     title: producto.title,
//                     desc: producto.desc,
//                     price: producto.price,
//                     //utilizamos "...productos" (spread operator) para copiar la información dentro del producto nuevo
//                 }

//                 //los objetos hay que introducirlos en un array, para ello podemos encerrar a "producto", dentro de corchetes []
//                 await fs.promises.writeFile(this.file, JSON.stringify([newProducto], null, 2));
//                 return 1;
//             }

//         } catch (err) {
//             console.log(err)
//         }
//     }

//     async getAll() {
//         try {
//             if (fs.existsSync(this.file)){
//                 let info = await fs.promises.readFile(this.file, 'utf-8');
//                 let result = JSON.parse(info)
//                 return result;
//             } else {
//                 return "No se ha encontrado el archivo 'file'"
//             }
//             } catch (err) {
//                 console.log(err);
//         }
//     }

//     async getById(id) {
//         try {
//             const data = await this.getAll()
//             let itemToFind = data.find((item) => item.id === id)
//             console.log(itemToFind ? itemToFind : null)
//             return itemToFind ? itemToFind: null
//             } catch(err) {
//             console.log(err)
//         }
//     }

//     async deleteById(id) {
//         try {
//             const data = await this.getAll()
//             let itemToDeleteById = data.filter((item) => item.id !== id)
//             await fs.promises.writeFile(this.file, itemToDeleteById)
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     async deleteAll() {
//         try {
//             const data = await this.getAll()
//             this.producto = []
//             this.writeData(this.producto)
//             await fs.promises.writeFile(this.file, "[]")
//         } catch (err) {
//             console.log(err);
//         }
//     }
// }

// let contenedor = new Contenedor ('productos.txt');

// let producto1 = {
//     id: 1,
//     title: 'producto1',
//     desc: 'un producto1',
//     price: 100,
// }
// let producto2 = {
//     id: 2,
//     title: 'producto2',
//     desc: 'un producto2',
//     price: 200
// }
// let producto3 = {
//     id: 3,
//     title: 'producto3',
//     desc: 'un producto3',
//     price: 300
// }

// metodos = async() => {
//     console.log(await contenedor.save(producto1))
//     console.log(await contenedor.save(producto2))
//     console.log(await contenedor.save(producto3))
//     console.log(await contenedor.getAll())
//     console.log(await contenedor.getById(id))
//     console.log(await contenedor.deleteById(id))
//     console.log(await contenedor.deleteAll())
// }
// metodos()

// module.exports = Contenedor