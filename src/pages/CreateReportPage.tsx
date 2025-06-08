import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FileText, Upload, Download, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';

// Form data interface - will be extended dynamically for custom templates
interface FormData {
  // Academic Achievement fields
  studentName?: string;
  dateOfBirth?: string;
  dateOfEvaluation?: string;
  grade?: string;
  examiner?: string;
  reasonForReferral?: string;
  backgroundInfo?: string;
  behavioralObservations?: string;
  broadAchievementScore?: string;
  broadAchievementPercentile?: string;
  broadAchievementRange?: string;
  readingScore?: string;
  readingPercentile?: string;
  readingRange?: string;
  writtenLanguageScore?: string;
  writtenLanguagePercentile?: string;
  writtenLanguageRange?: string;
  mathematicsScore?: string;
  mathematicsPercentile?: string;
  mathematicsRange?: string;
  letterWordScore?: string;
  letterWordPercentile?: string;
  passageCompScore?: string;
  passageCompPercentile?: string;
  spellingScore?: string;
  spellingPercentile?: string;
  calculationScore?: string;
  calculationPercentile?: string;
  appliedProblemsScore?: string;
  appliedProblemsPercentile?: string;
  narrativeInterpretation?: string;
  summaryFindings?: string;
  academicRecommendations?: string;
  
  // Cognitive Processing fields
  cognitiveAssessmentName?: string;
  fsiqScore?: string;
  fsiqPercentile?: string;
  fsiqConfidenceInterval?: string;
  fsiqRange?: string;
  vciScore?: string;
  vciPercentile?: string;
  vsiScore?: string;
  vsiPercentile?: string;
  friScore?: string;
  friPercentile?: string;
  wmiScore?: string;
  wmiPercentile?: string;
  psiScore?: string;
  psiPercentile?: string;
  cognitiveNarrative?: string;
  cognitiveStrengthsWeaknesses?: string;
  learningImplications?: string;
  cognitiveRecommendations?: string;
  
  // Speech & Language fields
  examinerSlp?: string;
  communicationHistory?: string;
  assessmentMethods?: string;
  receptiveLanguage?: string;
  expressiveLanguage?: string;
  articulationPhonology?: string;
  fluency?: string;
  voice?: string;
  oralMotorFeeding?: string;
  communicationSummary?: string;
  diagnosticImpressions?: string;
  speechRecommendations?: string;
  
  // Dynamic fields for custom templates will be added at runtime
  [key: string]: string | undefined;
}

// Template data for predefined templates
const fullTemplatesData = [
  {
    id: 'academic-achievement',
    name: 'Academic Achievement Report',
    content: `# ACADEMIC ACHIEVEMENT REPORT

## Student Information
Name: [STUDENT_NAME]
Date of Birth: [DATE_OF_BIRTH]
Date of Evaluation: [DATE_OF_EVALUATION]
Grade: [GRADE]
Examiner: [EXAMINER]

## Reason for Referral
[REASON_FOR_REFERRAL]

## Background Information
[BACKGROUND_INFO]

## Assessment Instruments Administered
Woodcock-Johnson IV Tests of Achievement (WJ IV ACH)
[Other relevant academic tests or checklists]

## Behavioral Observations
[BEHAVIORAL_OBSERVATIONS]

## Test Results & Interpretation
Woodcock-Johnson IV Tests of Achievement

Clusters:
Broad Achievement: SS [BROAD_ACHIEVEMENT_SCORE], PR [BROAD_ACHIEVEMENT_PERCENTILE], Range [BROAD_ACHIEVEMENT_RANGE]
Reading: SS [READING_SCORE], PR [READING_PERCENTILE], Range [READING_RANGE]
Written Language: SS [WRITTEN_LANGUAGE_SCORE], PR [WRITTEN_LANGUAGE_PERCENTILE], Range [WRITTEN_LANGUAGE_RANGE]
Mathematics: SS [MATHEMATICS_SCORE], PR [MATHEMATICS_PERCENTILE], Range [MATHEMATICS_RANGE]

Subtests (Examples):
Letter-Word Identification: SS [LETTER_WORD_SCORE], PR [LETTER_WORD_PERCENTILE]
Passage Comprehension: SS [PASSAGE_COMP_SCORE], PR [PASSAGE_COMP_PERCENTILE]
Spelling: SS [SPELLING_SCORE], PR [SPELLING_PERCENTILE]
Calculation: SS [CALCULATION_SCORE], PR [CALCULATION_PERCENTILE]
Applied Problems: SS [APPLIED_PROBLEMS_SCORE], PR [APPLIED_PROBLEMS_PERCENTILE]

[NARRATIVE_INTERPRETATION]

## Summary of Findings
[SUMMARY_FINDINGS]

## Recommendations
[ACADEMIC_RECOMMENDATIONS]`
  },
  {
    id: 'cognitive-processing',
    name: 'Cognitive Processing Report',
    content: `# COGNITIVE PROCESSING REPORT

## Student Information
Name: [STUDENT_NAME]
Date of Birth: [DATE_OF_BIRTH]
Date of Evaluation: [DATE_OF_EVALUATION]
Grade: [GRADE]
Examiner: [EXAMINER]

## Reason for Referral
[REASON_FOR_REFERRAL]

## Background Information
[BACKGROUND_INFO]

## Assessment Instruments Administered
[COGNITIVE_ASSESSMENT_NAME]
[Other cognitive or processing measures]

## Behavioral Observations
[BEHAVIORAL_OBSERVATIONS]

## Test Results & Interpretation
[COGNITIVE_ASSESSMENT_NAME]

Overall/Composite Scores:
Full Scale IQ (FSIQ) / General Conceptual Ability (GCA): Score [FSIQ_SCORE], PR [FSIQ_PERCENTILE], CI [FSIQ_CONFIDENCE_INTERVAL], Range [FSIQ_RANGE]

Index/Factor Scores (Examples):
Verbal Comprehension Index (VCI): Score [VCI_SCORE], PR [VCI_PERCENTILE]
Visual Spatial Index (VSI): Score [VSI_SCORE], PR [VSI_PERCENTILE]
Fluid Reasoning Index (FRI): Score [FRI_SCORE], PR [FRI_PERCENTILE]
Working Memory Index (WMI): Score [WMI_SCORE], PR [WMI_PERCENTILE]
Processing Speed Index (PSI): Score [PSI_SCORE], PR [PSI_PERCENTILE]

[COGNITIVE_NARRATIVE]

## Summary of Cognitive Strengths and Weaknesses
[COGNITIVE_STRENGTHS_WEAKNESSES]

## Implications for Learning
[LEARNING_IMPLICATIONS]

## Recommendations
[COGNITIVE_RECOMMENDATIONS]`
  },
  {
    id: 'speech-language',
    name: 'Speech & Language Report',
    content: `# SPEECH AND LANGUAGE EVALUATION REPORT

## Student Information
Name: [STUDENT_NAME]
Date of Birth: [DATE_OF_BIRTH]
Date of Evaluation: [DATE_OF_EVALUATION]
Grade: [GRADE]
Examiner: [EXAMINER_SLP]

## Reason for Referral
[REASON_FOR_REFERRAL]

## Background Information & Communication History
[COMMUNICATION_HISTORY]

## Assessment Methods
[ASSESSMENT_METHODS]

## Behavioral Observations
[BEHAVIORAL_OBSERVATIONS]

## Assessment Results & Interpretation
Receptive Language
[RECEPTIVE_LANGUAGE]

Expressive Language
[EXPRESSIVE_LANGUAGE]

Articulation/Phonology
[ARTICULATION_PHONOLOGY]

Fluency
[FLUENCY]

Voice
[VOICE]

Oral Motor/Feeding (if applicable)
[ORAL_MOTOR_FEEDING]

## Summary of Communication Strengths and Needs
[COMMUNICATION_SUMMARY]

## Diagnostic Impressions & Eligibility (if applicable)
[DIAGNOSTIC_IMPRESSIONS]

## Recommendations
[SPEECH_RECOMMENDATIONS]`
  }
];

const CreateReportPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [currentSubStep, setCurrentSubStep] = useState(1);

  // Get template ID from URL params
  const selectedTemplateId = searchParams.get('template');

  // Access route state for custom templates
  const routeState = location.state as { 
    customTemplateContent?: string; 
    customTemplatePlaceholders?: string[];
    customTemplateName?: string;
  } | null;
  
  const isCustomTemplate = selectedTemplateId?.startsWith('custom-');
  const customContent = routeState?.customTemplateContent;
  const customPlaceholders = routeState?.customTemplatePlaceholders;
  const customName = routeState?.customTemplateName;

  // If we have a template selected, skip to step 2
  useEffect(() => {
    if (selectedTemplateId) {
      setCurrentStep(2);
    }
  }, [selectedTemplateId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = () => {
    setReportGenerated(true);
    setCurrentStep(3);
  };

  // Function to populate template with form data
  const populateTemplate = (template: string, data: FormData): string => {
    let populatedTemplate = template;
    
    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `[${key.toUpperCase()}]`;
      populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), value || '');
    });
    
    return populatedTemplate;
  };

  // Function to create DOCX document
  const createDocxDocument = (data: FormData, templateId: string, fullTemplateContent: string, isCustomHtml: boolean): Document => {
    const populatedReportText = populateTemplate(fullTemplateContent, data);
    const docxParagraphs: Paragraph[] = [];

    if (isCustomHtml) {
      // Simplistic handling for HTML: try to convert to plain text paragraphs
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = populatedReportText;
      
      // Iterate over child nodes to try and build paragraphs
      tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li').forEach(node => {
        let text = node.textContent || "";
        let options: any = {};
        if (node.nodeName.startsWith('H')) {
          const headingLevel = parseInt(node.nodeName.charAt(1));
          if (headingLevel >= 1 && headingLevel <= 6) {
            options.heading = HeadingLevel[`HEADING_${headingLevel}` as keyof typeof HeadingLevel];
          }
        }
        if (node.nodeName === 'LI') {
          options.bullet = { level: 0 };
        }
        docxParagraphs.push(new Paragraph({ text, ...options }));
      });
      
      if (docxParagraphs.length === 0) {
        docxParagraphs.push(new Paragraph({ text: tempDiv.textContent || populatedReportText }));
      }
    } else {
      // Existing Markdown-like parsing
      const lines = populatedReportText.split('\n');
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('# ')) {
          docxParagraphs.push(new Paragraph({
            text: trimmedLine.substring(2),
            heading: HeadingLevel.HEADING_1,
          }));
        } else if (trimmedLine.startsWith('## ')) {
          docxParagraphs.push(new Paragraph({
            text: trimmedLine.substring(3),
            heading: HeadingLevel.HEADING_2,
          }));
        } else if (trimmedLine.startsWith('### ')) {
          docxParagraphs.push(new Paragraph({
            text: trimmedLine.substring(4),
            heading: HeadingLevel.HEADING_3,
          }));
        } else if (trimmedLine === '') {
          docxParagraphs.push(new Paragraph({ text: '' }));
        } else {
          docxParagraphs.push(new Paragraph({ text: trimmedLine }));
        }
      });
    }

    return new Document({
      sections: [{
        properties: {},
        children: docxParagraphs,
      }],
    });
  };

  const downloadDocxFile = async () => {
    let templateContentForPopulation: string | undefined;
    let templateNameForDisplay: string | undefined;

    if (isCustomTemplate && customContent) {
      templateContentForPopulation = customContent;
      templateNameForDisplay = customName || 'Custom Uploaded Template';
    } else if (selectedTemplateId) {
      const predefined = fullTemplatesData.find(t => t.id === selectedTemplateId);
      templateContentForPopulation = predefined?.content;
      templateNameForDisplay = predefined?.name;
    }

    if (!templateContentForPopulation) {
      alert('Template content not found');
      return;
    }

    const doc = createDocxDocument(formData, selectedTemplateId!, templateContentForPopulation, !!isCustomTemplate);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${templateNameForDisplay?.replace(/\s+/g, '_') || 'report'}.docx`);
  };

  const downloadTxtFile = () => {
    let templateContentForPopulation: string | undefined;
    let templateNameForDisplay: string | undefined;

    if (isCustomTemplate && customContent) {
      templateContentForPopulation = customContent;
      templateNameForDisplay = customName || 'Custom Uploaded Template';
    } else if (selectedTemplateId) {
      const predefined = fullTemplatesData.find(t => t.id === selectedTemplateId);
      templateContentForPopulation = predefined?.content;
      templateNameForDisplay = predefined?.name;
    }

    if (!templateContentForPopulation) {
      alert('Template content not found');
      return;
    }

    const populatedContent = populateTemplate(templateContentForPopulation, formData);
    
    // For custom HTML templates, convert to plain text
    let textContent = populatedContent;
    if (isCustomTemplate) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = populatedContent;
      textContent = tempDiv.textContent || tempDiv.innerText || populatedContent;
    }
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${templateNameForDisplay?.replace(/\s+/g, '_') || 'report'}.txt`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-primary rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-text-primary">Create Report</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-bg-secondary'}`}>
                1
              </div>
              <span className="font-medium">Select Template</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-bg-secondary'}`}>
                2
              </div>
              <span className="font-medium">Fill Information</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-green-600' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-bg-secondary'}`}>
                {currentStep >= 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <span className="font-medium">Review & Download</span>
            </div>
          </div>

          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Select a Report Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fullTemplatesData.map((template) => (
                  <div
                    key={template.id}
                    className="border border-border rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer bg-bg-secondary"
                    onClick={() => {
                      window.location.href = `/reports/new?template=${template.id}`;
                    }}
                  >
                    <h3 className="font-semibold text-text-primary mb-2">{template.name}</h3>
                    <p className="text-sm text-text-secondary">Click to use this template</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Fill Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  Fill Report Information
                  {isCustomTemplate && customName && (
                    <span className="ml-2 text-sm text-text-secondary">({customName})</span>
                  )}
                </h2>
              </div>

              {/* Custom Template Fields */}
              {isCustomTemplate && customPlaceholders && (
                <div className="space-y-6 animate-fadeIn" id="substep-custom-template-fields">
                  <h3 className="text-lg font-semibold mb-3 text-gold">
                    Fill Custom Template: {customName || 'Custom Report'}
                  </h3>
                  {customPlaceholders.length > 0 ? (
                    customPlaceholders.map(placeholderKey => (
                      <div key={placeholderKey} className="p-4 border border-border rounded-md">
                        <label 
                          htmlFor={`custom_field_${placeholderKey}`} 
                          className="block text-sm font-medium mb-1 capitalize text-text-primary"
                        >
                          {placeholderKey.replace(/_/g, ' ').toLowerCase()}:
                        </label>
                        <textarea
                          name={placeholderKey}
                          id={`custom_field_${placeholderKey}`}
                          rows={2}
                          value={formData[placeholderKey as keyof FormData] || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder={`Enter data for ${placeholderKey.replace(/_/g, ' ').toLowerCase()}`}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-text-secondary">This custom template has no defined placeholders.</p>
                  )}
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                    <button onClick={() => setCurrentStep(1)} className="btn border border-border hover:bg-bg-secondary">
                      Back to Template Selection
                    </button>
                    <button 
                      onClick={() => setCurrentStep(3)}
                      className="btn bg-accent-gold text-black"
                    >
                      Review Report
                    </button>
                  </div>
                </div>
              )}

              {/* Predefined Template Fields */}
              {!isCustomTemplate && selectedTemplateId === 'academic-achievement' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Sub-step navigation for academic achievement */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentSubStep >= step ? 'bg-blue-600 text-white' : 'bg-bg-secondary text-text-secondary'
                          }`}>
                            {step}
                          </div>
                          {step < 4 && <div className="w-8 h-px bg-border ml-2" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-step 1: Basic Information */}
                  {currentSubStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-semibold mb-3 text-gold">Basic Student Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-text-primary">Student Name</label>
                          <input
                            type="text"
                            name="studentName"
                            value={formData.studentName || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                            placeholder="Enter student's full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-text-primary">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-text-primary">Date of Evaluation</label>
                          <input
                            type="date"
                            name="dateOfEvaluation"
                            value={formData.dateOfEvaluation || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-text-primary">Grade</label>
                          <input
                            type="text"
                            name="grade"
                            value={formData.grade || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                            placeholder="e.g., 3rd Grade"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-text-primary">Examiner</label>
                          <input
                            type="text"
                            name="examiner"
                            value={formData.examiner || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                            placeholder="Enter examiner's name and credentials"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <button onClick={() => setCurrentStep(1)} className="btn border border-border hover:bg-bg-secondary">
                          Back to Templates
                        </button>
                        <button onClick={() => setCurrentSubStep(2)} className="btn bg-blue-600 text-white">
                          Next: Background Info
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub-step 2: Background Information */}
                  {currentSubStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-semibold mb-3 text-gold">Background & Observations</h3>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-text-primary">Reason for Referral</label>
                        <textarea
                          name="reasonForReferral"
                          rows={3}
                          value={formData.reasonForReferral || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder="Describe why the student was referred for evaluation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-text-primary">Background Information</label>
                        <textarea
                          name="backgroundInfo"
                          rows={4}
                          value={formData.backgroundInfo || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder="Include relevant educational, developmental, and family history"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-text-primary">Behavioral Observations</label>
                        <textarea
                          name="behavioralObservations"
                          rows={3}
                          value={formData.behavioralObservations || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder="Describe student's behavior during assessment"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <button onClick={() => setCurrentSubStep(1)} className="btn border border-border hover:bg-bg-secondary">
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>
                        <button onClick={() => setCurrentSubStep(3)} className="btn bg-blue-600 text-white">
                          Next: Test Scores
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub-step 3: Test Scores */}
                  {currentSubStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-semibold mb-3 text-gold">Test Results & Scores</h3>
                      
                      {/* Cluster Scores */}
                      <div className="bg-bg-secondary p-4 rounded-md">
                        <h4 className="font-medium mb-3 text-text-primary">Cluster Scores</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-text-primary">Broad Achievement SS</label>
                            <input
                              type="text"
                              name="broadAchievementScore"
                              value={formData.broadAchievementScore || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                              placeholder="e.g., 85"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-text-primary">Percentile</label>
                            <input
                              type="text"
                              name="broadAchievementPercentile"
                              value={formData.broadAchievementPercentile || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                              placeholder="e.g., 16"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-text-primary">Range</label>
                            <input
                              type="text"
                              name="broadAchievementRange"
                              value={formData.broadAchievementRange || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                              placeholder="e.g., Low Average"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional cluster scores would go here */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-bg-secondary p-3 rounded-md">
                          <h5 className="font-medium mb-2 text-text-primary">Reading</h5>
                          <div className="space-y-2">
                            <input
                              type="text"
                              name="readingScore"
                              value={formData.readingScore || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary text-sm"
                              placeholder="SS Score"
                            />
                            <input
                              type="text"
                              name="readingPercentile"
                              value={formData.readingPercentile || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary text-sm"
                              placeholder="Percentile"
                            />
                          </div>
                        </div>
                        <div className="bg-bg-secondary p-3 rounded-md">
                          <h5 className="font-medium mb-2 text-text-primary">Mathematics</h5>
                          <div className="space-y-2">
                            <input
                              type="text"
                              name="mathematicsScore"
                              value={formData.mathematicsScore || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary text-sm"
                              placeholder="SS Score"
                            />
                            <input
                              type="text"
                              name="mathematicsPercentile"
                              value={formData.mathematicsPercentile || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary text-sm"
                              placeholder="Percentile"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <button onClick={() => setCurrentSubStep(2)} className="btn border border-border hover:bg-bg-secondary">
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>
                        <button onClick={() => setCurrentSubStep(4)} className="btn bg-blue-600 text-white">
                          Next: Summary
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub-step 4: Summary & Recommendations */}
                  {currentSubStep === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-semibold mb-3 text-gold">Summary & Recommendations</h3>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-text-primary">Narrative Interpretation</label>
                        <textarea
                          name="narrativeInterpretation"
                          rows={4}
                          value={formData.narrativeInterpretation || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder="Provide interpretation of test results and academic performance"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-text-primary">Summary of Findings</label>
                        <textarea
                          name="summaryFindings"
                          rows={3}
                          value={formData.summaryFindings || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder="Summarize key findings from the assessment"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-text-primary">Recommendations</label>
                        <textarea
                          name="academicRecommendations"
                          rows={4}
                          value={formData.academicRecommendations || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
                          placeholder="Provide specific recommendations for educational interventions"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <button onClick={() => setCurrentSubStep(3)} className="btn border border-border hover:bg-bg-secondary">
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>
                        <button onClick={() => setCurrentStep(3)} className="btn bg-green-600 text-white">
                          Review Report
                          <CheckCircle className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Placeholder for other predefined templates */}
              {!isCustomTemplate && selectedTemplateId === 'cognitive-processing' && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-semibold mb-3 text-gold">Cognitive Processing Report</h3>
                  <p className="text-text-secondary">Cognitive processing form fields will be implemented here.</p>
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                    <button onClick={() => setCurrentStep(1)} className="btn border border-border hover:bg-bg-secondary">
                      Back to Template Selection
                    </button>
                    <button onClick={() => setCurrentStep(3)} className="btn bg-accent-gold text-black">
                      Review Report
                    </button>
                  </div>
                </div>
              )}

              {!isCustomTemplate && selectedTemplateId === 'speech-language' && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-semibold mb-3 text-gold">Speech & Language Report</h3>
                  <p className="text-text-secondary">Speech & language form fields will be implemented here.</p>
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                    <button onClick={() => setCurrentStep(1)} className="btn border border-border hover:bg-bg-secondary">
                      Back to Template Selection
                    </button>
                    <button onClick={() => setCurrentStep(3)} className="btn bg-accent-gold text-black">
                      Review Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Download */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Review Your Report</h2>
                <div className="flex gap-3">
                  <button
                    onClick={downloadTxtFile}
                    className="btn border border-border hover:bg-bg-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download as .txt
                  </button>
                  <button
                    onClick={downloadDocxFile}
                    className="btn bg-blue-600 text-white flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download as .docx
                  </button>
                </div>
              </div>

              {/* Report Preview */}
              <div className="border border-border rounded-lg p-6 bg-bg-secondary">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">Report Preview</h3>
                {(() => {
                  let templateContentForPopulation: string | undefined;
                  let templateNameForDisplay: string | undefined;

                  if (isCustomTemplate && customContent) {
                    templateContentForPopulation = customContent;
                    templateNameForDisplay = customName || 'Custom Uploaded Template';
                  } else if (selectedTemplateId) {
                    const predefined = fullTemplatesData.find(t => t.id === selectedTemplateId);
                    templateContentForPopulation = predefined?.content;
                    templateNameForDisplay = predefined?.name;
                  }

                  if (isCustomTemplate && templateContentForPopulation) {
                    return (
                      <div 
                        className="whitespace-pre-wrap text-sm leading-relaxed bg-bg-primary p-4 border border-border rounded-md max-h-[60vh] overflow-y-auto" 
                        dangerouslySetInnerHTML={{ __html: populateTemplate(templateContentForPopulation, formData) }} 
                      />
                    );
                  } else if (templateContentForPopulation) {
                    return (
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-bg-primary p-4 border border-border rounded-md max-h-[60vh] overflow-y-auto text-text-primary">
                        {populateTemplate(templateContentForPopulation, formData)}
                      </pre>
                    );
                  } else {
                    return <p className="text-text-secondary">No template content available for preview.</p>;
                  }
                })()}
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn border border-border hover:bg-bg-secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Edit
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFormData({});
                    setCurrentSubStep(1);
                    setReportGenerated(false);
                  }}
                  className="btn bg-accent-gold text-black"
                >
                  Create Another Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;