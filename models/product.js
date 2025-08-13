const path = require("path");
const fs = require("fs").promises;

const appPath = require("../utils/path");

// products.json path directory
const p = path.join(appPath, "data", "products.json");

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.id = Math.floor(Math.random() * 100000).toString(); // dummy pseudo-random ID
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // ^ get the current available products data
  static async #loadData() {
    try {
      const data = await fs.readFile(p);
      // console.log("console.log() in 'models/product.js':", JSON.parse(data)); // DEBUGGING
      return JSON.parse(data);
    } catch (error) {
      // * if products.json file does not exist
      if (error.code === "ENOENT") {
        let products = [];
        await fs.writeFile(p, JSON.stringify(products));
        return JSON.parse(products);
      } else {
        throw error;
      }
    }
  }

  async save(id) {
    const products = await Product.#loadData(); // getting the current products

    // * if 'id' was provided when calling the save() method, it means the Products were meant to be updated
    if (id !== undefined) {
      const existingProductIndex = products.findIndex(
        (product) => product.id === id
      );

      Object.assign(products[existingProductIndex], {
        title: this.title,
        imageUrl: this.imageUrl,
        description: this.description,
        price: this.price,
      });
    } else {
      products.push(this); // pushing the newly created product into the local Array
    }

    // ^ writing all of the products into the products.json file
    fs.writeFile(p, JSON.stringify(products), (err) => {
      console.log(err);
    });
  }

  static async deleteProduct(id) {
    const products = await Product.#loadData(); // get the current products
    const filteredProducts = products.filter((product) => product.id !== id);

    // ^ write all of the product data into the file
    fs.writeFile(p, JSON.stringify(filteredProducts), (err) => {
      console.log(err);
    });
  }

  // * 'static', so we can call this method directly on the Class itself - not on the single instance of the 'Product'
  static async fetchAll() {
    const products = await Product.#loadData();
    return products;
  }

  static async findById(id) {
    const products = await Product.#loadData();

    const filteredProduct = products.find((product) => product.id === id);

    // ^ error handler - if the item ID got corrupted / deleted / etc
    if (!filteredProduct) {
      return {
        id,
        title: "Item not found!",
        description: "Item not found!",
        price: 0,
        wasDeleted: true,
      };
    }
    // console.log(filteredProduct); // DEBUGGING
    return filteredProduct;
  }
};
