import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from 'react-hook-form';
import api from '../../../apis/categoriesApi'; // Import API service

function FormAddCate() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  

  const onSubmit = async (data) => {
    try {
      const response = await api.addCategory(data);
      console.log('Category added successfully:', response);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className='container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className='text-light form-label'>Category name</label>
            <input className='form-control bg-dark text-light' {...register('name', { required: true, minLength: 3, maxLength: 20 })} />
            {errors.name && errors.name.type === 'required' && <span className='text-danger'>Name is required</span>}
            {errors.name && errors.name.type === 'minLength' && <span className='text-danger'>Name must be at least 3 characters long</span>}
            {errors.name && errors.name.type === 'maxLength' && <span className='text-danger'>Name must be less than 20 characters long</span>}
          </div>
          <div className='mt-3'>
            <button className='text-light btn btn-outline-info' type="submit">Add</button>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAddCate;