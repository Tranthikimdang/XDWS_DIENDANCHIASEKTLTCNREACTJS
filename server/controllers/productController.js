// const { Products } = require('../models');

// exports.getAllProduct = async (req, res) => {
//     try {
//         const products = await Products.findAll();
//         res.status(200).json({
//             status: 'success',
//             results: products.length,
//             data: {
//                 products
//             }
//         });
//     } catch (err) {
//         res.status(500).send({
//             status: 'error',
//             message: err.message || 'Some error occurred while retrieving products.'
//         });
//     }

// };


// exports.createProduct = async (req, res) => {
//     try {
//         const { productType, productName, productImage, productPrice, expiryDate, quantity } = req.body;
//         const newProduct = await Products.create({
//             productType, productName, productImage ,productPrice, expiryDate, quantity
//         });
//         console.log(newProduct);
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 product: newProduct
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({
//             status: 'error',
//             message: err.message || 'Some error occurred while creating the product.'
//         });
//     }
// };

// exports.updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { productType, productName, productPrice, productImage ,expiryDate, quantity } = req.body;


//         const product = await Products.findByPk(id);

//         if (!product) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Không tìm thấy sản phẩm"
//             });
//         }
//         product.productType = productType;
//         product.productName = productName;
//         product.productImage = productImage;
//         product.productPrice = productPrice;
//         product.expiryDate = expiryDate;
//         product.quantity = quantity;

//         await product.save();
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 product
//             }
//         });
//     } catch (err) {
//         console.error("lỗi khi cập nhâtj sản phẩm", err);
//         res.status(500).send({
//             status: 'error',
//             message: err.message || 'Some error occurred while updating the product.'
//         });
//     }
// }

// exports.deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Products.findByPk(id);
//         if (!product) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Không tìm thấy sản phẩm"
//             });
//         }
//         await product.destroy();
//         res.status(204).json({
//             status: 'success',
//             data: null
//         });
//     } catch (err) {
//         console.error("lỗi khi xóa sản phẩm", err);
//         res.status(500).send({
//             status: 'error',
//             message: err.message || 'Some error occurred while deleting the product.'
//         });
//     }
// }
