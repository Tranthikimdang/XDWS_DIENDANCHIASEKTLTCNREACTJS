// index.js
const express = require("express");
const bodyParser = require("body-parser");
const categoriesCourseRoutes = require("./routes/categories_courseRoutes"); // Import route cho categories_course
const sequelize = require("./models"); // Kết nối sequelize

const cors = require("cors");
const app = express();
const port = 3000;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Cấu hình multer cho việc upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu trữ tệp
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Đặt tên tệp
  },
});

const upload = multer({ storage: storage });
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sử dụng routes
app.use("/api/categories_course", categoriesCourseRoutes);

// Endpoint upload ảnh
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    const imagePath = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.status(201).json({
      status: 201,
      message: "Tải lên thành công!",
      imagePath: imagePath,
    });
  } else {
    res.status(400).json({ message: "Tải lên thất bại!" });
  }
});

// Khởi chạy server
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
