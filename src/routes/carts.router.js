import express from 'express'
import cartsManager from '../DAO/DBManagers/carts.manager.js'

const router = express.Router()

//endpoints
router.get('/api/carts', async(req, res) => {
    let response = await cartsManager.getCarts()
    res.send(response)
})

router.get('/api/carts/:cid', async(req, res) => {
    let response = await cartsManager.getCartsById(req.params.cid)
    res.send(response)
})

router.post('/api/carts/', async(req, res) => {
    let response = await cartsManager.createCart()
    res.send(response)
})

router.put('/api/carts/:cid/products/:pid', async(req, res) => {
    let response = await cartsManager.addProductToCart(req.params.cid, req.params.pid, req.body.add)
    res.send(response)
})

router.put('/api/carts/:cid', async(req, res) => {
    let response = await cartsManager.addMultiProducts(req.params.cid, req.body)
    res.send(response)
})

router.delete('/api/carts/:cid/products/:pid', async(req, res) => {
    let response = await cartsManager.deleteProductOfCart(req.params.cid, req.params.pid)
    res.json(response)
})

router.delete('/api/carts/:cid', async(req, res) => {
    let response = await cartsManager.deleteAllProducts(req.params.cid)
    res.send(response)
})

export default router