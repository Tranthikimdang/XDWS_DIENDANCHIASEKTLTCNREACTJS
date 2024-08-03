const multer = require('multer');
const path = require('path');
const Article = require('../models/articleModel'); // Đảm bảo đường dẫn đúng đến model của bạn

// Cấu hình lưu trữ tệp tin
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/uploads/')); // Đường dẫn lưu trữ tệp tin, sử dụng đường dẫn tuyệt đối
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên tệp tin với thời gian hiện tại và mở rộng của tệp
  }
});

const upload = multer({ storage: storage });

const addArticle = async (req, res) => {
  // Xử lý tệp tin với multer
  upload.single('image')(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ status: 500, error: 'Failed to upload image.' });
    }

    // Lấy các trường dữ liệu từ req.body và req.file (tệp tin)
    const { title, category, view, created_date, name, email, content } = req.body;
    const image = req.file ? `assets\\uploads\\${req.file.filename}` : null; // Đường dẫn đến tệp tin đã lưu trữ
    console.log(req.file);
    // Kiểm tra tất cả các trường cần thiết
    if (!title || !category || !view || !created_date || !name || !email || !content) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Xử lý giá trị trường
    const newArticle = {
      image,
      title,
      category,
      view,
      created_date,
      name,
      email,
      content
    };

    try {
      const article = await Article.addArticle(newArticle);
      res.status(201).json({
        data: article,
        status: 201,
        message: "Article created successfully.",
      });
    } catch (error) {
      res.status(500).json({ status: 500, error: error.message });
    }
  });
};

const getList = async (req, res) => {
  try {
    const articles = await Article.getList();
    const host = req.protocol + '://' + req.get('host'); // http://localhost:4000
    console.log(articles);

    const updatedItems = articles.map(item => {
      return {
        ...item,
        image: host + '/' + item?.image?.replace(/\\/g, '/'), // Cập nhật đường dẫn ảnh
      };
    });

    res.status(200).json({
      data: updatedItems,
      status: 200,
      message: "Success",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: 500, error: error.message });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;

  // Xử lý tệp tin với multer
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ status: 500, error: 'Failed to upload image.' });
    }

    // Xử lý dữ liệu bài viết
    const { title, category, view, created_date, name, email, content } = req.body;
    const image = req.file ? req.file.path : null; // Đường dẫn đến tệp tin đã lưu trữ nếu có

    const articleData = {
      image: image || undefined, // Cập nhật image chỉ khi có hình ảnh mới
      title,
      category,
      view,
      created_date,
      name,
      email,
      content
    };

    try {
      // Giả sử Article.updateArticle trả về số lượng bản ghi đã cập nhật
      const result = await Article.updateArticle(id, articleData);

      if (result) {
        res.status(200).json({ status: 200, message: "Article updated successfully." });
      } else {
        res.status(404).json({ status: 404, error: "Article not found." });
      }
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Failed to update article. ' + error.message });
    }
  });
};


const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Article.deleteArticle(id);
    if (deleted) {
      res.status(204).send(); // Mã trạng thái 204 không có body
    } else {
      res.status(404).json({ status: 404, error: "Article not found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

module.exports = {
  addArticle,
  getList,
  updateArticle,
  deleteArticle
};