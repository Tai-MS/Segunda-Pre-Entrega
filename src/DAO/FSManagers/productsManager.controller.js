import fs from 'fs'

class ProductManager{

    constructor(){
        this.path = 'src/json/products.json'
        this.products = []
        this.counter = 1
    }

    readJson(){
        try {
            if(fs.existsSync(this.path)){
                const data = fs.readFileSync(this.path, 'utf-8')
                const parsedData = JSON.parse(data)
    
                this.products = parsedData
                return true
            }else{
                fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
                return 'Products JSON successfully created', true
            }
        } catch (error) {
            return `Error reading JSON` + error
        }
    }

    addProduct(newProduct){
        try {
            if(this.readJson()){
                const maxId = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) : 0
                this.counter = maxId
    
                const {title, description, price, thumbnail, code, stock, status, category} = newProduct
    
                if(!title || !description || !price || !code || !stock || !category){
                    console.log("t",description);
                    return 'All fields must be completed'
                }
    
                if(newProduct.thumbnail !== ''){
                    newProduct.thumbnail = thumbnail
                }else{
                    newProduct.thumbnail = 'No image'
                }
    
                if(newProduct.status !== 'false'){
                    newProduct.status = true
                }else{
                    newProduct.status = false
                }
    
                const repeatedCode = this.products.findIndex(product => product.code === newProduct.code)
    
                if(repeatedCode === -1){
                    newProduct = {
                        id: newProduct.id = this.counter + 1,
                        ...newProduct
                    }
                    this.products.push(newProduct)
    
                    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
                    return `The product ${newProduct.title} was added to the JSON`
                }else{
                    return `Product code, ${newProduct.code}, already exists`
                }
            }
        } catch (error) {
            this.readJson()
            return `Error creating new product` + error
        }
    }

    getProducts(){
        this.readJson()
        return this.products
    }

    getProductsById(pid){
        try {
            this.readJson()
            const selectedProduct = this.products.find(product => product.id === parseInt(pid))

            if(!selectedProduct){
                return `Product ID ${pid} doesn´t exists`, false
            }else{
                return selectedProduct
            }
        } catch (error) {
            this.readJson()
            return `Error getting product` + error
        }
        
    }

    async updateProduct(pid, updatedField){
        try {
            this.readJson()

            const idCoincidence = this.products.findIndex(event => event.id === parseInt(pid));

            if(idCoincidence === -1){
                return `The ID ${pid} doesn't exists`
            }else{
                let selectedProduct = this.products[idCoincidence]

                if (updatedField.code !== selectedProduct.code) {
                    const existingProduct = this.products.find(product => product.code === updatedField.code);
        
                    if (existingProduct) {
                        return `Product code "${updatedField.code}" already exists`;
                    }
                }

                Object.assign(selectedProduct, updatedField)

                const updateProductStr = JSON.stringify(this.products, null, 2)

                await fs.promises.writeFile(this.path, updateProductStr)

                return `The product with the ID ${pid} has been modified`
            }
        } catch (error) {
            this.readJson()
            return `Error updating product` + error
        }
        
    }

    async removeProduct(pid){
        try {
            this.readJson()
            const idToRemove = parseInt(pid)
    
            const idCoincidence = this.products.findIndex(event => event.id === idToRemove);
    
            if(idCoincidence !== -1){
                const newArr = this.products.filter(product => product.id !== idToRemove)
                
                await fs.promises.writeFile(this.path, JSON.stringify(newArr, null, 2))
                
                return  `Product with the ID ${pid} has been removed`
            }else{
                return `The ID ${pid} doesn't exists`
            } 
        } catch (error) {
            this.readJson()
            return `Error deleting product` + error
        }
        
    }
}

const productManager = new ProductManager

console.log(productManager.addProduct({
    "title": "Google Pixel 4",
    "description": "Ultimo celular de Google",
    "code": "gopdx4",
    "price": "800",
    "statu": true,
    "stock": "10",
    "category": "celular",
    "thumbnail": "No image"
  }));
export default productManager