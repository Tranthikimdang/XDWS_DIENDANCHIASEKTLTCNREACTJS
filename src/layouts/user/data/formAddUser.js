import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';

function FormAddUser() {
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
            <label className='text-light form-label'>Name</label>
            <input
              className='form-control bg-dark text-light'
              {...register('name', { required: true, minLength: 3, maxLength: 50 })}
            />
            {errors.name && errors.name.type === 'required' && <span className='text-danger'>Name is required</span>}
            {errors.name && errors.name.type === 'minLength' && <span className='text-danger'>Name must be at least 3 characters long</span>}
            {errors.name && errors.name.type === 'maxLength' && <span className='text-danger'>Name must be less than 50 characters long</span>}
          </div>
          <div>
            <label className='text-light form-label'>Email</label>
            <input
              className='form-control bg-dark text-light'
              type='email'
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && errors.email.type === 'required' && <span className='text-danger'>Email is required</span>}
            {errors.email && errors.email.type === 'pattern' && <span className='text-danger'>Invalid email address</span>}
          </div>
          <div>
            <label className='text-light form-label'>Address</label>
            <input
              className='form-control bg-dark text-light'
              {...register('address', { required: true, minLength: 5, maxLength: 100 })}
            />
            {errors.address && errors.address.type === 'required' && <span className='text-danger'>Address is required</span>}
            {errors.address && errors.address.type === 'minLength' && <span className='text-danger'>Address must be at least 5 characters long</span>}
            {errors.address && errors.address.type === 'maxLength' && <span className='text-danger'>Address must be less than 100 characters long</span>}
          </div>
          <div>
            <label className='text-light form-label'>Phone Number</label>
            <input
              className='form-control bg-dark text-light'
              type='tel'
              {...register('phone', { required: true, pattern: /^\d{10}$/ })}
            />
            {errors.phone && errors.phone.type === 'required' && <span className='text-danger'>Phone number is required</span>}
            {errors.phone && errors.phone.type === 'pattern' && <span className='text-danger'>Invalid phone number</span>}
          </div>
          <div>
            <label className='text-light form-label'>Date of Birth</label>
            <input
              className='form-control bg-dark text-light'
              type='date'
              {...register('dob', { required: true })}
            />
            {errors.dob && errors.dob.type === 'required' && <span className='text-danger'>Date of birth is required</span>}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add User</button>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAddUser;
