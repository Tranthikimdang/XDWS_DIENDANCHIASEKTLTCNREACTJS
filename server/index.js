const express = require("express");
const bodyParser = require("body-parser");

const categoriesCourseRoutes = require("./routes/categories_courseRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseDetailRoutes = require("./routes/courseDetailRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const hashtagRouter = require("./routes/hashtagRoutes");
const mentorRouter = require("./routes/mentorRoutes");
const questionRouter = require("./routes/questionRoutes");
const studyTimeRouter = require("./routes/studyRoutes");
const exerciseRouter = require("./routes/exerciseRoutes");
const commentRoutes = require("./routes/commentRoutes");
const commentCourseRoutes = require("./routes/commentCourseRoutes");
const questionHashtagsRouter = require("./routes/QuestionHashtagsRoutes");
const followRouter = require('./routes/followRoutes'); 
const notificationRouter = require('./routes/notificationRoutes');
const certificateRouter = require('./routes/certificateRoutes');

const cartsRoutes = require('./routes/cartsRoutes');
const sequelize = require("./models"); // Kết nối Sequelize
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const uploadPath = path.join(__dirname, "videos");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Gửi thông báo mới khi có thay đổi
  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Phát thông báo mới đến tất cả client
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'new_notification', content: 'You have a new notification!' }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
}

// Cấu hình body-parser middleware
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

app.post("/api/upload-file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      message: "Không có tệp nào được tải lên.",
    });
  }

  res.status(200).send({
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

app.post("/api/uploads", upload.array("image", 10), (req, res) => {
  if (req.files) {
    const imagePaths = req.files.map(file => `http://localhost:${port}/uploads/${file.filename}`);
    res.status(201).json({
      status: 201,
      message: "Tải lên thành công!",
      imagePaths: imagePaths,
    });
  } else {
    res.status(400).json({ message: "Tải lên thất bại!" });
  }
});


app.post("/api/upload-files", upload.array("file", 10), (req, res) => {
  if (req.files) {
    const filePaths = req.files.map(file => `http://localhost:${port}/uploads/${file.filename}`);
    res.status(200).json({
      status: 200,
      message: "Files uploaded successfully!",
      filePaths: filePaths,
    });
  } else {
    res.status(400).json({ message: "No files uploaded" });
  }
});


// Sử dụng routes cho các API khác
app.use("/api/categories_course", categoriesCourseRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-details", courseDetailRoutes);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRoutes);
app.use("/api/commentCourse", commentCourseRoutes);
app.use("/api/questionHashtags", questionHashtagsRouter);
app.use('/api/carts', cartsRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/hashtags", hashtagRouter);
app.use("/api/questions", questionRouter);
app.use("/api/study-times", studyTimeRouter);   // Sử dụng mentor routes
app.use("/api/exercise", exerciseRouter);
app.use("/api/follows", followRouter);
app.use("/api/mentors", mentorRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/certificates", certificateRouter);
// Khởi chạy server
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
