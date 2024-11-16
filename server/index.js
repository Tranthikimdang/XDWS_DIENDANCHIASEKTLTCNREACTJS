const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const categoriesCourseRoutes = require("./routes/categories_courseRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseDetailRoutes = require("./routes/courseDetailRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRouter = require("./routes/userRoutes");
const sequelize = require("./models"); // Kết nối Sequelize

const app = express();
const port = 3000;

//  Cấu hình body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Đảm bảo thư mục `uploads` tồn tại
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình multer cho việc upload
app.use("/uploads", express.static(uploadDir));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);  // Accept image files
  } else {
    cb(new Error('Invalid file type'), false);  // Reject non-image files
  }
};

// Set up Multer with the storage configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
});

// Upload endpoint for single image field
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  console.log(req.file);
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

// Upload endpoint for single file field (separate from the image)
app.post("/api/upload-file", upload.single("file"), (req, res) => {
  console.log(req.file);
  if (req.file) {
    const filePath = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.status(200).json({
      status: 200,
      message: "File uploaded successfully!",
      filePath: filePath,
    });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

// Sử dụng routes cho các API khác
app.use("/api/categories_course", categoriesCourseRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-details", courseDetailRoutes);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRoutes); 

// Khởi chạy server
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
