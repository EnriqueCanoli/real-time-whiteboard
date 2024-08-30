import React from 'react';
import { loginSchema } from './validationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './Auth.css';  
import { useDispatch } from 'react-redux';
import { loginFailure, loginSuccess } from '../../contexts/auth/authSlice';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

//defines the shape of the form data. the form will have 2 fields
interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    /**
     * useForm initializes the form
     * resolver: yupResolver(loginSchema) this connexts the from with the yup validation shcema
     * register: a function provided by useForm that registers the form fields and links them to the form state
     * formState: { errors } : an object containing the validation errors
     */
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await axiosInstance.post('/auth/login', data);
            dispatch(loginSuccess({ user: response.data.user }));
            console.log('Login successful:', response.data );
            navigate('/home')
        } catch (error) {
            dispatch(loginFailure('Login failed. Please check your credentials.'));
            console.error('Login failed:', error);
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div>
                    <label>Email</label>
                    <input {...register('email')} type="email" />
                    <p>{errors.email?.message}</p>
                </div>
                <div>
                    <label>Password</label>
                    <input {...register('password')} type="password" />
                    <p>{errors.password?.message}</p>
                </div>
            </div>
            <button type='submit'>Login</button>

        </form>
    )
}

export default LoginForm;