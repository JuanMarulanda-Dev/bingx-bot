import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useAppDispatch } from '../../../store/hooks/redux';
import { createUser } from '../../../store/slices/userSlice';

interface UserFormData {
  name: string;
  email: string;
}

export const UserForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();
  const dispatch = useAppDispatch();

  const onSubmit = (data: UserFormData) => {
    dispatch(createUser(data));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Registration
      </Typography>
      
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        {...register('name', { required: 'Name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <Button 
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};