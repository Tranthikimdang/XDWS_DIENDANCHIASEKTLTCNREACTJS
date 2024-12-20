/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { getExercise, updateExercise } from '../../../../apis/ExerciseApi'; // Import API module

function FormEditExercise() {
  const {
    register,
    handleSubmit,
    setValue, // Dùng để gán giá trị cho các trường
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { course_id, exercise_id } = useParams(); // Lấy cả `exercise_id` từ URL
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!exercise_id) {
      setSnackbarMessage('Không tìm thấy ID bài tập.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    // Lấy danh sách bài tập và tìm bài tập theo ID
    const fetchExercise = async () => {
      try {
        const exercises = await getExercise(); // API trả về danh sách bài tập
        console.log(exercises);
        
        const exercise = exercises.data.questions.find((ex) => ex.id == exercise_id); // So sánh ID
  
        if (exercise) {
          // Gán giá trị cho các trường từ dữ liệu bài tập
          setValue('question_text', exercise.question_text);
          setValue('option_a', exercise.option_a);
          setValue('option_b', exercise.option_b);
          setValue('option_c', exercise.option_c);
          setValue('option_d', exercise.option_d);
          setValue('correct_answer', exercise.correct_answer);
          setValue('explanation', exercise.explanation);
        } else {
          setSnackbarMessage('Không tìm thấy bài tập.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài tập:', error);
        setSnackbarMessage('Lỗi khi tải danh sách bài tập.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
  
    fetchExercise();
  }, [exercise_id, setValue]);
  

  const smallFontStyle = {
    fontSize: '0.9rem',
  };

  const onSubmit = async (data) => {
    if (!exercise_id) {
      setSnackbarMessage('Không thể cập nhật bài tập vì thiếu ID.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const updatedExercise = {
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
      await updateExercise(exercise_id, updatedExercise);

      setSnackbarMessage('Cập nhật bài tập thành công.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate(`/admin/productDetail/${course_id}`), 500);
    } catch (error) {
      console.error('Lỗi khi cập nhật bài tập:', error.message);
      setSnackbarMessage('Không thể cập nhật bài tập. Vui lòng thử lại.');
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
            <label className="form-label text-white" style={smallFontStyle}>Câu hỏi</label>
            <textarea
              className={`form-control bg-dark text-light ${errors.question_text ? 'is-invalid' : ''}`}
              {...register('question_text', { required: 'Câu hỏi là bắt buộc.' })}
            />
            {errors.question_text && <span className="text-danger" style={smallFontStyle}>{errors.question_text.message}</span>}
          </div>
          {['A', 'B', 'C', 'D'].map((option) => (
            <div className="mb-3" key={option}>
              <label className="form-label text-white" style={smallFontStyle}>Lựa chọn {option}</label>
              <input
                className={`form-control bg-dark text-light ${errors[`option_${option.toLowerCase()}`] ? 'is-invalid' : ''}`}
                {...register(`option_${option.toLowerCase()}`, { required: `Lựa chọn ${option} là bắt buộc.` })}
              />
              {errors[`option_${option.toLowerCase()}`] && (
                <span className="text-danger">{errors[`option_${option.toLowerCase()}`].message}</span>
              )}
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label text-white" style={smallFontStyle}>Đáp án đúng (A, B, C, D)</label>
            <input
              className={`form-control bg-dark text-light ${errors.correct_answer ? 'is-invalid' : ''}`}
              {...register('correct_answer', {
                required: 'Đáp án đúng là bắt buộc.',
                validate: (value) => ['A', 'B', 'C', 'D'].includes(value.toUpperCase()) || 'Đáp án đúng phải là A, B, C hoặc D.',
              })}
            />
            {errors.correct_answer && <span className="text-danger" style={smallFontStyle}>{errors.correct_answer.message}</span>}
          </div>
          <div className="mb-3">
            <label className="form-label text-white" style={smallFontStyle}>Giải thích</label>
            <textarea
              className={`form-control bg-dark text-light ${errors.explanation ? 'is-invalid' : ''}`}
              {...register('explanation', { required: 'Giải thích là bắt buộc.' })}
            />
            {errors.explanation && <span className="text-danger" style={smallFontStyle}>{errors.explanation.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary mt-3" style={smallFontStyle}>
            Cập nhật bài tập
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

export default FormEditExercise;
