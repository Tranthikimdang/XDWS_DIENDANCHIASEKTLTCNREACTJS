import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';

function FormAunouncement() {
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
            <label className='text-light form-label'>Sender</label>
            <input
              className='form-control bg-dark text-light'
              {...register('sender', { required: 'Sender is required' })}
            />
            {errors.sender && <span className='text-danger'>{errors.sender.message}</span>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label'>Receiver</label>
            <input
              className='form-control bg-dark text-light'
              {...register('receiver', { required: 'Receiver is required' })}
            />
            {errors.receiver && <span className='text-danger'>{errors.receiver.message}</span>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label'>Content</label>
            <textarea
              className='form-control bg-dark text-light'
              {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Content must be at least 10 characters long' } })}
            ></textarea>
            {errors.content && <span className='text-danger'>{errors.content.message}</span>}
          </div>
          <div className='mb-3'>
            <label className='text-light form-label'>Status</label>
            <select
              className='form-control bg-dark text-light'
              {...register('status', { required: 'Status is required' })}
            >
              <option value="">Select status</option>
              <option value="đã gửi">Đã gửi</option>
              <option value="nháp">Nháp</option>
            </select>
            {errors.status && <span className='text-danger'>{errors.status.message}</span>}
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

export default FormAunouncement;
