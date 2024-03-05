import express from "express";
import userManager from "../DAO/DBManagers/user.manager.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const response = await userManager.register(req.body)
  if(response === true){
    res.send(`Email '${req.body.email}' already in use.`)
  }
  res.redirect('/login')
});

router.post("/login", async (req, res) => {
  const response = await userManager.login(req.body, req.session)
  console.log(response);
  if(response === 'error'){
    res.send('Wrong password or email.')
  }
  res.redirect(response)
});

router.post('/logout', (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('User session destroyed');
                res.redirect('/login'); 
            }
        });
    } else {
        console.log('No user session found');
        res.redirect('/login'); 
    }
});





export default router;