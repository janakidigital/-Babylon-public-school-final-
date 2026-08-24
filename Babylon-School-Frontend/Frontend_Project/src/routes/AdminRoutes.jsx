import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../admin/AdminPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<AdminPage />} />
    </Routes>
  );
}
