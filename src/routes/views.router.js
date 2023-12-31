import { Router } from "express";
import { ProductManager } from "../DAL/dao/fileSistDao/products.dao.fileS.js";
import { ProductManagerDB } from "../DAL/dao/mongoDao/products.dao.mongo.js";
import { CartManagerDB } from "../DAL/dao/mongoDao/carts.dao.mongo.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const productManagerDB = new ProductManagerDB();
const cartManagerDB = new CartManagerDB();
const productManager = new ProductManager();
const routerViews = Router();

routerViews.get("/", async (req, res) => {
  let products = await productManager.getProduct();

  res.render("home", {
    products: products,
  });
});

routerViews.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});


routerViews.get("/chat",authMiddleware(["user"]), async (req, res) => {
  res.render("chat");
});

/*
routerViews.get("/products", async (req, res) => {

  if (!req.session.user) {

    return res.redirect("/api/views/login")
    
  }

  let products = await productManagerDB.findAll(req.query)

  let productsDB = products.payload

  const productsObject = productsDB.map(p => p.toObject());

  res.render("products", {
    productsData: productsObject,
    user: req.session.user
  });


});
*/
routerViews.get("/products", async (req, res) => {

  if (!req.session.passport) {

    return res.redirect("/api/views/login")

  }

  let products = await productManagerDB.findAll(req.query)

  let productsDB = products.payload

  const productsObject = productsDB.map(p => p.toObject());

  const { name } = req.user


  res.render("products", {
    productsData: productsObject,
    user: { name },
    style: "product"
  });


});

routerViews.get("/carts/:cartId", async (req, res) => {

  const { cartId } = req.params

  let cartById = await cartManagerDB.findCartById(cartId);

  let cartArray = cartById.products;

  const cartArrayObject = cartArray.map(doc => doc.toObject());

  console.log(cartArrayObject);

  res.render("cart", {
    cartData: cartArrayObject
  });

});



routerViews.get("/login", async (req, res) => {



  if (req.session.user) {

    return res.redirect("/api/views/products")

  }

  res.render("login")

});


routerViews.get("/signup", async (req, res) => {

  if (req.session.user) {

    return res.redirect("/api/views/products")

  }

  res.render("signup")

});

routerViews.get("/profile", async (req, res) => {

  res.render("profile")

});

routerViews.get("/restaurarPassword", async (req, res) => {

  res.render("restaurarPassword")


});

routerViews.get('/error', async (req, res) => {

  const reqMessages = req.session.messages;

  const message = reqMessages[reqMessages.length - 1]


  res.render("error", { message })
})

export { routerViews };



