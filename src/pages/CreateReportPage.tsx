import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';

const CreateReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedTemplateId = searchParams.get('template');
  const currentAction = searchParams.get('action');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const availableTemplates = [
    { id: 'progress', name: 'Progress Report', description: 'Quarterly update on student goals and progress.' },
    { id: 'present-levels', name: 'Present Levels', description: 'Detailed summary of academic and functional performance.' },
    { id: 'behavior', name: 'Behavior Intervention Plan', description: 'Plan to address and support specific student behaviors.' },
  ];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCurrentStep(1);
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
        {currentStep === 1 && (
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
                  <div className="mt-4 text-right">
                    <button 
                      onClick={() => setSelectedFile(null)} 
                      className="btn border border-border hover:bg-bg-secondary mr-2"
                    >
                      Clear Selection
                    </button>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="btn bg-accent-gold text-black"
                    >
                      Use this File & Continue
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : selectedTemplateId ? (
            <>
              <h2 className="text-xl font-medium mb-4">Selected Template</h2>
              <p className="mb-2">You have selected template ID: {selectedTemplateId}.</p>
              <p className="text-text-secondary">(Next step: Input/Upload Scores - UI coming soon)</p>
              <div className="mt-6 text-right">
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn bg-accent-gold text-black"
                >
                  Continue with this Template
                </button>
              </div>
            </>
          ) : (
            <>
            <h2 className="text-xl font-medium mb-6">Step 1: Choose an Existing Template</h2>
            <div className="space-y-4">
              {availableTemplates.map((template) => (
                <div
                  key={template.id}
                  className="w-full text-left p-4 border border-border rounded-md transition-all hover:border-gold hover:bg-gold hover:bg-opacity-10 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="text-gold mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-text-secondary line-clamp-2">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-auto pt-2">
                    <Link
                      to={`?template=${template.id}`}
                      className="btn-sm bg-accent-gold text-black hover:bg-opacity-90 px-4 py-1.5 text-sm flex items-center gap-1.5"
                      onClick={() => {
                          setSelectedFile(null); 
                      }}
                    >
                      Select this Template
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-text-secondary mb-3">Or, if you have your own template file:</p>
              <Link 
                  to="?action=upload" 
                  className="btn border border-border hover:border-gold text-gold"
                  onClick={() => {
                      setSelectedFile(null);
                  }}
              >
                  Upload a Custom Template File
              </Link>
            </div>
          </>
          )}
        )}
        
        {currentStep === 2 && (
          <>
            <h2 className="text-xl font-medium mb-4">Step 2: Input Scores & Narrative</h2>
            <p className="text-text-secondary mb-2">
              {selectedFile ? 
                `You are using the uploaded file: ${selectedFile.name}. (Placeholder for template parsing results and score input fields).` :
              selectedTemplateId ?
                `You are using template ID: ${selectedTemplateId}. (Placeholder for score input fields).` :
                "Error: No template or file selected." 
              }
            </p>
            
            <div className="my-6 p-6 border border-dashed border-border rounded-md bg-bg-secondary">
              <p className="text-text-secondary text-center">Score input forms and narrative prompts will appear here.</p>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button 
                onClick={() => setCurrentStep(1)} 
                className="btn border border-border hover:bg-bg-secondary"
              >
                Back to Step 1
              </button>
              <button 
                className="btn bg-accent-gold text-black"
                disabled
              >
                Proceed to Next Step (Disabled)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReportPage;