import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authContext } from '../context/AuthContext.jsx';
import { BASE_URL } from '../config.js';
import { HashLoader } from 'react-spinners';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      console.log(result);
      
      // Update auth state with token and user role
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.userId,
          token: result.token,
          role: result.role
        }
      });

      // Redirect based on role
      if (result.role === 'employee') {
        navigate('/home');
      } else if (result.role === 'admin') {
        navigate('/admindashboard');
      } else if (result.role === 'judge') {
        navigate('/judgedashboard');
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <section className='flex items-center justify-center min-h-screen px-5 lg:px-0 bg-blue-50'>
      <div className="w-full max-w-[570px] mx-auto bg-white rounded-lg shadow-lg p-8 md:p-10">
        <h3 className="text-blue-800 text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-blue-600">Welcome</span> Back 😊
        </h3>
        <form className='py-4 md:py-0' onSubmit={submitHandler}>
          <div className="mb-5">
            <input
              type="email"
              name="email"
              placeholder='Enter your Email'
              value={formData.email}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border border-solid border-blue-300 focus:outline-none focus:border-blue-500 text-[16px] leading-7 text-blue-900 placeholder-blue-400 rounded-md'
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              name="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border border-solid border-blue-300 focus:outline-none focus:border-blue-500 text-[16px] leading-7 text-blue-900 placeholder-blue-400 rounded-md'
              required
            />
          </div>
          <div className="mt-7">
            <button type='submit'  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
              {loading ? <HashLoader size={25} color='#fff' /> : 'Login'}
            </button>
          </div>
          <p className="mt-5 text-blue-500 text-center">
            Don&apos;t have an account? <Link to='/signup' className='text-blue-700 font-medium ml-1'>Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
