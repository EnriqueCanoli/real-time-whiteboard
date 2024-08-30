import * as yup from 'yup';

//creates a yup schema that expects an objet and shape() is a method that defines the structure og the object and the validation rules for each field
export const loginSchema = yup.object().shape({
    /**
     * yup.string() -> it should be a string
     * .email('Invalid email format') -> this adds a validation rutle 
     */
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required') 
})

export const signupSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),

})