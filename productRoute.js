const express = require("express");
const router = express.Router();
const ajv = require("ajv");
const { v4: uuidv4 } = require("uuid");

const ProductManager = require("./productManager");
const productManager = new ProductManager();

const productSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      default: uuidv4(),
    },
    title: { type: "string", minLength: 4 },
    description: { type: "string" },
    price: { type: "number", minimum: 0 },
    discount: { type: "number" },
    stock: { type: "number", minimum: 0 },
  },
  required: ["title", "price", "stock"],
  additionalProperties: false,
};

const validateProduct = new ajv().compile(productSchema);

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === "m1e") {
    next();
  } else {
    res.status(401).json({ error: "No authorization header" });
  }
};

router.get("/", async (req, res) => {
  if (req.query.minPrice && req.query.maxPrice) {
    const { minPrice, maxPrice } = req.query;
    const filteredProducts = await productManager.filterProducts(
      Number(minPrice),
      Number(maxPrice)
    );
    res.json(filteredProducts);
  } else {
    const productsList = await productManager.getProducts();
    res.json(productsList);
  }
});

router.get("/:id", async (req, res) => {
  const product = await productManager.getProductById(req.params.id);
  res.json(product);
});

router.post("/", authMiddleware, async (req, res) => {
  if (!validateProduct(req.body)) {
    return res.status(400).json({ errors: validateProduct.errors });
  }
  const product = await productManager.createProduct(req.body);
  res.json(product);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const updatedProduct = await productManager.updateProduct(
    req.params.id,
    req.body
  );
  res.json(updatedProduct);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const result = await productManager.deleteProduct(req.params.id);
  res.json(result);
});

module.exports = router;
