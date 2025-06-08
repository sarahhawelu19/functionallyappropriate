import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, Calendar, GraduationCap, Brain, MessageSquare } from 'lucide-react';
import { useReports } from '../context/ReportContext';

interface FormData {
  studentName: string;
  dateOfBirth: string;
  dateOfEvaluation: string;
  grade: string;
  examiner: string;
  reasonForReferral: string;
  backgroundInfo: string;
  assessmentInstruments: string;
  behavioralObservations: string;
  narrativeInterpretation: string;
  summaryOfFindings: string;
  recommendations: string;
  // WJ IV specific fields
  wjBroadSs: string;
  wjBroadPr: string;
  wjBroadRange: string;
  wjReadingSs: string;
  wjReadingPr: string;
  wjReadingRange: string;
  wjWrittenSs: string;
  wjWrittenPr: string;
  wjWrittenRange: string;
  wjMathSs: string;
  wjMathPr: string;
  wjMathRange: string;
  wjLetterWordSs: string;
  wjLetterWordPr: string;
  wjAppliedProblemsSs: string;
  wjAppliedProblemsPr: string;
  wjSpellingSs: string;
  wjSpellingPr: string;
  wjPassageCompSs: string;
  wjPassageCompPr: string;
  wjCalculationSs: string;
  wjCalculationPr: string;
  wjWritingSamplesSs: string;
  wjWritingSamplesPr: string;
  wjWordAttackSs: string;
  wjWordAttackPr: string;
  wjOralReadingSs: string;
  wjOralReadingPr: string;
  wjSentReadFluSs: string;
  wjSentReadFluPr: string;
  wjMathFactsFluSs: string;
  wjMathFactsFluPr: string;
  wjSentWriteFluSs: string;
  wjSentWriteFluPr: string;
  includeExtendedBattery: boolean;
  wjReadRecallSs: string;
  wjReadRecallPr: string;
  wjNumMatricesSs: string;
  wjNumMatricesPr: string;
  wjEditingSs: string;
  wjEditingPr: string;
  wjWordReadFluSs: string;
  wjWordReadFluPr: string;
  wjSpellSoundsSs: string;
  wjSpellSoundsPr: string;
  wjReadVocabSs: string;
  wjReadVocabPr: string;
  wjScienceSs: string;
  wjSciencePr: string;
  wjSocialStudiesSs: string;
  wjSocialStudiesPr: string;
  wjHumanitiesSs: string;
  wjHumanitiesPr: string;
}

interface DraftData {
  formData: FormData;
  selectedTemplate: string;
  reportContent: string;
  lastSaved: string;
}

interface SubTemplate {
  id: string; // e.g., 'academic-wjiv', 'academic-wiat'
  name: string; // e.g., "Woodcock-Johnson IV (WJ IV ACH)"
  description: string;
  content: string; 
}

interface TemplateCategory {
  categoryId: string; // e.g., 'academic', 'cognitive'
  categoryName: string; // e.g., "Academic Achievement Reports"
  categoryDescription: string;
  icon?: React.ElementType; // Lucide icon component
  subTemplates: SubTemplate[];
}

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addReport } = useReports();

  // Template categories with sub-templates
  const templateCategories: TemplateCategory[] = [
    {
      categoryId: 'academic',
      categoryName: 'Academic Achievement Reports',
      categoryDescription: 'Comprehensive assessments of academic skills.',
      icon: GraduationCap,
      subTemplates: [
        {
          id: 'academic-wjiv',
          name: 'Woodcock-Johnson IV (WJ IV ACH)',
          description: 'Detailed academic skills assessment (reading, math, writing).',
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
[ASSESSMENT_INSTRUMENTS]

## Behavioral Observations
[BEHAVIORAL_OBSERVATIONS]

## Test Results & Interpretation
### Woodcock-Johnson IV Tests of Achievement
**Clusters:**
- Broad Achievement: SS [WJ_BROAD_SS], PR [WJ_BROAD_PR], Range [WJ_BROAD_RANGE]
- Reading: SS [WJ_READING_SS], PR [WJ_READING_PR], Range [WJ_READING_RANGE]
- Written Language: SS [WJ_WRITTEN_SS], PR [WJ_WRITTEN_PR], Range [WJ_WRITTEN_RANGE]
- Mathematics: SS [WJ_MATH_SS], PR [WJ_MATH_PR], Range [WJ_MATH_RANGE]

**Standard Battery Subtests:**
- Letter-Word Identification: SS [WJ_LETTER_WORD_SS], PR [WJ_LETTER_WORD_PR]
- Applied Problems: SS [WJ_APPLIED_PROBLEMS_SS], PR [WJ_APPLIED_PROBLEMS_PR]
- Spelling: SS [WJ_SPELLING_SS], PR [WJ_SPELLING_PR]
- Passage Comprehension: SS [WJ_PASSAGE_COMP_SS], PR [WJ_PASSAGE_COMP_PR]
- Calculation: SS [WJ_CALCULATION_SS], PR [WJ_CALCULATION_PR]
- Writing Samples: SS [WJ_WRITING_SAMPLES_SS], PR [WJ_WRITING_SAMPLES_PR]
- Word Attack: SS [WJ_WORD_ATTACK_SS], PR [WJ_WORD_ATTACK_PR]
- Oral Reading: SS [WJ_ORAL_READING_SS], PR [WJ_ORAL_READING_PR]
- Sentence Reading Fluency: SS [WJ_SENT_READ_FLU_SS], PR [WJ_SENT_READ_FLU_PR]
- Math Facts Fluency: SS [WJ_MATH_FACTS_FLU_SS], PR [WJ_MATH_FACTS_FLU_PR]
- Sentence Writing Fluency: SS [WJ_SENT_WRITE_FLU_SS], PR [WJ_SENT_WRITE_FLU_PR]

[IF_INCLUDE_EXTENDED_BATTERY_START]
**Extended Battery Subtests:**
- Reading Recall: SS [WJ_READ_RECALL_SS], PR [WJ_READ_RECALL_PR]
- Number Matrices: SS [WJ_NUM_MATRICES_SS], PR [WJ_NUM_MATRICES_PR]
- Editing: SS [WJ_EDITING_SS], PR [WJ_EDITING_PR]
- Word Reading Fluency: SS [WJ_WORD_READ_FLU_SS], PR [WJ_WORD_READ_FLU_PR]
- Spelling of Sounds: SS [WJ_SPELL_SOUNDS_SS], PR [WJ_SPELL_SOUNDS_PR]
- Reading Vocabulary: SS [WJ_READ_VOCAB_SS], PR [WJ_READ_VOCAB_PR]
- Science: SS [WJ_SCIENCE_SS], PR [WJ_SCIENCE_PR]
- Social Studies: SS [WJ_SOCIAL_STUDIES_SS], PR [WJ_SOCIAL_STUDIES_PR]
- Humanities: SS [WJ_HUMANITIES_SS], PR [WJ_HUMANITIES_PR]
[IF_INCLUDE_EXTENDED_BATTERY_END]

## Narrative Interpretation of Academic Scores
[NARRATIVE_INTERPRETATION]

## Summary of Findings
[SUMMARY_OF_FINDINGS]

## Recommendations
[RECOMMENDATIONS]`
        },
        {
          id: 'academic-wiat',
          name: 'WIAT-4 (Placeholder)',
          description: 'Wechsler Individual Achievement Test.',
          content: `# WIAT-4 ACADEMIC ACHIEVEMENT REPORT

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
Wechsler Individual Achievement Test - Fourth Edition (WIAT-4)

## Test Results & Interpretation
### WIAT-4 Composite Scores
- Total Achievement: SS [WIAT_TOTAL_SS], PR [WIAT_TOTAL_PR]
- Basic Reading: SS [WIAT_BASIC_READ_SS], PR [WIAT_BASIC_READ_PR]
- Reading Comprehension and Fluency: SS [WIAT_READ_COMP_SS], PR [WIAT_READ_COMP_PR]
- Written Expression: SS [WIAT_WRITTEN_EXP_SS], PR [WIAT_WRITTEN_EXP_PR]
- Mathematics: SS [WIAT_MATH_SS], PR [WIAT_MATH_PR]

## Summary of Findings
[SUMMARY_OF_FINDINGS]

## Recommendations
[RECOMMENDATIONS]`
        }
      ]
    },
    {
      categoryId: 'cognitive',
      categoryName: 'Cognitive Processing Reports',
      categoryDescription: 'Assessments of cognitive abilities.',
      icon: Brain,
      subTemplates: [
        {
          id: 'cognitive-general',
          name: 'General Cognitive Profile',
          description: 'Overview of cognitive functioning.',
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
[ASSESSMENT_INSTRUMENTS]

## Test Results & Interpretation
### Cognitive Abilities
Full Scale IQ (FSIQ): [FSIQ_SCORE]

## Summary of Cognitive Strengths and Weaknesses
[SUMMARY_OF_FINDINGS]

## Recommendations
[RECOMMENDATIONS]`
        }
      ]
    },
    {
      categoryId: 'speech',
      categoryName: 'Speech & Language Reports',
      categoryDescription: 'Communication assessments.',
      icon: MessageSquare,
      subTemplates: [
        {
          id: 'speech-general',
          name: 'General Speech & Language Evaluation',
          description: 'Comprehensive communication assessment.',
          content: `# SPEECH AND LANGUAGE EVALUATION REPORT

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

## Assessment Methods
[ASSESSMENT_INSTRUMENTS]

## Test Results & Interpretation
### Communication Skills
[NARRATIVE_INTERPRETATION]

## Summary of Findings
[SUMMARY_OF_FINDINGS]

## Recommendations
[RECOMMENDATIONS]`
        }
      ]
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportContent, setReportContent] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    dateOfBirth: '',
    dateOfEvaluation: '',
    grade: '',
    examiner: '',
    reasonForReferral: '',
    backgroundInfo: '',
    assessmentInstruments: '',
    behavioralObservations: '',
    narrativeInterpretation: '',
    summaryOfFindings: '',
    recommendations: '',
    wjBroadSs: '',
    wjBroadPr: '',
    wjBroadRange: '',
    wjReadingSs: '',
    wjReadingPr: '',
    wjReadingRange: '',
    wjWrittenSs: '',
    wjWrittenPr: '',
    wjWrittenRange: '',
    wjMathSs: '',
    wjMathPr: '',
    wjMathRange: '',
    wjLetterWordSs: '',
    wjLetterWordPr: '',
    wjAppliedProblemsSs: '',
    wjAppliedProblemsPr: '',
    wjSpellingSs: '',
    wjSpellingPr: '',
    wjPassageCompSs: '',
    wjPassageCompPr: '',
    wjCalculationSs: '',
    wjCalculationPr: '',
    wjWritingSamplesSs: '',
    wjWritingSamplesPr: '',
    wjWordAttackSs: '',
    wjWordAttackPr: '',
    wjOralReadingSs: '',
    wjOralReadingPr: '',
    wjSentReadFluSs: '',
    wjSentReadFluPr: '',
    wjMathFactsFluSs: '',
    wjMathFactsFluPr: '',
    wjSentWriteFluSs: '',
    wjSentWriteFluPr: '',
    includeExtendedBattery: false,
    wjReadRecallSs: '',
    wjReadRecallPr: '',
    wjNumMatricesSs: '',
    wjNumMatricesPr: '',
    wjEditingSs: '',
    wjEditingPr: '',
    wjWordReadFluSs: '',
    wjWordReadFluPr: '',
    wjSpellSoundsSs: '',
    wjSpellSoundsPr: '',
    wjReadVocabSs: '',
    wjReadVocabPr: '',
    wjScienceSs: '',
    wjSciencePr: '',
    wjSocialStudiesSs: '',
    wjSocialStudiesPr: '',
    wjHumanitiesSs: '',
    wjHumanitiesPr: ''
  });

  // Convert camelCase to UPPER_SNAKE_CASE for placeholder replacement
  const toUpperSnakeCase = (str: string): string => {
    return str.replace(/([A-Z])/g, '_$1').toUpperCase();
  };

  // Get template content by ID
  const getTemplateById = (templateId: string): SubTemplate | null => {
    for (const category of templateCategories) {
      const template = category.subTemplates.find(t => t.id === templateId);
      if (template) return template;
    }
    return null;
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportContent(template.content);
    }
  };

  // Handle form field changes
  const handleFormChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generate report with form data
  const generateReport = () => {
    if (!selectedTemplate) return;

    const template = getTemplateById(selectedTemplate);
    if (!template) return;

    let content = template.content;

    // Replace placeholders with form data
    Object.entries(formData).forEach(([key, value]) => {
      const placeholder = `[${toUpperSnakeCase(key)}]`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // Handle conditional sections for extended battery
    if (formData.includeExtendedBattery) {
      content = content.replace(/\[IF_INCLUDE_EXTENDED_BATTERY_START\]/g, '');
      content = content.replace(/\[IF_INCLUDE_EXTENDED_BATTERY_END\]/g, '');
    } else {
      // Remove the entire extended battery section
      content = content.replace(/\[IF_INCLUDE_EXTENDED_BATTERY_START\][\s\S]*?\[IF_INCLUDE_EXTENDED_BATTERY_END\]/g, '');
    }

    setReportContent(content);
  };

  // Save draft
  const saveDraft = () => {
    const draftData: DraftData = {
      formData,
      selectedTemplate,
      reportContent,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('reportDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('reportDraft');
    if (savedDraft) {
      try {
        const draftData: DraftData = JSON.parse(savedDraft);
        setFormData(draftData.formData);
        setSelectedTemplate(draftData.selectedTemplate);
        setReportContent(draftData.reportContent);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }

    // Handle template from URL params
    const urlParams = new URLSearchParams(location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
      handleTemplateSelect(templateParam);
    }
  }, [location.search]);

  // Save final report
  const saveReport = () => {
    if (!selectedTemplate || !formData.studentName) {
      alert('Please select a template and enter student name');
      return;
    }

    const template = getTemplateById(selectedTemplate);
    if (!template) return;

    addReport({
      id: Date.now(),
      name: `${formData.studentName} - ${template.name}`,
      type: template.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      content: reportContent,
      formData
    });

    // Clear draft
    localStorage.removeItem('reportDraft');
    navigate('/reports');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/reports')}
          className="btn border border-border hover:bg-bg-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Reports
        </button>
        <h1 className="text-2xl font-medium">Create New Report</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="card">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <FileText className="text-gold" size={20} />
              Select Template
            </h2>
            
            <div className="space-y-4">
              {templateCategories.map((category) => (
                <div key={category.categoryId} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {category.icon && <category.icon className="text-gold\" size={20} />}
                    <div>
                      <h3 className="font-medium">{category.categoryName}</h3>
                      <p className="text-sm text-text-secondary">{category.categoryDescription}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {category.subTemplates.map((template) => (
                      <label
                        key={template.id}
                        className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-gold bg-gold bg-opacity-10'
                            : 'border-border hover:border-gold hover:bg-gold hover:bg-opacity-5'
                        }`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={template.id}
                          checked={selectedTemplate === template.id}
                          onChange={() => handleTemplateSelect(template.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-text-secondary">{template.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Information Form */}
          {selectedTemplate && (
            <div className="card">
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <User className="text-gold" size={20} />
                Student Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student Name</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleFormChange('studentName', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Evaluation</label>
                  <input
                    type="date"
                    value={formData.dateOfEvaluation}
                    onChange={(e) => handleFormChange('dateOfEvaluation', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => handleFormChange('grade', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Examiner</label>
                  <input
                    type="text"
                    value={formData.examiner}
                    onChange={(e) => handleFormChange('examiner', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WJ IV Specific Fields */}
          {selectedTemplate === 'academic-wjiv' && (
            <div className="card">
              <h2 className="text-xl font-medium mb-4">WJ IV Test Scores</h2>
              
              {/* Cluster Scores */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Cluster Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Broad Achievement SS</label>
                    <input
                      type="text"
                      value={formData.wjBroadSs}
                      onChange={(e) => handleFormChange('wjBroadSs', e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Broad Achievement PR</label>
                    <input
                      type="text"
                      value={formData.wjBroadPr}
                      onChange={(e) => handleFormChange('wjBroadPr', e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Broad Achievement Range</label>
                    <input
                      type="text"
                      value={formData.wjBroadRange}
                      onChange={(e) => handleFormChange('wjBroadRange', e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Extended Battery Option */}
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.includeExtendedBattery}
                    onChange={(e) => handleFormChange('includeExtendedBattery', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Include Extended Battery Subtests</span>
                </label>
              </div>
            </div>
          )}

          {/* Report Content Fields */}
          {selectedTemplate && (
            <div className="card">
              <h2 className="text-xl font-medium mb-4">Report Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Reason for Referral</label>
                  <textarea
                    value={formData.reasonForReferral}
                    onChange={(e) => handleFormChange('reasonForReferral', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Background Information</label>
                  <textarea
                    value={formData.backgroundInfo}
                    onChange={(e) => handleFormChange('backgroundInfo', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Summary of Findings</label>
                  <textarea
                    value={formData.summaryOfFindings}
                    onChange={(e) => handleFormChange('summaryOfFindings', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Recommendations</label>
                  <textarea
                    value={formData.recommendations}
                    onChange={(e) => handleFormChange('recommendations', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedTemplate && (
            <div className="flex gap-3">
              <button
                onClick={generateReport}
                className="btn bg-accent-gold text-black flex items-center gap-2"
              >
                <FileText size={16} />
                Generate Report
              </button>
              <button
                onClick={saveDraft}
                className="btn border border-border hover:bg-bg-secondary flex items-center gap-2"
              >
                <Save size={16} />
                Save Draft
              </button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Report Preview</h2>
            {reportContent && (
              <button
                onClick={saveReport}
                className="btn bg-accent-gold text-black flex items-center gap-2"
              >
                <Save size={16} />
                Save Report
              </button>
            )}
          </div>
          
          {reportContent ? (
            <div className="bg-bg-secondary p-4 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[800px]">
              {reportContent}
            </div>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={40} className="mx-auto mb-2 opacity-30" />
              <p>Select a template and fill in the form to generate a report preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;