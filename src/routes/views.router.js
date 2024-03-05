import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
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
      username: req.query.username
  };
  res.render('products', query)
})

router.get('/:cid', async(req, res) => {
  let response = {cid: req.params.cid}
  res.render('cart', response)
})

export default router;