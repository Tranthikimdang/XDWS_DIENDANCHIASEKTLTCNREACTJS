// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const Category = require('./categoryModel'); // Import mô hình Category

// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn('products', 'cateID', {
//       type: Sequelize.INTEGER,
//       references: {
//         model: 'categories',
//         key: 'cateId'
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL'
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeColumn('products', 'cateID');
//   }
// };

// async function getProductsByCategory(cateId) {
//     try {
//       const products = await Products.findAll({
//         where: { cateID: cateId },
//         include: [{ model: Category }]
//       });
//       return products;
//     } catch (error) {
//       console.error('Error fetching products by category:', error);
//       throw error;
//     }
//   }
  
// const Products = sequelize.define('Products', {
//   productID: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   productType: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   productName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   productImage: {
//     type: DataTypes.STRING,
//     allowNull: true 
//   },
//   productPrice: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   expiryDate: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   cateID: { // Thêm cột cateID
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'categories', // Đặt mối quan hệ với mô hình Category
//       key: 'cateId'
//     },
//     productImage: {
//       type: DataTypes.STRING,
//       allowNull: true // Allow null values
//     }
//   }
// }, {
//   tableName: 'products'
// });

// // Thiết lập mối quan hệ giữa Products và Category
// Products.belongsTo(Category, { foreignKey: 'cateID' });

// module.exports = Products;


