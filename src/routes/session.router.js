import express from "express";
import userManager from "../DAO/DBManagers/user.manager.js";
import passport from 'passport'

const router = express.Router();

router.post('/register', (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.status(400).send('Email already in use.');
      }
      res.redirect('/');
  })(req, res, next);
});

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async(req, res) => {
  if(!req.user) return res.status(400).send({status: 'error', error: 'Invalid credentials'})
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    age: req.user.age
  }
  res.cookie('role', req.user.role, { maxAge: 10000, signed: true });
  res.cookie('username', req.session.user.firstName, {maxAge: 100000})
  res.redirect(`/products`)
})
router.post('/changepass', async(req, res) => {
  const result = await userManager.changePassword(req.body, req.session)
  if(result !== 'error'){
    res.redirect('/')

  }else{
    res.send('Password doesn´t match.')
  }
})
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async(req, res) => {
});

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async(req, res) => {
    req.session.user  = req.user;
    res.cookie('username', req.user, {maxAge: 100000})
    
    res.redirect(`/products`)
  });

router.post('/logout', (req, res) => {
  if (req.session && req.session.user) {
      res.clearCookie('username');
      res.clearCookie('role');
      req.session.destroy((err) => {
          if (err) {
              console.error('Error destroying session:', err);
              res.status(500).send('Internal server error');
          } else {
              console.log('User session destroyed');
              setTimeout(() => {
                  res.redirect('/');
              }, 500)
          }
      });
  } else {
      console.log('No user session found');
      res.redirect('/');
  }
});


export default router;