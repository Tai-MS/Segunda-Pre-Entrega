import { paginate } from 'mongoose-paginate-v2';
import productModel from '../models/product.model.js'

class ProductsManager {
    static #instance;

    static getInstance(){
        if(!ProductsManager.#instance){
            ProductsManager.#instance = new ProductsManager()
        }
        return ProductsManager.#instance
    }

    async addProduct(newProduct){
        try {
            createElement = await productModel.create(newProduct);
            return `${newProduct.title} added to the product list.`;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errorMessage = error.errors.code.message;
                return `Complete all the fields. Missing field: ${errorMessage}` ;
            } else if(error.code === 11000){
                return `Code '${newProduct.code}' already exists`
            }else {
                console.error(error);
                return 'Internal server error' ;
            }
        }
    }
    async getTotalPages(sort, category, limit = 10, status){
        try {
            let sortOptions;
            let filter = {}

           
            if (limit > 10) {
                limit = 10;
            }
            
            if(status === "true"){
                filter.status = true
            }else if(status === "false"){
                filter.status = false
            }


            if (sort === 'asc') {
                sortOptions = { price: 1 };
            } else if (sort === 'desc') {
                sortOptions = { price: -1 };
            }
            
            if(category !== undefined){
                filter.category = category
            }
            const options = {
                limit: limit,
                sort: sortOptions
            }
            const getAll = await productModel.paginate(filter, options);
            return getAll.totalPages
    
        } catch (error) {
            throw new Error(error);
        }
    }
    async getProducts(sort, category, pagen = 1, limit = 10, status) {
        try {
            let sortOptions;
            let filter = {}

           
            if (limit > 10) {
                limit = 10;
            }
            
            if(status === "true"){
                filter.status = true
            }else if(status === "false"){
                filter.status = false
            }


            if (sort === 'asc') {
                sortOptions = { price: 1 };
            } else if (sort === 'desc') {
                sortOptions = { price: -1 };
            }
            
            if(category !== undefined){
                filter.category = category
            }
            const options = {
                limit: limit,
                page: pagen,
                sort: sortOptions
            }
            return await productModel.paginate(filter, options);
    
        } catch (error) {
            throw new Error(error);
        }
    }
    
    

    async getProductsById(pid){
        try {
            const product = await productModel.findOne({_id: pid})
            if(product){
                return product
            }
        } catch (error) {
            if(error.name === 'CastError'){
                return `Product not found` 
            }
            return `Error: ${error}`
        }
    }

    async updateProduct(pid, updatedFields){
        try {
            const product = await productModel.findOne({_id: pid})
            if(product){
                const update = await productModel.updateOne({_id: pid}, updatedFields)
                if(updatedFields.code === product.code){
                    return `Product updated. ${product.title}`
                }
                return `Product updated. ${product.title}`
            }
        } catch (error) {
            if(error.name === 'CastError'){
                return `Product not found` 
            } else if(error.code === 11000){
                return `Code '${updatedFields.code}' already exists`
            } else {
                return `Error: ${error}`
            }
        }
    }

    async deleteProduct(pid){
        try {
            const product = await productModel.findOne({_id: pid})
            if(product){
                await productModel.deleteOne({_id: pid})
                return `Product ${product.title} deleted.`
            }else {
                return `Product not found`
            }
        } catch (error) {
            return `Error: ${error}`
        }    
    }
}

const productsManager = new ProductsManager

export default productsManager