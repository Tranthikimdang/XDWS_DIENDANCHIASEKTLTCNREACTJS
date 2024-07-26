import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';

function FormEditUser() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className='text-light form-label'>Username</label>
            <input className='form-control bg-dark text-light' {...register('name', { required: true, minLength: 3, maxLength: 20 })} />
            {errors.name && errors.name.type === 'required' && <span className='text-danger'>Name is required</span>}
            {errors.name && errors.name.type === 'minLength' && <span className='text-danger'>Name must be at least 3 characters long</span>}
            {errors.name && errors.name.type === 'maxLength' && <span className='text-danger'>Name must be less than 20 characters long</span>}
          </div>
          <div>
            <label className='text-light form-label'>Email</label>
            <input className='form-control bg-dark text-light' type='email' {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.email && errors.email.type === 'required' && <span className='text-danger'>Email is required</span>}
            {errors.email && errors.email.type === 'pattern' && <span className='text-danger'>Invalid email address</span>}
          </div>
          <div>
            <label className='text-light form-label'>Address</label>
            <input className='form-control bg-dark text-light' {...register('address', { required: true, minLength: 5, maxLength: 50 })} />
            {errors.address && errors.address.type === 'required' && <span className='text-danger'>Address is required</span>}
            {errors.address && errors.address.type === 'minLength' && <span className='text-danger'>Address must be at least 5 characters long</span>}
            {errors.address && errors.address.type === 'maxLength' && <span className='text-danger'>Address must be less than 50 characters long</span>}
          </div>
          <div>
            <label className='text-light form-label'>Description</label>
            <input className='form-control bg-dark text-light' {...register('description', { required: true, minLength: 10, maxLength: 100 })} />
            {errors.description && errors.description.type === 'required' && <span className='text-danger'>Description is required</span>}
            {errors.description && errors.description.type === 'minLength' && <span className='text-danger'>Description must be at least 10 characters long</span>}
            {errors.description && errors.description.type === 'maxLength' && <span className='text-danger'>Description must be less than 100 characters long</span>}
          </div>
          <div>
            <label className='text-light form-label'>Comment</label>
            <textarea className='form-control bg-dark text-light' {...register('comment', { required: true, minLength: 10, maxLength: 500 })}></textarea>
            {errors.comment && errors.comment.type === 'required' && <span className='text-danger'>Comment is required</span>}
            {errors.comment && errors.comment.type === 'minLength' && <span className='text-danger'>Comment must be at least 10 characters long</span>}
            {errors.comment && errors.comment.type === 'maxLength' && <span className='text-danger'>Comment must be less than 500 characters long</span>}
          </div>
          <div>
            <label className='text-light form-label'>Rating</label>
            <select className='form-control bg-dark text-light' {...register('rating', { required: true })}>
              <option value="">Select a rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
            {errors.rating && errors.rating.type === 'required' && <span className='text-danger'>Rating is required</span>}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Edit</button>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormEditUser;
