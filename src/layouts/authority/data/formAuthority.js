import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';

function FormAuthority() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3'>
            <label className='text-light form-label'>Project Name</label>
            <input
              className='form-control bg-dark text-light'
              {...register('name', { required: 'Project Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters long' }, maxLength: { value: 50, message: 'Name must be less than 50 characters long' } })}
            />
            {errors.name && <span className='text-danger'>{errors.name.message}</span>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label'>Assigned Role</label>
            <input
              className='form-control bg-dark text-light'
              {...register('assigned', { required: 'Assigned Role is required', minLength: { value: 5, message: 'Role must be at least 5 characters long' }, maxLength: { value: 50, message: 'Role must be less than 50 characters long' } })}
            />
            {errors.assigned && <span className='text-danger'>{errors.assigned.message}</span>}
          </div>

          <div className='mb-3'>
            <label className='text-light form-label'>Created Date</label>
            <input
              className='form-control bg-dark text-light'
              type='date'
              {...register('created_date', { required: 'Created Date is required' })}
            />
            {errors.created_date && <span className='text-danger'>{errors.created_date.message}</span>}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Submit</button>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAuthority;
