import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'

class CartsManager {
    static #instance

    static getInstance(){
        if(!CartsManager.#instance){
            CartsManager.#instance = new CartsManager
        }
        return CartsManager.#instance
    }

    async createCart(){
        try {
            const createElement = await cartModel.create({quantity: 0})
            return `Cart created. Cart ID: ${createElement._id}`
        } catch (error) {
            return `Error: ${error}`
        }    
    }

    async getCarts(){
        try {
            const carts = await cartModel.find()
            if(carts){
                return carts
            }else{
                return 'There are no carts'
            }
        } catch (error) {
            return `Error: ${error}`
        }    
    }

    async getCartsById(cid){
        try {
            const cart = await cartModel.findById(cid).populate('cartProducts.productId');
            if(cart){
                console.log(cart);
                return cart
            }else{
                console.log("hola");
                return 'Cart not found'
            }
        } catch (error) {
            return error
        }        
    }

    async addMultiProducts(cid, productsArr) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            let notFoundArr = []
            if (!cart) {
                return 'Cart not found';
            }
    
            const productIds = Object.values(productsArr);
            await Promise.all(productIds.map(async (productId) => {
                const productExist = await productModel.findById(productId);
                if (!productExist) {
                    notFoundArr.push(productId);
                }
                
                await this.addProductToCart(cid, productId);
                
            }));
            if(notFoundArr.length > 0){
                return `Products added. Except for ${notFoundArr}`
            }
            return 'Products added successfully';
        } catch (error) {
            return `Error: ${error}`;
        }
    }
    
    

    async addProductToCart(cid, pid, add = 1) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                return 'Cart not found';
            }
    
            const product = await productModel.findOne({ _id: pid });
            if (!product) {
                return 'Product not found';
            }
            
            const existingProduct = cart.cartProducts.find(info => info.productId.toString() === pid);
            if (existingProduct) {
                existingProduct.quantity += add;
            } else {
                cart.cartProducts.push({
                    quantity: add,
                    productId: pid
                });
            }
    
            await cart.save();
            return cart;
        } catch (error) {
            return `Error: ${error}`;
        }
    }
    

    async deleteProductOfCart(cid, pid) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                return `Cart not found`;
            }
    
            const productIndex = cart.cartProducts.findIndex((element) => element.productId.toString() === pid);
            console.log(productIndex);
            if (productIndex !== -1) {
                const productTitle = await productModel.findOne({ _id: pid })
                console.log(productTitle.title);
                const productQuantity = cart.cartProducts[productIndex].quantity;
                if (productQuantity > 1) {
                    cart.cartProducts[productIndex].quantity -= 1;
                    await cart.save();
                    return `The product: ${productTitle.title} quantity was reduced. You still have: ${productQuantity - 1} unit(s) of this product.`;
                } else {
                    cart.cartProducts.splice(productIndex, 1);
                    await cart.save();
                    return `${productTitle} removed from cart.`;
                }
            } else {
                return `Product not found in cart`;
            }
        } catch (error) {
            return `Error: ${error}`;
        }
    }
    

    async deleteAllProducts(cid){
        try {
            const cart = await cartModel.findOne({_id: cid});
            if (!cart) {
                return 'Cart not found';
            }
            const cartLength = cart.cartProducts.length

            if(cartLength === 0){
                return 'Cart empty'
            }

            cart.cartProducts.splice(0, cart.cartProducts.length)
            cart.save()
            return 'All products removed.';
        } catch (error) {
            return `Error: ${error}`
        }        
    }
}

const cartsManager = new CartsManager

export default cartsManager