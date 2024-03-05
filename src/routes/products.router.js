import express from 'express'
import productsManager from '../DAO/DBManagers/products.manager.js'

const router = express.Router()

//endpoints
router.get('/api/products', async (req, res) => {
    try {
        const products = await productsManager.getProducts(req.query.sort, req.query.category, req.query.page, req.query.limit, req.query.status);
        const currentPage = parseInt(req.query.page); 
        let prevPage = null;
        let nextPage = null;
        if (currentPage > 1) {
            const prevPageUrl = `${req.originalUrl.replace(/page=\d+/g, `page=${currentPage - 1}`)}`;
            prevPage = prevPageUrl;
        }

        if (currentPage < products.totalPages) {
            const nextPageUrl = `${req.originalUrl.replace(/page=\d+/g, `page=${currentPage + 1}`)}`;
            nextPage = nextPageUrl;
        }

        const modifiedProducts = {
            ...products,
            prevPage: prevPage,
            nextPage: nextPage
        };

        res.send({ result: 'success', payload: modifiedProducts });
    } catch (error) {
        res.send({ result: 'error' })
    }
})

router.get('/api/products/:pid', async(req, res) => {
    let response = await productsManager.getProductsById(req.params.pid)
    res.json(response)
})

router.post('/api/products', async(req, res) => {
    let response = await productsManager.addProduct(req.body)
    res.json(response)
})

router.put('/api/products/:pid', async(req, res) => {
    let response = await productsManager.updateProduct(req.params.pid, req.body)
    res.json(response)
})

router.delete('/api/products/:pid', async(req, res) => {
    let response = await productsManager.deleteProduct(req.params.pid)
    res.json(response)
})
export default router