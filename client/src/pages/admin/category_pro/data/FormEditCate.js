import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useForm } from 'react-hook-form';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import api from "../../../../apis/Categories_courseApi"; // Adjust the import path as necessary

function FormEditCate() {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { setError } = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '', // Default value
    },
  });

  // Fetch current category and all categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Get current category
        const categoryResponse = await api.getList(); // Get all categories
        setCategories(categoryResponse); // Save categories to state

        // Find and set current category by ID
        const currentCategory = categoryResponse.find(category => category.id === parseInt(id));
        if (currentCategory) {
          setValue('name', currentCategory.name); // Set data to form
        } else {
          console.log('Category does not exist');
          navigate('/admin/categorypro'); // Redirect if category not found
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        navigate('/admin/categorypro');
      }
    };

    fetchCategory();
  }, [id, setValue, navigate]);

  // Handle form submit
  const onSubmit = async (formData) => {
    setLoading(true);

    // Check if category name already exists, excluding the current one
    const isNameExists = categories.some(
      (category) =>
        category.name.toLowerCase() === formData.name.toLowerCase() && category.id !== parseInt(id),
    );

    if (isNameExists) {
      setError('name', { type: 'manual', message: 'Category name already exists.' });
      setSnackbarMessage('Category name already exists.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Update category
      await api.updateCategory(id, {
        name: formData.name,
        updated_at: new Date(),
      });

      setSnackbarMessage('Category updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/admin/categorypro'), 500);
    } catch (error) {
      console.error('Error updating category:', error);
      setSnackbarMessage('Failed to update category. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="text-light form-label">
              Category Name
            </label>
            <input
              className="form-control bg-dark text-light"
              type="text"
              id="name"
              {...register('name', { required: true, minLength: 3, maxLength: 20 })}
              disabled={loading} // Disable input when processing
            />
            {errors.name && errors.name.type === 'required' && (
              <span className="text-danger">Category name is required</span>
            )}
            {errors.name && errors.name.type === 'minLength' && (
              <span className="text-danger">Name must be at least 3 characters long</span>
            )}
            {errors.name && errors.name.type === 'maxLength' && (
              <span className="text-danger">Name must be less than 20 characters</span>
            )}
          </div>

          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Edit'}
            </button>
            <Link to="/admin/categorypro" className="btn btn-outline-light ms-3">
              Back
            </Link>
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FormEditCate;