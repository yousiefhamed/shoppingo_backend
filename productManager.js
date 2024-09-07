const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor() {
    this.products = [];
    this.productsFilePath = path.join(__dirname, "products.json");
  }

  async saveProducts() {
    try {
      const productsJson = JSON.stringify(this.products);
      await fs.writeFile(this.productsFilePath, productsJson);
    } catch (error) {
      console.log(error);
    }
  }

  async loadProducts() {
    try {
      const list = await fs.readFile(this.productsFilePath, "utf8");
      this.products = JSON.parse(list);
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(product) {
    await this.loadProducts();
    const newProduct = {
      ...product,
      id: uuidv4(),
    };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.loadProducts();
    const productObj = this.products.find(
      (product) => product.id.toString() === id.toString()
    );
    if (!productObj) {
      throw new Error("Product not found");
    }
    return productObj;
  }

  async filterProducts(minPrice, maxPrice) {
    await this.loadProducts();
    const filteredProducts = this.products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    if (filteredProducts.length === 0) {
      throw new Error("No products found within the given price range");
    }
    return filteredProducts;
  }

  async updateProduct(id, updatedProduct) {
    await this.loadProducts();
    const index = this.products.findIndex(
      (product) => product.id.toString() === id.toString()
    );
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products[index] = { ...this.products[index], ...updatedProduct };
    await this.saveProducts();
    return this.products[index];
  }

  async deleteProduct(id) {
    await this.loadProducts();
    const index = this.products.findIndex(
      (product) => product.id.toString() === id.toString()
    );
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(index, 1);
    await this.saveProducts();
    return "success";
  }
}

module.exports = ProductManager;
