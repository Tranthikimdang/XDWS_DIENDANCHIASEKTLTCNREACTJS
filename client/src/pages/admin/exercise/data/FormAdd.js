/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { addExercise } from '../../../../apis/ExerciseApi'; // Import API module của bạn

function FormAddExercise() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { course_id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!course_id) {
      setSnackbarMessage('Không thể lấy ID khóa học từ URL.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [course_id]);

  const smallFontStyle = {
    fontSize: '0.9rem',
  };

  const onSubmit = async (data) => {
    if (!course_id) {
      setSnackbarMessage('Không thể thêm bài tập vì thiếu ID khóa học.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const exerciseData = {
      course_id,
      question_text: data.question_text,
      option_a: data.option_a,
      option_b: data.option_b,
      option_c: data.option_c,
      option_d: data.option_d,
      correct_answer: data.correct_answer,
      explanation: data.explanation,
    };

    try {
      await addExercise(exerciseData);

      setSnackbarMessage('Thêm bài tập thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate(`/admin/productDetail/${course_id}`), 500);
    } catch (error) {
      console.error('Lỗi khi thêm bài tập:', error.message);
      setSnackbarMessage('Không thể thêm bài tập. Vui lòng thử lại.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-white"  style={smallFontStyle}>Câu hỏi</label>
            <textarea
              className={`form-control bg-dark text-light ${errors.question_text ? 'is-invalid' : ''}`}
              {...register('question_text', { required: 'Câu hỏi là bắt buộc.' })}
            />
            {errors.question_text && <span className="text-danger"  style={smallFontStyle}>{errors.question_text.message}</span>}
          </div>
          {['A', 'B', 'C', 'D'].map((option) => (
            <div className="mb-3" key={option}>
              <label className="form-label text-white" style={smallFontStyle}>Lựa chọn {option}</label>
              <input
                className={`form-control bg-dark text-light ${errors[`option_${option.toLowerCase()}`] ? 'is-invalid' : ''}`}
                {...register(`option_${option.toLowerCase()}`, { required: `Lựa chọn ${option} là bắt buộc.` })}
              />
              {errors[`option_${option.toLowerCase()}`] && (
                <span className="text-danger ">{errors[`option_${option.toLowerCase()}`].message}</span>
              )}
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label text-white" style={smallFontStyle}>Đáp án đúng (A, B, C, D)</label>
            <input
              className={`form-control bg-dark text-light ${errors.correct_answer ? 'is-invalid' : ''}`}
              {...register('correct_answer', {
                required: 'Đáp án đúng là bắt buộc.',
                validate: (value) => ['a', 'b', 'b', 'b'].includes(value) || 'Đáp án đúng phải là A, B, C hoặc D.',
              })}
            />
            {errors.correct_answer && <span className="text-danger"  style={smallFontStyle}>{errors.correct_answer.message}</span>}
          </div>
          <div className="mb-3">
            <label className="form-label text-white" style={smallFontStyle}>Giải thích</label>
            <textarea
              className={`form-control bg-dark text-light ${errors.explanation ? 'is-invalid' : ''}`}
              {...register('explanation', { required: 'Giải thích là bắt buộc.' })}
            />
            {errors.explanation && <span className="text-danger"  style={smallFontStyle}>{errors.explanation.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary mt-3" style={smallFontStyle}>
            Thêm bài tập
          </button>
        </form>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </DashboardLayout>
  );
}

export default FormAddExercise;
