import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CertificateAPI from '../../apis/CertificateApI'; // Đảm bảo rằng bạn đã có API này
import CourseAPI from '../../apis/CourseApI'; // API để lấy dữ liệu khóa học
import PageContainer from 'src/components/container/PageContainer';
import { jsPDF } from 'jspdf';

const FriendsList = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]); // Lưu danh sách tất cả khóa học
  const [filteredCertificates, setFilteredCertificates] = useState([]); // Lưu dữ liệu khóa học
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null; // Lấy ID người dùng từ localStorage

  // Fetch dữ liệu khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseAPI.getCoursesList(); // Gọi API để lấy toàn bộ khóa học
        setCourses(response.data.courses); // Lưu tất cả khóa học vào state
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []); // Chỉ chạy một lần khi component được render lần đầu

  // Fetch all certificates và lọc theo userId
  useEffect(() => {
    const fetchCertificates = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await CertificateAPI.getCertificatesList(); // Gọi API để lấy tất cả chứng chỉ

        // Lọc chứng chỉ chỉ thuộc về userId hiện tại
        const userCertificates = response.data.certificates.filter(
          (certificate) => certificate.user_id == userId,
        );

        // Gắn tên khóa học vào từng chứng chỉ
        const updatedCertificates = userCertificates.map((certificate) => {
          const course = courses.find((course) => course.id === certificate.course_id); // Tìm khóa học theo course_id
          return {
            ...certificate,
            course_name: course ? course.name : 'Khóa học không tìm thấy', // Gắn tên khóa học vào chứng chỉ
            img: course ? course.image : 'không có ảnh', // Gắn tên khóa học vào chứng chỉ
          };
        });

        setFilteredCertificates(updatedCertificates); // Lưu chứng chỉ đã được gắn tên khóa học vào state
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userId, courses]); // Chạy lại khi `userId` hoặc `courses` thay đổi

  // Handle card click (nếu có nhu cầu điều hướng)
  const handleCardClick = (certificateId) => {
    navigate(`/certificate/${certificateId}`, { state: { id: certificateId } });
  };

  const handleDownloadCertificate = (course, user) => {
    if (!user || !course) return; // Kiểm tra dữ liệu người dùng và khóa học

    // Tạo tài liệu PDF
    const doc = new jsPDF();

    // Thêm background cho chứng chỉ
    doc.setFillColor(240, 240, 240); // Màu nền sáng
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // Vẽ hình chữ nhật nền

    // Thêm khung cho chứng chỉ
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Màu khung đen
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20); // Khung bao quanh chứng chỉ

    // Thêm logo ở giữa chứng chỉ
    const logoUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUkSURBVHgB7Z2NcdpMEIaXb1IAXweiAkMFhgpiKjCuwHEFmApsKjCuwLgClAqMK0CpwHRw2RdORAGZHyHdbqx9Zi5yzDjx7N7+3N6dtkEV4ZyL+NHlccEDX7f9RxHpJuGx9GPO4yeejUYjoQpoUImw0Lv8+M7jivQL+lSgjJjHMytjTiVxtgJY6E1+DGgt+C7VAyhgzIqY0JmcpQAW/oAfDzyaVE8SHqNzFFFIAd7VDKk+M/4QCY9ekTjxH50ICx8zfkYm/CwRjwXLZkgncrQF+KzmiUzwh0B86B9rDUcpwAsfsz4i4xgSOtIlHXRBLHzk729kwj+FiMfMy24vey3AZv7ZYDHX2WcJn1qACb8UkJ7PvCxz+dQC+IcWZMIvC5QyOnkf5FqAT6ciMsqi7dP3HXYswC+yZmRUATKjOPuNPAWY66mOhBXQyn7jLxfkazsRGVURsYzvs9/4ywJs9gcBqWmLLQHPPxZgsz8YSE1/pH/ZWIDN/qAs2QL+xxcrC/CZT0RGKJpe5hsXdE1GaLBtu3ZB5n5EWLmhRqbaaYQnggs6WDI1KqNnCpCl/Y3WB6fUEscxvb6+UpIkq7FcLqlMut0uPT09kRARFKDuSAmEPB6P6fHxsXSBbwOlCnIBBUSkCMz4m5ubYIJpt0U9cBMxQI0FjEYj6vV6QWflxYWoB25iDaCC+/t7x79Q8LFYLJwkKhTAQVBE+IPBwEkjrgDMwCiKajn7wclHE8sGfl8iExkOh8SKJ3GcMBKz//b21mlBVAHT6TS48K+vr50mRF0Qcv6QPDw80GQyIU18I0Hm89Ju+uwlLTeo8PlbiCqgKiBorHAvLy+JU01qNvVe4MF+gCNDDPE0tO6YAoQRjQH9fr+SQIwYAL9/dXW1igMag+8GJwgLKEjuj5qPhrJDHqIuKNTMRO7farVWZQ9tiCogdC2eS950d3dHqnCCfHx8OPbVwcsRGsrQKaIWkAbK0MAlYc9ZA+ILMZSiO51O5ZvveXBgFs+QxNcBEABq8xJg818cp4RQKen2QBySRM1KGNVKVC1D8/z8TJKoUQAC8mw2C+6OQu9J7OAU8vb2FmyrEv+PJKrL0ZidcBGoF1W5eSMpgn9mPwBpalWpqmQqahsywth+gDDq94QRB97f31cxoIoDXNg7xmkJKVQqIOT9AGnUKaBm9wN0xYAa3g/QsxCz+wGCvLy8iAjf7gc4ux8gHgNQarD7AYJIzH5NR9TtfoAwcEFiK53QtXi4HWX3A5ZYiEEBIue3Q94PQLlBetGVQwIFQAoRfSGwu5a9H6D4bOjKAn6RENiCrDnviAFh/ICRxxwKiMmQYp6+M+6D6tsJSYrVa4zTlbDs4Zh6EuOPVAFTMkKzmvTZN+eaGwrH5i3q2WKcjvPa9WBzVSdrAZj9CzIrqJqEMi2uNhbgX6duVlA942xXJeugEZb9HTQ8Cm4tfFl2ZLujAN9kxlxR+Yy2G/iAfX3E8EJve61xOey4npR9e8J9Wkds4zwSHr3PPmzQHty6BR8swVLTYhTvJQn8D0J7CRmnAuEfbGm71wJSnDX2PJWEyuonDDKWYJs3h4nphP7yRx/Mwj/oO4Lqe+WIHrDKPVr44CgXtI25pB3gGe7y8vxDFDqa6K0BeS1WdgnVFwRaCL5TRPigkAVs49ZtEG+pPgu3mMcrj0naE7IopSggxa1bYg14XNLXU0ZCa6FPi872PEpVQBYfJ6CELq0bBWExF5H+RV3in/Drv/wzPiWwGv8QvwHu5t44+FRvkgAAAABJRU5ErkJggg=='; // Logo
    const logoWidth = 50;
    const logoHeight = 50;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2; // Căn giữa logo
    const logoY = 50;
    doc.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Thêm tiêu đề cho giấy khen
    doc.setFont('times', 'normal');
    doc.setFontSize(22);
    doc.text('SHARE CODE', doc.internal.pageSize.width / 2, 120, { align: 'center' });

    // Thêm thông tin học viên
    doc.setFontSize(16);
    doc.text(`Name: ${user.name}`, 20, 150);
    doc.text(`Course: ${course}`, 20, 160); // Sử dụng tên khóa học từ state course
    doc.text(`Issue date: ${new Date().toLocaleDateString()}`, 20, 170);
    doc.text(`Completion rate: 100%`, 20, 180);

    // Thêm thông điệp cuối
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.text('Thank you for participating and good luck!', doc.internal.pageSize.width / 2, 220, {
      align: 'center',
    });

    // Lưu PDF
    doc.save('certificate.pdf');
  };
  return (
    <PageContainer title="Chứng chỉ | Share Code" description="Chứng chỉ">
      <Box sx={{ padding: { xs: '16px', md: '24px' } }}>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* Heading */}
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Danh sách chứng chỉ
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              Khám phá và quản lý chứng chỉ của bạn một cách dễ dàng ngay trên trang này.
              <br />
              Tất cả thông tin về chứng chỉ, khóa học, và trạng thái sẽ được hiển thị đầy đủ, giúp
              bạn theo dõi quá trình học tập và phát triển.
            </Typography>
          </Grid>
          {loading ? (
            <Grid item xs={12}>
              <Typography variant="h6">Đang tải dữ liệu...</Typography>
            </Grid>
          ) : filteredCertificates.length > 0 ? (
            filteredCertificates.map((certificate) => (
              <Grid item xs={12} sm={6} key={certificate.id}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => handleDownloadCertificate(certificate.course_name, user)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={certificate.img || 'defaultImageUrl'} // Nếu không có ảnh chứng chỉ, sử dụng ảnh mặc định
                    alt="certificate"
                  />
                  <CardContent>
                    <Typography variant="h6">{certificate.certificate_code}</Typography>{' '}
                    {/* Mã chứng chỉ */}
                    <Typography variant="body2" color="text.secondary">
                      Khóa học: {certificate.course_name} {/* Tên khóa học */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ngày cấp: {new Date(certificate.issue_date).toLocaleDateString()}{' '}
                      {/* Ngày cấp */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái:{' '}
                      {certificate.status === 'active' ? 'Đang hoạt động' : 'Đã thu hồi'}{' '}
                      {/* Trạng thái chứng chỉ */}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2">Bạn chưa có chứng chỉ nào.</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default FriendsList;
