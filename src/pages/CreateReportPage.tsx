import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';

const CreateReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedTemplateId = searchParams.get('template');
  const currentAction = searchParams.get('action');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Create New Report</h1>
        <Link to="/reports" className="btn btn-primary">
          Back to Reports
        </Link>
      </div>
      
      <div className="card">
        {currentAction === 'upload' ? (
          <>
            <h2 className="text-xl font-medium mb-4">Upload Your Report Template</h2>
            <label htmlFor="template-upload" className="block">
              <div className="p-10 border-2 border-dashed border-border rounded-md text-center hover:border-gold transition-all cursor-pointer bg-bg-secondary hover:bg-opacity-30">
                <UploadCloud size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="font-medium text-text-primary mb-1">Drag & drop your template file here</p>
                <p className="text-sm text-text-secondary mb-4">(.docx, .pdf, or .txt files)</p>
                <input
                  type="file"
                  id="template-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".docx,.pdf,.txt"
                />
                <span className="mt-4 inline-block btn btn-primary">
                  Or Click to Browse
                </span>
              </div>
            </label>
            {selectedFile && (
              <div className="mt-4 p-3 bg-bg-primary border border-border rounded-md">
                <p className="text-sm font-medium text-text-primary">Selected file: {selectedFile.name}</p>
                <p className="text-xs text-text-secondary">Type: {selectedFile.type || 'application/octet-stream'}, Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </>
        ) : selectedTemplateId ? (
          <>
            <h2 className="text-xl font-medium mb-4">Selected Template</h2>
            <p className="mb-2">You have selected template ID: {selectedTemplateId}.</p>
            <p className="text-text-secondary">(Next step: Input/Upload Scores - UI coming soon)</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-medium mb-4">Step 1: Choose a Template</h2>
            <p className="text-text-secondary mb-4">(UI to list and select existing templates will go here. For now, please go back and select a template or choose to upload.)</p>
            <Link to="/reports" className="btn btn-primary mt-4">Back to Report Drafting</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReportPage;