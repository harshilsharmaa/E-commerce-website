const Category = require('../models/Category');
const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {

        if (!req.body.name || !req.body.price || !req.body.description || !req.body.coverImage || !req.body.category) {
            return res.status(400).json({
                message: 'Please fill all the fields',
                success: false
            })
        }
        
        const categoryForNewProduct = await Category.findOne({name:req.body.category});

        if(!categoryForNewProduct){
            return res.status(400).json({
                message: 'Category not found',
                success: false
            })
        }
        
        // Creating new Product     
        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            coverImage: req.body.coverImage,
            category: categoryForNewProduct,
        });
        
        if(req.body.images){
            product.images.push(...req.body.images);
            await product.save();
        }
        
        // Adding product to category

        categoryForNewProduct.products.push(product);
        await categoryForNewProduct.save();
        console.log(4);
        
        res.status(201).json({
            message: "Product added successfully",
            product,
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

exports.updateProduct = async (req,res)=>{
    try {

        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                message: 'Product not found',
                success: false
            })
        }

        if(req.body.name){
            product.name = req.body.name;
        }
        if(req.body.price){
            product.price = req.body.price;
        }
        if(req.body.description){
            product.description = req.body.description;
        }
        if(req.body.coverImage){
            product.coverImage = req.body.coverImage;
        }
        if(req.body.category){
            product.category = req.body.category;
        }
        if(req.body.images){
            product.images.push(...req.body.images);
        }

        if(req.body.quantity){
            product.quantity = req.body.quantity;
        }
        if(req.body.availableQuantity){
            product.availableQuantity = req.body.availableQuantity;
        }
        if(req.body.colors){
            product.colors.push(...req.body.colors);
        }
        if(req.body.inStock){
            product.inStock = req.body.inStock;
        }     

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product,
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

exports.addCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({
                message: 'Please fill all the fields',
                success: false
            })
        }

        const category = await Category.find({name:req.body.name});
        if (category.length!=0) {
            return res.status(400).json({
                message: 'Category already exists',
                success: false
            })
        }

        const newCategory = await Category.create(req.body);
        res.status(201).json({
            message: "Category added successfully",
            success: true,
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

exports.deleteProduct  = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                message: 'Product not found',
                success: false
            })
        }

        // Removing product from category
        const productInCategory = await Category.findById(product.category);
        productInCategory.products.pull(product);

        // Removing product from database
        await product.remove();

        res.status(200).json({
            message: "Product deleted successfully",
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}