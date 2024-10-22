import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { db, storage } from '../../config/firebaseconfig';
import Logo from 'src/layouts/full/shared/logo/Logo';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import { GoogleLogin } from 'react-google-login';

const Interests = ({ subtext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);






  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        
      }}
    >
      {/* Background wrapper */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          opacity: 0.3,
          zIndex: -1,
        }}
      ></div>

      {/* Content wrapper */}

    </div>
  );
};

export default Interests;
