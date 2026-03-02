import express from 'express';
import { createProduct, deleteProduct, getProduct, getProductById, searchProduct, searchProducts1, updateProduct } from '../controller/productController.js';

const productRouter = express.Router();

productRouter.post('/', createProduct)
productRouter.get('/', getProduct);
productRouter.delete('/:productId', deleteProduct)
productRouter.put('/:productId', updateProduct);
productRouter.get("/search", searchProducts1)
productRouter.get("/search/:id", searchProduct)
productRouter.get("/:id", getProductById)



export default productRouter;