//External imports
import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { Server } from 'socket.io'
import { mongoose } from 'mongoose'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import session from 'express-session'

//Internal imports
import __dirname from './utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import chatRouter from './routes/chat.router.js'
import sessionRouter from './routes/session.router.js'
import viewsRouter from './routes/views.router.js'

import chatManager from './DAO/DBManagers/chat.manager.js'
import productsManager from './DAO/DBManagers/products.manager.js'
import cartsManager from './DAO/DBManagers/carts.manager.js'

const app = express()
const PORT = 8080

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Handlebars config
app.engine('hbs', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '/public')))

//File Storage
app.use(cookieParser("myParser"));

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://taiel:hola123@cluster0.jawvxzu.mongodb.net/eCommerce2?retryWrites=true&w=majority");
    console.log("Base de datos conectada");
  } catch (err) {
    console.log(err);
  }
};

app.use(
  session({
      store: MongoStore.create({
          mongoUrl: "mongodb+srv://taiel:hola123@cluster0.jawvxzu.mongodb.net/eCommerce2?retryWrites=true&w=majority",
          ttl: 15,
        }),
        secret: "coderhouse",
        resave: false,
        saveUninitialized: false,
    }),
);

//Mongo DB 
mongoose.connect("mongodb+srv://taiel:hola123@cluster0.jawvxzu.mongodb.net/eCommerce2?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to data base');
    })
    .catch(error => {
        console.error(`Error connecting to data base. Error: ${error}`);
    })

//Routes
app.use('/', productsRouter)
app.use('/', cartsRouter)
app.use('/', chatRouter)
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);

//Server
const httpServer = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})

//Websocket config
const socketServer = new Server(httpServer)
const users = {}

socketServer.on('connect', async socket => {
    console.log('New client connected');

    socket.on('add', async(newProduct) => {
        try {
            const newProductObject = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,
            }
            let result = await productsManager.addProduct(newProductObject)
            const products = await productsManager.getProducts()

            socketServer.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                msg: result
            })
            socketServer.emit('response', {status: 'success', message: result})
            
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    socket.on('remove', async(pid) => {
        try {
            const response = await productsManager.deleteProduct(pid)
            const products = await productsManager.getProducts()

            socketServer.emit('productsResponse', { 
                result: 'success', 
                payload: products
            })
            socketServer.emit('response', {status: 'success', message: response})
            socketServer.emit('response', {status: 'success', message: response})
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    socket.on('getProducts', async (query) => {
        try {
            const maxPage = await productsManager.getTotalPages(query.sort, query.category, query.limit, query.status)
            if(query.page > maxPage){
                query.page = maxPage
            }
            const products = await productsManager.getProducts(
                query.sort, 
                query.category, 
                query.page, 
                query.limit, 
                query.status,
            );
            socket.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                options: query 
            });
        } catch (error) {
            socket.emit('productsResponse', { result: 'error' });
        }
    });  

    socket.on('addProductsToCart', async(cid, pid) => {
        const response = await cartsManager.addProductToCart(cid, pid)
        socket.emit('productsResponse', response)
    })

    socket.on('getCartByIdResponse', async(cid) => {
        const response = await cartsManager.getCartsById(cid.cid);
        socket.emit('cartResponse', response);        
    })

    socket.on('newUser', (username) => {
        users[socket.id] = username
        socketServer.emit('userConnected', username)

        chatManager.returnChat().then(messages => {
            messages.forEach(message => {
                socket.emit('message', {username: message.user, message: message.message})
            });
        }).catch(error => {
            console.error(`Error: ${error}`);
        })
    })

    socket.on("chatMessage", (message) => {
        const username = users[socket.id]
        if(message.length < 1){
            socketServer.emit("error")
        }else{
            socketServer.emit("response", chatManager.updateDb(users[socket.id],message))
            socketServer.emit("message", { username, message })
        }
    })

    socket.on("disconnect", () => {
        const username = users[socket.id]
        delete users[socket.id]
        socketServer.emit("userDisconnected", username)
    })
})

connectDb();
