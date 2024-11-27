const multer = require('multer');
// Đảm bảo thư mục tồn tại trước khi lưu file

// Cấu hình Multer để chỉ cho phép file video
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'videos/'); // Đặt thư mục lưu file tạm thời
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Tên file được đặt là timestamp + tên gốc
  }
});

const fileFilter = (req, file, cb) => {
  // Kiểm tra loại file, chỉ cho phép các file video
  console.log(file);
  
  if (file.mimetype.startsWith('video/')) {
    cb(null, true); // Chấp nhận file video
  } else {
    cb(new Error('Only video files are allowed'), false); // Lỗi nếu không phải file video
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

module.exports = upload;