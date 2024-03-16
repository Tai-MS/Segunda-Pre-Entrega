import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/", (req, res) => {
  res.render('login', { user: req.user })
});

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { firstName, lastName, email, age } = req.session.user;
  res.render("profile", { firstName, lastName, email, age });
});

router.get('/products', async(req, res) => {
  const query = {
    sort: req.query.sort,
    category: req.query.category,
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status,
    username: req.cookies['username'] || (req.session.username ? req.session.username : undefined)
};
if(query.username !== undefined){
    res.render('products', query)
}else{
  res.redirect('/')
}
})
router.get('/failregister', async(req, res) => {
  res.send('Mail already in use.')
})
router.get('/faillogin', async(req, res) => {
  res.send('Invalid credentials.')
})
router.get('/changepass', (req, res) => {
  res.render('changePass')
})
router.get('/:cid', async(req, res) => {
  let response = {cid: req.params.cid}
  res.render('cart', response)
})


export default router;