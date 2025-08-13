const path = require("path");
const fs = require("fs").promises;

const appPath = require("../util/path");

// products.json path directory
const p = path.join(appPath, "data", "cart.json");

// TODO add try-catch blocks here and in Product model

module.exports = class Cart {
  static async addProduct(id) {
    const cart = await Cart.#loadData(); // get the current cart data
    const existingProductIndex = cart.findIndex((item) => item.id === id); // check if the cartItem already exists

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity++; // increase quantity if the cartItem already exists
    } else {
      cart.push({ id, quantity: 1 }); // add a new cartItem if it doesn't already exist
    }

    // ^ write all of the cart data into the file
    fs.writeFile(p, JSON.stringify(cart), (err) => {
      console.log(err);
    });
  }

  static async deleteCartItem(id) {
    const cart = await Cart.#loadData(); // get the current cart data
    const filteredCart = cart.filter((item) => item.id !== id);

    // ^ write all of the cart data into the file
    fs.writeFile(p, JSON.stringify(filteredCart), (err) => {
      console.log(err);
    });
  }

  // ^ get the current cart data
  static async #loadData() {
    try {
      const data = await fs.readFile(p);
      console.log("console.log() in 'models/cart.js':", JSON.parse(data)); // DEBUGGING
      return JSON.parse(data);
    } catch (error) {
      // * if cart.json file does not exist
      if (error.code === "ENOENT") {
        let cart = [];
        await fs.writeFile(p, JSON.stringify(cart));
        return JSON.parse(cart);
      } else {
        throw error;
      }
    }
  }

  static async fetchAll() {
    const cart = await Cart.#loadData();
    return cart;
  }
};
