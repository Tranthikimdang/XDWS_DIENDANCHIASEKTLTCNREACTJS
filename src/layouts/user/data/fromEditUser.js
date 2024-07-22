import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom'; // To get the user ID from the URL

function FormEditUser() {
  const { id } = useParams(); // Assuming the user ID is passed in the URL
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      // Replace with actual API call
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUserData(data);

      // Prepopulate form fields with fetched data
      setValue('name', data.name);
      setValue('email', data.email);
      setValue('address', data.address);
      setValue('phone', data.phone);
      setValue('dob', data.dob);
    };

    fetchUserData();
  }, [id, setValue]);

  const onSubmit = data => {
    console.log(data);
    // Handle form submission to update user data
    // Replace with actual API call
    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(updatedData => {
        console.log('User updated:', updatedData);
        // Handle post-update actions (e.g., redirect, show a success message)
      })
      .catch(error => {
        console.error('Error updating user:', error);
        // Handle error (e.g., show an error message)
      });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

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
            <button className='text-light btn btn-outline-info' type="submit">Update User</button>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormEditUser;
