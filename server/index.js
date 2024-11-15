const express = require("express");
const bodyParser = require("body-parser");
const categoriesCourseRoutes = require("./routes/categories_courseRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseDetailRoutes = require("./routes/courseDetailRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require('./routes/orderRoutes');
const hashtagRouter = require('./routes/hashtagRoutes')
const mentorRouter = require('./routes/mentorRoutes');
const questionRouter = require('./routes/questionRoutes');
const studyTimeRouter = require('./routes/studyRoutes'); 

const sequelize = require("./models"); // Kết nối Sequelize
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Cấu hình body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Đảm bảo thư mục `uploads` tồn tại
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình multer cho việc upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Lưu vào thư mục uploads
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`; // Tạo tên tệp với timestamp
    cb(null, filename); // Đặt tên tệp
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static(uploadDir)); // Tạo đường dẫn tĩnh cho uploads

// Endpoint upload ảnh
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    // Trả về đường dẫn của ảnh
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

app.post('/api/upload-file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      message: 'Không có tệp nào được tải lên.'
    });
  }

  res.status(200).send({
    fileUrl: `/uploads/${req.file.filename}`
  });
});



// Sử dụng routes cho các API khác
app.use("/api/categories_course", categoriesCourseRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-details", courseDetailRoutes);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/hashtags", hashtagRouter);
app.use("/api", mentorRouter);
app.use("/api/questions", questionRouter);
app.use("/api/study-times", studyTimeRouter);

// Khởi chạy server
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
