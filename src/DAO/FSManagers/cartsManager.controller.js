import fs from 'fs'
import productManager from './productsManager.controller.js'

class CartManager{

    constructor(){
        this.path = './src/json/carts.json'
        this.carts = []
    }

    readJson(){
        //Si existe el JSON en el ruta copia su contenido al this.carts
        //Si no existe lo crea con el contenido de this.carts
        if(fs.existsSync(this.path)){
            const data = fs.readFileSync(this.path, 'utf-8')
            const parsedData = JSON.parse(data)

            this.carts = parsedData

            return true
        }else{
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2))
            return true + `Carts JSON successfully created`
        }
    }

    async createCart(){
        try{
            //Transforma el contenido del JSON y luego lo parsea
            const data = await fs.promises.readFile(this.path, 'utf-8')

            const currentCarts = JSON.parse(data)

            //Crea la estructura de carts y la añade al array
            const newCart = {
                id: currentCarts.length + 1,
                products: []
            }

            currentCarts.push(newCart)

            //Escribe el array en el JSON
            await fs.promises.writeFile(this.path, JSON.stringify(currentCarts, null, 2))

            return `Added new cart, ID ${newCart.id}`
        }catch(error){
            this.readJson()
            return `Error creating new cart` + error
        }
    }

    async getCartByID(cid){
        try {
            this.readJson()
            //Busca cart ID que coincida con el argumento pasado
            const cartIndex = this.carts.find(cart => cart.id === parseInt(cid))
            console.log();
            if(!cartIndex){
                return `Cart ${cid} not found`
            }else{
                return cartIndex
            }
        } catch (error) {
            this.readJson()
            return `Error getting cart` + error
        }
    }

    async addProductToCart(cid, pid){
        try {
            this.readJson()
            //Busca el indice del cart seleccionado y el producto solicitado
            const cartIndex = this.carts.findIndex(cart => cart.id === parseInt(cid))
            const productExists = productManager.getProductsById(pid)
    
            if(cartIndex !== -1){
                //Verifica que el producto exista
                const productIndex = this.carts[cartIndex].products.findIndex(product => product.id === parseInt(pid))
                if(!productExists){
                    return `Product not found`
                }else{
                    //Si el producto existe, verifica si ya se encuentra en el cart
                    //Si ya esta en el cart, aumenta su cantidad sino añade uno nuevo
                    if(productIndex !== -1){
                        this.carts[cartIndex].products[productIndex].quantity++
                    }else{
                        this.carts[cartIndex].products.push({id: parseInt(pid), quantity: 1})
                    }
                }
                //Escribe los cambios en el JSON
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
                return `Product with ID ${pid} added to cart with ID ${cid} \n 
                    Now you have ${this.carts[cartIndex].products[productIndex].quantity} of this product on your cart`;
            }else{
                return `Cart not found`
            }
        } catch (error) {
            this.readJson()
            return `Error adding product` + error
        }
    }
}

const cartManager = new CartManager

export default cartManager