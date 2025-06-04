import React from 'react';
import { Link } from 'react-router-dom';

const CreateReportPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Step 1: Select or Upload a Template</h1>
        <Link to="/reports" className="btn btn-primary">
          Back to Reports
        </Link>
      </div>
      
      <div className="card">
        <p className="text-text-secondary">
          Template selection, drag-and-drop upload UI, and form for manual template creation will go here.
        </p>
        {/* Future UI for template selection/upload will be built out here */}
      </div>
    </div>
  );
};

export default CreateReportPage;