import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function FormEditCmt() {
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
            <label className='text-light form-label'>Author</label>
            <input className='form-control bg-dark text-light' {...register('author', { required: true, minLength: 3, maxLength: 20 })} />
            {errors.author && <span className='text-danger'>{errors.author.type === 'required' ? 'Author is required' : errors.author.type === 'minLength' ? 'Name must be at least 3 characters long' : 'Name must be less than 20 characters long'}</span>}
          </div>
          <div>
            <label className='text-light form-label'>Function</label>
            <input className='form-control bg-dark text-light' {...register('function', { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.function && <span className='text-danger'>{errors.function.type === 'required' ? 'Functionil is required' : 'Invalid Function address'}</span>}
          </div>         
          <div>
            <label className='text-light form-label'>Description</label>
            <input className='form-control bg-dark text-light' {...register('description', { required: true, minLength: 10, maxLength: 100 })} />
            {errors.description && <span className='text-danger'>{errors.description.type === 'required' ? 'Description is required' : errors.description.type === 'minLength' ? 'Description must be at least 10 characters long' : 'Description must be less than 100 characters long'}</span>}
          </div>  
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Edit</button>
            <Link to="/comment">
              <button className='text-light btn btn-outline-warning' type="submit" >Cancel</button>
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormEditCmt;
