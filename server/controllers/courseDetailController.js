const CourseDetail = require("../models/courseDetailModel");
const { Vimeo } = require("@vimeo/vimeo");
const fs = require("fs");

// Lấy thông tin từ .env
const CLIENT_ID = process.env.VIMEO_CLIENT_ID;
const CLIENT_SECRET = process.env.VIMEO_CLIENT_SECRET;
const ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

// Tạo client Vimeo

const vimeoClient = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

// Lấy danh sách chi tiết khóa học
exports.getAllCourseDetails = async (req, res) => {
  try {
    const courseDetails = await CourseDetail.findAll();
    res.status(200).json({
      status: "success",
      results: courseDetails.length,
      data: { courseDetails },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while retrieving course details.",
    });
  }
};

// Tạo chi tiết khóa học và tải video lên Vimeo
exports.createCourseDetail = async (req, res) => {
    const { course_id, name, no } = req.body;
    const videoFile = req.file;
  
    if (!course_id || !videoFile) {
      return res.status(400).json({
        status: "error",
        message: "course_id and video file are required.",
      });
    }
  
    try {
      const filePath = videoFile.path;
      // Tải video lên Vimeo
      vimeoClient.upload(
        filePath,
        {
          name: name || "Untitled Video",
          description: `Video for course ID: ${course_id}`,
        },
        async (uri) => {
          console.log(`Video uploaded successfully: ${uri}`);
          const videoId = uri.split("/").pop();
          const embedUrl = `https://player.vimeo.com/video/${videoId}`;
  
          // Cập nhật quyền riêng tư của video thành public
          try {
            await vimeoClient.request(
              {
                method: "PATCH",
                path: `/videos/${videoId}`,
                body: {
                  privacy: {
                    view: "anybody", // Cho phép tất cả mọi người xem video
                  }
                }
              }
            );
            console.log("Video privacy updated to public.");
  
            // Lấy thông tin chi tiết video
            vimeoClient.request(
              {
                method: "GET",
                path: uri,
              },
              async (error, body) => {
                if (error) {
                  console.error("Error fetching video details:", error);
                  return res.status(500).json({
                    status: "error",
                    message: "Error fetching video details.",
                  });
                }
  
                // Lưu thông tin video vào cơ sở dữ liệu
                const newCourseDetail = await CourseDetail.create({
                  course_id,
                  name,
                  no,
                  video: embedUrl, // URL phát video từ Vimeo
                });
  
                // Xóa file tạm sau khi upload
                fs.unlinkSync(filePath);
  
                res.status(201).json({
                  status: "success",
                  data: { courseDetail: newCourseDetail },
                });
              }
            );
          } catch (privacyError) {
            console.error("Error updating video privacy:", privacyError);
            res.status(500).json({
              status: "error",
              message: "Error updating video privacy.",
            });
          }
        },
        (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Upload progress: ${percentage}%`);
        },
        (error) => {
          console.error("Error uploading video:", error);
          res.status(500).json({
            status: "error",
            message: "Error uploading video to Vimeo.",
          });
        }
      );
    } catch (err) {
      res.status(500).send({
        status: "error",
        message:
          err.message ||
          "Some error occurred while uploading the video and creating the course detail.",
      });
    }
  };

// Cập nhật thông tin chi tiết khóa học
exports.updateCourseDetail = async (req, res) => {
  const { course_id, name, no, video, updated_at } = req.body;
  const detailId = req.params.id; // Lấy ID từ params

  if (!detailId) {
    return res.status(400).json({
      status: "error",
      message: "Detail ID is required.",
    });
  }

  try {
    // Giữ URL video nếu có, nếu không có video mới, giữ video cũ
    let embedUrl = video || ''; // video là URL từ frontend

    // Cập nhật chi tiết khóa học trong cơ sở dữ liệu
    const updatedCourseDetail = {
      course_id,
      name,
      no,
      video: embedUrl,
      updated_at,
    };

    // Tiến hành cập nhật dữ liệu vào cơ sở dữ liệu
    const result = await CourseDetail.update(updatedCourseDetail, {
      where: { id: detailId },
    });

    if (result[0] > 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Course detail updated successfully.',
      });
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'Course detail not found.',
      });
    }
  } catch (error) {
    console.error('Error updating course detail:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the course detail.',
    });
  }
};


// Xóa thông tin chi tiết khóa học
exports.deleteCourseDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const courseDetail = await CourseDetail.findByPk(id);
    if (!courseDetail) {
      return res.status(404).json({
        status: "error",
        message: "Course detail not found",
      });
    }
    await courseDetail.destroy();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while deleting the course detail.",
    });
  }
};

// Lấy tiến trình khóa học
exports.getCourseProgress = async (req, res) => {
  const { course_id } = req.params;
  try {
    const progress = await CourseDetail.findAll({
      where: { course_id },
      attributes: ["id", "name", "video", "no", "watched_time"],
    });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lộ trình học.", error });
  }
};

// Cập nhật thời gian xem
exports.updateWatchedTime = async (req, res) => {
  const { id } = req.params;
  const { watched_time } = req.body;

  try {
    const courseDetail = await CourseDetail.findByPk(id);

    if (!courseDetail) {
      return res.status(404).json({ message: "Không tìm thấy video." });
    }

    await courseDetail.update({ watched_time });
    res.status(200).json({ message: "Cập nhật thời gian xem thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật thời gian xem.", error });
  }
};
