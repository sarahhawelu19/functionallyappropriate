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
              <p className="text-text-secondary">(Next step: Input/Upload Scores - UI coming soon)</p> {/* This line was part of the original selectedTemplateId block */}
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
          )
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
            
            <div className="space-y-8">
              {selectedTemplateId === 'academic-achievement' && (
                <>
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="studentName" className="block text-sm font-medium mb-1">Student Name</label>
                        <input type="text" name="studentName" id="studentName" value={formData.studentName || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of Birth</label>
                        <input type="date" name="dob" id="dob" value={formData.dob || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="doe" className="block text-sm font-medium mb-1">Date of Evaluation</label>
                        <input type="date" name="doe" id="doe" value={formData.doe || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="grade" className="block text-sm font-medium mb-1">Grade</label>
                        <input type="text" name="grade" id="grade" value={formData.grade || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="examiner" className="block text-sm font-medium mb-1">Examiner</label>
                        <input type="text" name="examiner" id="examiner" value={formData.examiner || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Woodcock-Johnson IV - Clusters</h3>
                    <div className="mb-4 p-3 border border-border-secondary rounded bg-bg-secondary">
                      <h4 className="font-medium mb-2">Broad Achievement</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label htmlFor="wj_broad_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                          <input type="number" name="wj_broad_ss" id="wj_broad_ss" value={formData.wj_broad_ss || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                        </div>
                        <div>
                          <label htmlFor="wj_broad_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                          <input type="number" name="wj_broad_pr" id="wj_broad_pr" value={formData.wj_broad_pr || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                        </div>
                        <div>
                          <label htmlFor="wj_broad_range" className="block text-xs font-medium mb-1">Descriptive Range</label>
                          <input type="text" name="wj_broad_range" id="wj_broad_range" value={formData.wj_broad_range || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">More cluster and subtest inputs will be added here.</p>
                  </div>
                  
                  <div className="mb-4 p-3 border border-border-secondary rounded bg-bg-secondary">
                    <h4 className="font-medium mb-2">Reading</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="wj_reading_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                        <input type="number" name="wj_reading_ss" id="wj_reading_ss" value={formData.wj_reading_ss || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="wj_reading_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                        <input type="number" name="wj_reading_pr" id="wj_reading_pr" value={formData.wj_reading_pr || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="wj_reading_range" className="block text-xs font-medium mb-1">Descriptive Range</label>
                        <input type="text" name="wj_reading_range" id="wj_reading_range" value={formData.wj_reading_range || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 border border-border-secondary rounded bg-bg-secondary">
                    <h4 className="font-medium mb-2">Written Language</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="wj_written_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                        <input type="number" name="wj_written_ss" id="wj_written_ss" value={formData.wj_written_ss || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="wj_written_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                        <input type="number" name="wj_written_pr" id="wj_written_pr" value={formData.wj_written_pr || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="wj_written_range" className="block text-xs font-medium mb-1">Descriptive Range</label>
                        <input type="text" name="wj_written_range" id="wj_written_range" value={formData.wj_written_range || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 border border-border-secondary rounded bg-bg-secondary">
                    <h4 className="font-medium mb-2">Mathematics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="wj_math_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                        <input type="number" name="wj_math_ss" id="wj_math_ss" value={formData.wj_math_ss || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="wj_math_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                        <input type="number" name="wj_math_pr" id="wj_math_pr" value={formData.wj_math_pr || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label htmlFor="wj_math_range" className="block text-xs font-medium mb-1">Descriptive Range</label>
                        <input type="text" name="wj_math_range" id="wj_math_range" value={formData.wj_math_range || ''} onChange={handleInputChange} className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-3 text-gold">Woodcock-Johnson IV - Subtests</h3>
                    
                    {/* Standard Battery Subtests */}
                    <div className="space-y-3">
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">1. Letter-Word Identification</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_letter_word_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_letter_word_ss" id="wj_letter_word_ss" value={formData.wj_letter_word_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_letter_word_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_letter_word_pr" id="wj_letter_word_pr" value={formData.wj_letter_word_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">2. Applied Problems</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_applied_problems_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_applied_problems_ss" id="wj_applied_problems_ss" value={formData.wj_applied_problems_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_applied_problems_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_applied_problems_pr" id="wj_applied_problems_pr" value={formData.wj_applied_problems_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">3. Spelling</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_spelling_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_spelling_ss" id="wj_spelling_ss" value={formData.wj_spelling_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_spelling_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_spelling_pr" id="wj_spelling_pr" value={formData.wj_spelling_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">4. Passage Comprehension</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_passage_comp_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_passage_comp_ss" id="wj_passage_comp_ss" value={formData.wj_passage_comp_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_passage_comp_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_passage_comp_pr" id="wj_passage_comp_pr" value={formData.wj_passage_comp_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">5. Calculation</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_calculation_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_calculation_ss" id="wj_calculation_ss" value={formData.wj_calculation_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_calculation_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_calculation_pr" id="wj_calculation_pr" value={formData.wj_calculation_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">6. Writing Samples</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_writing_samples_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_writing_samples_ss" id="wj_writing_samples_ss" value={formData.wj_writing_samples_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_writing_samples_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_writing_samples_pr" id="wj_writing_samples_pr" value={formData.wj_writing_samples_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">7. Word Attack</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_word_attack_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_word_attack_ss" id="wj_word_attack_ss" value={formData.wj_word_attack_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_word_attack_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_word_attack_pr" id="wj_word_attack_pr" value={formData.wj_word_attack_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">8. Oral Reading</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_oral_reading_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_oral_reading_ss" id="wj_oral_reading_ss" value={formData.wj_oral_reading_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_oral_reading_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_oral_reading_pr" id="wj_oral_reading_pr" value={formData.wj_oral_reading_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">9. Sentence Reading Fluency</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_sent_read_flu_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_sent_read_flu_ss" id="wj_sent_read_flu_ss" value={formData.wj_sent_read_flu_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_sent_read_flu_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_sent_read_flu_pr" id="wj_sent_read_flu_pr" value={formData.wj_sent_read_flu_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">10. Math Facts Fluency</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_math_facts_flu_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_math_facts_flu_ss" id="wj_math_facts_flu_ss" value={formData.wj_math_facts_flu_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_math_facts_flu_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_math_facts_flu_pr" id="wj_math_facts_flu_pr" value={formData.wj_math_facts_flu_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-border-secondary rounded bg-bg-secondary">
                        <h4 className="font-medium text-sm mb-2">11. Sentence Writing Fluency</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="wj_sent_write_flu_ss" className="block text-xs font-medium mb-1">Standard Score (SS)</label>
                            <input type="number" name="wj_sent_write_flu_ss" id="wj_sent_write_flu_ss" value={formData.wj_sent_write_flu_ss || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                          <div>
                            <label htmlFor="wj_sent_write_flu_pr" className="block text-xs font-medium mb-1">Percentile Rank (PR)</label>
                            <input type="number" name="wj_sent_write_flu_pr" id="wj_sent_write_flu_pr" value={formData.wj_sent_write_flu_pr || ''} onChange={handleInputChange} className="w-full p-1.5 border border-border rounded-md bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Toggle for Extended Battery */}
                    <div className="mt-6 mb-4">
                      <label htmlFor="includeExtendedBattery" className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="includeExtendedBattery" 
                          id="includeExtendedBattery" 
                          checked={formData.includeExtendedBattery || false} 
                          onChange={handleInputChange}
                          className="h-4 w-4 text-gold border-border rounded focus:ring-gold"
                        />
                        <span className="ml-2 text-sm font-medium text-text-primary">Include Extended Battery Subtests?</span>
                      </label>
                    </div>

                    {/* Extended Battery Subtests (Conditional) */}
                    {formData.includeExtendedBattery && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-border-secondary">
                        <h4 className="text-md font-semibold mb-2 text-gold opacity-80">Extended Battery</h4>
                        <p className="text-xs text-text-secondary">Extended battery subtest inputs will appear here.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Reason for Referral</h3>
                    <textarea 
                      name="reasonForReferral" 
                      id="reasonForReferral" 
                      rows={3} 
                      value={formData.reasonForReferral || ''} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Describe the reason for referral..."
                    />
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Background Information</h3>
                    <textarea 
                      name="backgroundInfo" 
                      id="backgroundInfo" 
                      rows={4} 
                      value={formData.backgroundInfo || ''} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Enter relevant background information..."
                    />
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Assessment Instruments</h3>
                    <textarea 
                      name="assessmentInstruments" 
                      id="assessmentInstruments" 
                      rows={3} 
                      value={formData.assessmentInstruments || 'Woodcock-Johnson IV Tests of Achievement (WJ IV ACH)\n'} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="List additional assessment instruments..."
                    />
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Behavioral Observations</h3>
                    <textarea 
                      name="behavioralObservations" 
                      id="behavioralObservations" 
                      rows={4} 
                      value={formData.behavioralObservations || ''} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Describe observations during assessment..."
                    />
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Narrative Interpretation</h3>
                    <textarea 
                      name="narrativeInterpretation" 
                      id="narrativeInterpretation" 
                      rows={5} 
                      value={formData.narrativeInterpretation || ''} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Provide interpretation of academic scores..."
                    />
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Summary of Findings</h3>
                    <textarea 
                      name="summaryOfFindings" 
                      id="summaryOfFindings" 
                      rows={4} 
                      value={formData.summaryOfFindings || ''} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Summarize key findings from assessment..."
                    />
                  </div>
                  
                  <div className="p-4 border border-border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 text-gold">Recommendations</h3>
                    <textarea 
                      name="recommendations" 
                      id="recommendations" 
                      rows={4} 
                      value={formData.recommendations || ''} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Enter academic recommendations..."
                    />
                  </div>
                </>
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