import express from 'express'
import chatManager from '../DAO/DBManagers/chat.manager.js'

const router = express.Router()

//Endpoints
router.get('/', (req, res) => {
    res.render('chat')
})

export default router