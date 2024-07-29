import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function FormAndArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
    // Add logic to submit data to the backend here
  };

  const smallFontStyle = { 
    fontSize: '0.9rem'
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Image URL</label>
            <input
              className={`form-control bg-dark text-light ${errors.image ? 'is-invalid' : ''}`}
              type='url'
              {...register('image', { required: true })}
              style={smallFontStyle}
            />
            {errors.image && <div className='invalid-feedback'>
              {errors.image.type === 'required' && 'Image URL is required'}
            </div>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Name</label>
            <input
              className={`form-control bg-dark text-light ${errors.name ? 'is-invalid' : ''}`}
              {...register('name', { required: true, minLength: 3, maxLength: 20 })}
              style={smallFontStyle}
            />
            {errors.name && <div className='invalid-feedback'>
              {errors.name.type === 'required' && 'Name is required'}
              {errors.name.type === 'minLength' && 'Name must be at least 3 characters long'}
              {errors.name.type === 'maxLength' && 'Name must be less than 20 characters long'}
            </div>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Email</label>
            <input
              className={`form-control bg-dark text-light ${errors.email ? 'is-invalid' : ''}`}
              type='email'
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              style={smallFontStyle}
            />
            {errors.email && <div className='invalid-feedback'>
              {errors.email.type === 'required' && 'Email is required'}
              {errors.email.type === 'pattern' && 'Invalid email address'}
            </div>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Location</label>
            <input
              className={`form-control bg-dark text-light ${errors.location ? 'is-invalid' : ''}`}
              {...register('location', { required: true, minLength: 5, maxLength: 50 })}
              style={smallFontStyle}
            />
            {errors.location && <div className='invalid-feedback'>
              {errors.location.type === 'required' && 'Location is required'}
              {errors.location.type === 'minLength' && 'Location must be at least 5 characters long'}
              {errors.location.type === 'maxLength' && 'Location must be less than 50 characters long'}
            </div>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label' style={smallFontStyle}>Phone</label>
            <input
              className={`form-control bg-dark text-light ${errors.phone ? 'is-invalid' : ''}`}
              type='tel'
              {...register('phone', { required: true, pattern: /^[0-9]{10,15}$/ })}
              style={smallFontStyle}
            />
            {errors.phone && <div className='invalid-feedback'>
              {errors.phone.type === 'required' && 'Phone number is required'}
              {errors.phone.type === 'pattern' && 'Invalid phone number'}
            </div>}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
            <Link to="/article" className='btn btn-outline-light ms-3'>Back</Link>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAndArticle;
