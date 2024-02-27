import express from 'express'
import cartsManager from '../DAO/DBManagers/carts.manager.js'

const router = express.Router()

//endpoints
router.get('/', async(req, res) => {
    let response = await cartsManager.getCarts()
    res.send(response)
})
//Enpoint conectado con el view /cart
router.get('/cart/:cid', async(req, res) => {
    let response = {cid: req.params.cid}
    console.log(response);
    res.render('cart', response)
})

router.get('/:cid', async(req, res) => {
    let response = await cartsManager.getCartsById(req.params.cid)
    res.send(response)
})

router.post('/', async(req, res) => {
    let response = await cartsManager.createCart()
    res.send(response)
})

//Actualiza la DB agregando el producto al carrito
router.put('/:cid/products/:pid', async(req, res) => {
    let response = await cartsManager.addProductToCart(req.params.cid, req.params.pid, req.body.add)
    res.send(response)
})

router.put('/:cid', async(req, res) => {
    let response = await cartsManager.addMultiProducts(req.params.cid, req.body)
    res.send(response)
})

router.delete('/:cid/products/:pid', async(req, res) => {
    let response = await cartsManager.deleteProductOfCart(req.params.cid, req.params.pid)
    res.json(response)
})

router.delete('/:cid', async(req, res) => {
    let response = await cartsManager.deleteAllProducts(req.params.cid)
    res.send(response)
})

export default router