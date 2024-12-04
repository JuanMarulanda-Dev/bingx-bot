import { Routes, Route } from 'react-router-dom';
import { UserForm } from '../components/UserForm/UserForm';
import { MainLayout } from '../layouts/MainLayout';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<UserForm />} />
      </Route>
    </Routes>
  );
}; 