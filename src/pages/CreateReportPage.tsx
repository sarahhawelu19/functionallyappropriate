import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';

interface FormData {
  studentName?: string;
  dob?: string;
  doe?: string;
  grade?: string;
  examiner?: string;
  reasonForReferral?: string;
  backgroundInfo?: string;
  assessmentInstruments?: string;
  behavioralObservations?: string;
  includeExtendedBattery?: boolean;
  // Standard Battery Subtests
  wj_letter_word_ss?: string;
  wj_letter_word_pr?: string;
  wj_applied_problems_ss?: string;
  wj_applied_problems_pr?: string;
  wj_spelling_ss?: string;
  wj_spelling_pr?: string;
  wj_passage_comp_ss?: string;
  wj_passage_comp_pr?: string;
  wj_calculation_ss?: string;
  wj_calculation_pr?: string;
  wj_writing_samples_ss?: string;
  wj_writing_samples_pr?: string;
  wj_word_attack_ss?: string;
  wj_word_attack_pr?: string;
  wj_oral_reading_ss?: string;
  wj_oral_reading_pr?: string;
  wj_sent_read_flu_ss?: string;
  wj_sent_read_flu_pr?: string;
  wj_math_facts_flu_ss?: string;
  wj_math_facts_flu_pr?: string;
  wj_sent_write_flu_ss?: string;
  wj_sent_write_flu_pr?: string;
  wj_broad_ss?: string;
  wj_broad_pr?: string;
  wj_broad_range?: string;
  wj_reading_ss?: string;
  wj_reading_pr?: string;
  wj_reading_range?: string;
  wj_written_ss?: string;
  wj_written_pr?: string;
  wj_written_range?: string;
  wj_math_ss?: string;
  wj_math_pr?: string;
  wj_math_range?: string;
  narrativeInterpretation?: string;
  summaryOfFindings?: string;
  recommendations?: string;
}

const CreateReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedTemplateId = searchParams.get('template');
  const currentAction = searchParams.get('action');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentSubStep, setCurrentSubStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };
  
  const availableTemplates = [
    { id: 'academic-achievement', name: 'Academic Achievement Report', description: 'Comprehensive report on student academic skills, often using WJ IV, WIAT, etc.' },
    { id: 'cognitive-processing', name: 'Cognitive Processing Report', description: 'Details student cognitive abilities, processing strengths, and weaknesses.' },
    { id: 'speech-language', name: 'Speech & Language Report', description: 'Assesses various aspects of communication including receptive/expressive language, articulation, fluency, and voice.' },
  ];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCurrentStep(1); // Reset to step 1 confirmation for the new file
      setCurrentSubStep(1); // Reset sub-step
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
          currentAction === 'upload' ? (
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
                      onClick={() => {
                        setSelectedFile(null);
                        setCurrentSubStep(1);
                      }} 
                      className="btn border border-border hover:bg-bg-secondary mr-2"
                    >
                      Clear Selection
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentStep(2);
                        setCurrentSubStep(1);
                      }} 
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
                  onClick={() => {
                    setCurrentStep(2);
                    setCurrentSubStep(1);
                  }} 
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
          )
        )}
        
        {currentStep === 2 && (
          <>
            <h2 className="text-xl font-medium mb-4">Step 2: Input Scores & Narrative</h2>
            <p className="text-text-secondary mb-6">
              {selectedFile ? 
                `You are using the uploaded file: ${selectedFile.name}. (Placeholder for template parsing results and score input fields).` :
              selectedTemplateId ?
                `You are using template ID: ${selectedTemplateId}. (Placeholder for score input fields).` :
                "Error: No template or file selected." 
              }
            </p>
            
            <div className="space-y-6">
              {selectedTemplateId === 'academic-achievement' && (
                <div className="space-y-6">
                  {/* Sub-Step 1: Student Information */}
                  {currentSubStep === 1 && (
                  <div className="p-4 border border-border rounded-md animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Student Information inputs */}
                    </div>
                  </div>
                  )}

                  {/* Sub-Step 2: WJ IV Clusters */}
                  {currentSubStep === 2 && (
                  <div className="p-4 border border-border rounded-md animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Woodcock-Johnson IV - Clusters</h3>
                    {/* WJ IV Clusters inputs */}
                  </div>
                  )}

                  {/* Sub-Step 3: WJ IV Standard Battery Subtests */}
                  {currentSubStep === 3 && (
                  <div className="p-4 border border-border rounded-md animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Woodcock-Johnson IV - Standard Battery Subtests</h3>
                    {/* Standard Battery Subtests inputs */}
                  </div>
                  )}

                  {/* Sub-Step 4: Extended Battery (if enabled) */}
                  {currentSubStep === 4 && formData.includeExtendedBattery && (
                  <div className="p-4 border border-border rounded-md animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Extended Battery Subtests</h3>
                    <p className="text-xs text-text-secondary">Extended battery subtest inputs will appear here.</p>
                  </div>
                  )}

                  {/* Sub-Step 5: Narrative Sections */}
                  {currentSubStep === 5 && (
                  <div className="p-4 border border-border rounded-md animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Narrative Sections</h3>
                    <div className="space-y-6">
                      {/* Narrative section textareas */}
                    </div>
                  </div>
                  )}

                  {/* Sub-Step Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                    <button 
                      onClick={() => {
                        if (currentSubStep === 1) {
                          setCurrentStep(1);
                        } else {
                          if (currentSubStep === 5 && !formData.includeExtendedBattery) {
                            setCurrentSubStep(3);
                          } else {
                            setCurrentSubStep(prev => prev - 1);
                          }
                        }
                      }} 
                      className="btn border border-border hover:bg-bg-secondary"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => {
                        if (currentSubStep === 3 && !formData.includeExtendedBattery) {
                          setCurrentSubStep(5);
                        } else if (currentSubStep < 5) {
                          setCurrentSubStep(prev => prev + 1);
                        }
                      }}
                      className="btn bg-accent-gold text-black"
                      disabled={currentSubStep === 5}
                    >
                      {currentSubStep === 5 ? 'Finish Data Input' : 'Next'}
                    </button>
                  </div>
                </div>
              )}

              {selectedTemplateId === 'cognitive-processing' && (
                <div className="p-4 border border-border rounded-md">
                  <h3 className="text-lg font-semibold mb-3 text-gold">Cognitive Processing - Score Input</h3>
                  <p className="text-text-secondary">Score input fields for Cognitive Processing reports will go here.</p>
                </div>
              )}

              {selectedTemplateId === 'speech-language' && (
                <div className="p-4 border border-border rounded-md">
                  <h3 className="text-lg font-semibold mb-3 text-gold">Speech & Language - Score Input</h3>
                  <p className="text-text-secondary">Score input fields for Speech & Language reports will go here.</p>
                </div>
              )}

              {!['academic-achievement', 'cognitive-processing', 'speech-language'].includes(selectedTemplateId || '') && selectedFile && (
                <div className="p-4 border border-border rounded-md">
                  <h3 className="text-lg font-semibold mb-3 text-gold">Uploaded File: {selectedFile.name}</h3>
                  <p className="text-text-secondary">Placeholder for displaying parsed template fields and score input for uploaded files.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReportPage;