import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from './validationSchemas';
import './Auth.css';  
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginFailure, loginSuccess } from '../../contexts/auth/authSlice';
import axiosInstance from '../../utils/axiosInstance';


interface SignupFormInputs {
    name: string;
    email: string;
    password: string;
}

const SignupForm: React.FC = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
        resolver: yupResolver(signupSchema)
    })

    const dispatch = useDispatch();

    const onSubmit = async (data: SignupFormInputs) => {
        try {
            console.log(data)
            const response = await axiosInstance.post('/auth/signup', data);
            dispatch(loginSuccess({ user: response.data }));
            console.log('Signup successful:', response.data);
        } catch (error) {
            dispatch(loginFailure('Signup failed. Please try again.'));
            console.error('Signup failed:', error);
        }
    }
    

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Name</label>
                <input {...register('name')} type='text' />
                <p>{errors.name?.message}</p>
            </div>
            <div>
                <label>Email</label>
                <input {...register('email')} type='email' />
                <p>{errors.email?.message}</p>
            </div>
            <div>
                <label>Password</label>
                <input {...register('password')} type='password' />
                <p>{errors.password?.message}</p>
            </div>
            <button type='submit'>Sign up</button>
        </form>
    )
}

export default SignupForm;