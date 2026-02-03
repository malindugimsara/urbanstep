import Product from "../modules/product.js";

export const createProduct = async (req, res) => {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to create a product"
        });
        return;
    }
    try {
        // get all jobs
        const product = await Product.find();

        let highestNumber = 0;

        product.forEach(product => {
            if (product.productId && product.productId.startsWith("P")) {
                const numberPart = parseInt(product.productId.substring(1));
                if (!isNaN(numberPart) && numberPart > highestNumber) {
                    highestNumber = numberPart;
                }
            }
        });

        const nextNumber = highestNumber + 1;
        const productId = `P${nextNumber.toString().padStart(3, "0")}`;

        const productDoc = new Product({
            productId,
            name: req.body.name,
            altName: req.body.altName || [],
            price: req.body.price,
            lablePrice: req.body.lablePrice,
            description: req.body.description,
            stock: req.body.stock,
            images: req.body.images || [],
        });

        await productDoc.save();
        res.status(201).json(productDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product" });
    }
}

export function getProduct(req, res){
    Product.find(). then(
        (product)=>{
            res.json(product)
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "Product not found"
            })
        }
    )
}

export function deleteProduct(req, res){
    if (req.user== null){
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to delete a product"
        });
        return;
    }

    Product.findOneAndDelete({
        productId: req.params.productId
    })
    .then(() => {
        res.json({
            message: "Product deleted successfully"
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting product",
            error: err.message
        });
    });
}

export function updateProduct(req, res){
    if (req.user== null){
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to update a product"
        });
        return;
    }

    Product.findOneAndUpdate(
        { productId: req.params.productId },
        req.body)
    .then((product) => {
        res.json({
            message: "Product updated successfully",
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error updating product",
            error: err.message
        });
    });
}

export async function getProductById(req, res){
    const productId = req.params.id;
    console.log(productId);
    const product = await Product.findOne({productId : productId})
    if (product == null){
        res.status(404).json({
            message: "Product not found"
        });
        return;
    }
    res.json({
        product : product
    });
}

export async function searchProduct(req, res){
    const search = req.params.id;
    try{
        const products = await Product.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { altName: { $regex: search, $options: 'i' } }
            ]
        });
        res.json({
            products: products
        });
    }
    catch(err){
        res.status(500).json({
            message: "Error searching products",
            error: err.message
        });
    }
}