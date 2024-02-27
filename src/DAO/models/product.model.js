import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'title']},
    description: {type: String, required: [true, 'description']},
    code: {type: String, required: [true, 'code'], unique: [true, 'Code already in use']},
    price: {type: Number, required: [true, 'price']},
    status: {type: Boolean, default: true},
    stock: {type: Number, required: [true, 'stock']},
    category: {
        type: String,
        required: [true, 'category'],
        set: function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    },
    thumbnail: {type: String, default: 'No image'},
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productCollection, productSchema)

export default productModel