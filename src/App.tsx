import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Scheduling from './pages/Scheduling';
import GoalWriting from './pages/GoalWriting';
import ReportDrafting from './pages/ReportDrafting';
import StudentDashboard from './pages/StudentDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="scheduling" element={<Scheduling />} />
        <Route path="goals" element={<GoalWriting />} />
        <Route path="reports" element={<ReportDrafting />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;