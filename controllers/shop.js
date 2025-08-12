const Product = require("../models/product");

exports.getProductsPage = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render("shop/product-list", {
    products,
    pageTitle: "All Products",
    path: "/products",
  });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.id;
  const filteredProduct = await Product.findById(prodId);

  res.render("shop/product-detail", {
    product: filteredProduct,
    pageTitle: `${filteredProduct.title} Details`,
    path: "/products",
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render("shop/index", {
    products,
    pageTitle: "Shop",
    path: "/",
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId)
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
