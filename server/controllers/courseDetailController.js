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
  const videoFile = req.file; // Lấy file video từ request

  if (!detailId) {
    return res.status(400).json({
      status: "error",
      message: "Detail ID is required.",
    });
  }

  try {
    // Nếu có video mới, tải lên Vimeo
    let embedUrl = video; // Giữ nguyên URL nếu video đã có

    if (videoFile) {
      const filePath = videoFile.path;

      // Tải video lên Vimeo
      await new Promise((resolve, reject) => {
        vimeoClient.upload(
          filePath,
          {
            name: name || "Updated Video",
            description: `Updated video for course detail ID: ${detailId}`,
          },
          async (uri) => {
            console.log(`Video uploaded successfully: ${uri}`);
            const videoId = uri.split("/").pop();
            embedUrl = `https://player.vimeo.com/video/${videoId}`;

            try {
              // Cập nhật quyền riêng tư của video thành public
              await vimeoClient.request({
                method: "PATCH",
                path: `/videos/${videoId}`,
                body: {
                  privacy: {
                    view: "anybody", // Cho phép tất cả mọi người xem video
                  },
                },
              });
              console.log("Video privacy updated to public.");
              // Xóa file tạm sau khi upload
              fs.unlinkSync(filePath);
              resolve();
            } catch (privacyError) {
              console.error("Error updating video privacy:", privacyError);
              reject(privacyError);
            }
          },
          (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(`Upload progress: ${percentage}%`);
          },
          (error) => {
            console.error("Error uploading video:", error);
            reject(error);
          }
        );
      });
    }

    // Tạo đối tượng cập nhật
    const updatedFields = {
      course_id,
      name,
      no,
      ...(embedUrl && { video: embedUrl }), // Nếu có video mới, thêm vào đối tượng cập nhật
      updated_at, // Cập nhật ngày
    };

    // Cập nhật vào cơ sở dữ liệu
    const [rowsUpdated] = await CourseDetail.update(updatedFields, {
      where: { id: detailId },
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({
        status: "error",
        message: "Course detail not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course detail updated successfully.",
    });
  } catch (err) {
    console.error("Error updating course detail:", err);
    res.status(500).send({
      status: "error",
      message: err.message || "An error occurred while updating the course detail.",
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
