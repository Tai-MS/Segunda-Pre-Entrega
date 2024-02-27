import express from 'express'
import productsManager from '../DAO/DBManagers/products.manager.js'

const router = express.Router()

//endpoints
router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts(req.query.sort, req.query.category, req.query.page, req.query.limit, req.query.status);
        const currentPage = parseInt(req.query.page); 
        let prevPage = null;
        let nextPage = null;
        console.log(currentPage);
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
//Enpoint conectado con el view /products
router.get('/products', async(req, res) => {
    
    const query = {
        sort: req.query.sort,
        category: req.query.category,
        page: req.query.page,
        limit: req.query.limit,
        status: req.query.status
    };
    res.render('products', query)
})

router.get('/:pid', async(req, res) => {
    let response = await productsManager.getProductsById(req.params.pid)
    res.json(response)
})

router.post('/', async(req, res) => {
    let response = await productsManager.addProduct(req.body)
    res.json(response)
})

router.put('/:pid', async(req, res) => {
    let response = await productsManager.updateProduct(req.params.pid, req.body)
    res.json(response)
})

router.delete('/:pid', async(req, res) => {
    let response = await productsManager.deleteProduct(req.params.pid)
    res.json(response)
})
export default router