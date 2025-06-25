import React, { useState } from 'react';
import { Upload, Plus, Check, Users, FileText, Settings, ArrowRight, Download, AlertCircle, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Student {
  id: number;
  // Personal Information
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  studentId: string;
  gender: string;
  ethnicity: string;
  grade: string;
  
  // Contact Information
  address: string;
  phone?: string;
  email?: string;
  emergencyContact: string;
  
  // Educational Information
  program: string;
  primaryDisability: string;
  secondaryDisability?: string;
  iepDate: string;
  nextReview: string;
  evaluationDate: string;
  placement: string;
  caseManager: string;
  
  // Medical Information
  medications: string[];
  allergies: string[];
  medicalConditions: string[];
  accommodations: string[];
  
  // Parent/Guardian Information
  parent1Name: string;
  parent1Email: string;
  parent1Phone: string;
  parent2Name?: string;
  parent2Email?: string;
  parent2Phone?: string;
}

const PersonalizeDashboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    personal: true,
    contact: false,
    educational: false,
    medical: false,
    parents: false
  });

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    studentId: '',
    gender: '',
    ethnicity: '',
    grade: '',
    
    // Contact Information
    address: '',
    phone: '',
    email: '',
    emergencyContact: '',
    
    // Educational Information
    program: '',
    primaryDisability: '',
    secondaryDisability: '',
    iepDate: '',
    nextReview: '',
    evaluationDate: '',
    placement: '',
    caseManager: '',
    
    // Medical Information
    medications: '',
    allergies: '',
    medicalConditions: '',
    accommodations: '',
    
    // Parent/Guardian Information
    parent1Name: '',
    parent1Email: '',
    parent1Phone: '',
    parent2Name: '',
    parent2Email: '',
    parent2Phone: '',
  });

  const grades = [
    'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ];

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  
  const ethnicityOptions = [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Hispanic/Latino',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Two or More Races',
    'Prefer not to say'
  ];

  const programOptions = [
    'Resource Support',
    'Self-Contained',
    'Inclusion',
    'Extensive Support Needs (ESN)',
    'Related Services Only'
  ];

  const disabilityOptions = [
    'Specific Learning Disability',
    'Intellectual Disability',
    'Autism Spectrum Disorder',
    'Emotional Disturbance',
    'Speech or Language Impairment',
    'Visual Impairment',
    'Hearing Impairment',
    'Orthopedic Impairment',
    'Other Health Impairment',
    'Multiple Disabilities',
    'Deaf-Blindness',
    'Traumatic Brain Injury',
    'Developmental Delay'
  ];

  const placementOptions = [
    'General Education with Resource Support',
    'General Education with Inclusion Support',
    'Special Education Classroom',
    'Separate School',
    'Home/Hospital',
    'Residential Facility'
  ];

  // Essential columns for basic functionality
  const essentialColumns = [
    'Student First Name',
    'Student Last Name',
    'Date of Birth',
    'Student ID',
    'Grade',
    'Case Manager',
    'Parent 1 Name',
    'Parent 1 Email',
    'Parent 1 Phone'
  ];

  // Comprehensive columns for full demographics
  const comprehensiveColumns = [
    'Preferred Name',
    'Gender',
    'Ethnicity',
    'Address',
    'Emergency Contact',
    'Program',
    'Primary Disability',
    'Secondary Disability',
    'IEP Date',
    'Next Review Date',
    'Evaluation Date',
    'Placement',
    'Medications (semicolon separated)',
    'Allergies (semicolon separated)',
    'Medical Conditions (semicolon separated)',
    'Accommodations (semicolon separated)',
    'Parent 2 Name',
    'Parent 2 Email',
    'Parent 2 Phone'
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return !!(formData.firstName && formData.lastName && formData.dateOfBirth && 
                 formData.studentId && formData.grade);
      case 2: // Contact Information
        return !!(formData.address && formData.emergencyContact);
      case 3: // Educational Information
        return !!(formData.program && formData.primaryDisability && formData.iepDate && 
                 formData.placement && formData.caseManager);
      case 4: // Medical Information (optional)
        return true;
      case 5: // Parent Information
        return !!(formData.parent1Name && formData.parent1Email && formData.parent1Phone);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      // Auto-expand next section
      const sections = ['personal', 'contact', 'educational', 'medical', 'parents'];
      if (sections[currentStep]) {
        setExpandedSections(prev => ({
          ...prev,
          [sections[currentStep - 1]]: false,
          [sections[currentStep]]: true
        }));
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Auto-expand previous section
      const sections = ['personal', 'contact', 'educational', 'medical', 'parents'];
      if (sections[currentStep - 2]) {
        setExpandedSections(prev => ({
          ...prev,
          [sections[currentStep - 1]]: false,
          [sections[currentStep - 2]]: true
        }));
      }
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent: Student = {
      id: students.length + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      preferredName: formData.preferredName || undefined,
      dateOfBirth: formData.dateOfBirth,
      studentId: formData.studentId,
      gender: formData.gender,
      ethnicity: formData.ethnicity,
      grade: formData.grade,
      address: formData.address,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      emergencyContact: formData.emergencyContact,
      program: formData.program,
      primaryDisability: formData.primaryDisability,
      secondaryDisability: formData.secondaryDisability || undefined,
      iepDate: formData.iepDate,
      nextReview: formData.nextReview,
      evaluationDate: formData.evaluationDate,
      placement: formData.placement,
      caseManager: formData.caseManager,
      medications: formData.medications ? formData.medications.split(';').map(m => m.trim()).filter(m => m) : [],
      allergies: formData.allergies ? formData.allergies.split(';').map(a => a.trim()).filter(a => a) : [],
      medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(';').map(c => c.trim()).filter(c => c) : [],
      accommodations: formData.accommodations ? formData.accommodations.split(';').map(a => a.trim()).filter(a => a) : [],
      parent1Name: formData.parent1Name,
      parent1Email: formData.parent1Email,
      parent1Phone: formData.parent1Phone,
      parent2Name: formData.parent2Name || undefined,
      parent2Email: formData.parent2Email || undefined,
      parent2Phone: formData.parent2Phone || undefined,
    };

    setStudents(prev => [...prev, newStudent]);
    
    // Reset form and step
    setFormData({
      firstName: '', lastName: '', preferredName: '', dateOfBirth: '', studentId: '', gender: '', ethnicity: '', grade: '',
      address: '', phone: '', email: '', emergencyContact: '',
      program: '', primaryDisability: '', secondaryDisability: '', iepDate: '', nextReview: '', evaluationDate: '', placement: '', caseManager: '',
      medications: '', allergies: '', medicalConditions: '', accommodations: '',
      parent1Name: '', parent1Email: '', parent1Phone: '', parent2Name: '', parent2Email: '', parent2Phone: '',
    });
    
    setCurrentStep(1);
    setExpandedSections({ personal: true, contact: false, educational: false, medical: false, parents: false });

    // Show success message
    setTimeout(() => {
      const successMsg = document.getElementById('success-message');
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 3000);
      }
    }, 100);
  };

  const handleFileUpload = (file: File) => {
    setUploadStatus('uploading');
    
    // Simulate file processing
    setTimeout(() => {
      // Mock successful upload with comprehensive sample students
      const mockStudents: Student[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Smith',
          preferredName: 'Johnny',
          dateOfBirth: '2015-03-15',
          studentId: 'STU-2025-001',
          gender: 'Male',
          ethnicity: 'Hispanic/Latino',
          grade: '3rd Grade',
          address: '123 Main Street, Anytown, ST 12345',
          phone: '(555) 123-4567',
          emergencyContact: 'Maria Smith - (555) 987-6543',
          program: 'Resource Support',
          primaryDisability: 'Specific Learning Disability',
          secondaryDisability: 'ADHD',
          iepDate: '2024-09-15',
          nextReview: '2025-09-15',
          evaluationDate: '2024-08-01',
          placement: 'General Education with Resource Support',
          caseManager: 'Sarah Johnson',
          medications: ['Adderall XR 10mg - Morning', 'Melatonin 3mg - Bedtime'],
          allergies: ['Peanuts', 'Tree Nuts'],
          medicalConditions: ['ADHD', 'Mild Asthma'],
          accommodations: ['Extended time', 'Frequent breaks', 'Preferential seating'],
          parent1Name: 'Maria Smith',
          parent1Email: 'maria.smith@email.com',
          parent1Phone: '(555) 123-4567',
        },
        {
          id: 2,
          firstName: 'Emily',
          lastName: 'Johnson',
          dateOfBirth: '2014-07-22',
          studentId: 'STU-2025-002',
          gender: 'Female',
          ethnicity: 'White',
          grade: '4th Grade',
          address: '456 Oak Avenue, Anytown, ST 12345',
          emergencyContact: 'David Johnson - (555) 234-5678',
          program: 'Inclusion',
          primaryDisability: 'Autism Spectrum Disorder',
          iepDate: '2024-10-10',
          nextReview: '2025-10-10',
          evaluationDate: '2024-09-15',
          placement: 'General Education with Inclusion Support',
          caseManager: 'Sarah Johnson',
          medications: [],
          allergies: ['Dairy'],
          medicalConditions: ['Autism Spectrum Disorder'],
          accommodations: ['Visual schedules', 'Sensory breaks', 'Modified assignments'],
          parent1Name: 'David Johnson',
          parent1Email: 'david.johnson@email.com',
          parent1Phone: '(555) 234-5678',
          parent2Name: 'Lisa Johnson',
          parent2Email: 'lisa.johnson@email.com',
          parent2Phone: '(555) 234-5679',
        }
      ];
      
      setStudents(mockStudents);
      setUploadStatus('success');
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create comprehensive CSV template
    const headers = [...essentialColumns, ...comprehensiveColumns];
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bettersped_comprehensive_student_roster_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderFormSection = (
    sectionKey: string,
    title: string,
    stepNumber: number,
    children: React.ReactNode,
    isRequired: boolean = true
  ) => {
    const isExpanded = expandedSections[sectionKey];
    const isCompleted = validateStep(stepNumber);
    const isCurrent = currentStep === stepNumber;
    
    return (
      <div className={`border rounded-lg transition-all ${
        isCurrent ? 'border-purple bg-purple/5' : 
        isCompleted ? 'border-green bg-green/5' : 
        'border-border'
      }`}>
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-bg-secondary transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              isCompleted ? 'bg-green text-white' :
              isCurrent ? 'bg-purple text-white' :
              'bg-bg-secondary text-text-secondary'
            }`}>
              {isCompleted ? <Check size={16} /> : stepNumber}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{title}</h3>
              {!isRequired && <span className="text-xs text-text-secondary">(Optional)</span>}
            </div>
          </div>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple rounded-lg flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <span className="text-xl font-semibold">BetterSped</span>
            </div>
            <div className="text-sm text-text-secondary">
              Step 1 of 2: Add Students
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            ⚠️ Warning: May cause extreme organization.
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-purple mb-6">
            Welcome to BetterSped!
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Adding comprehensive student data enables BetterSped to provide powerful insights and streamlined workflows. 
            Start with essential information and add more details as needed.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-2 font-medium text-purple">Add Students</span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-border text-text-secondary rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-text-secondary">Enhance Profiles</span>
            </div>
          </div>
        </div>

        {/* Students Added Counter */}
        {students.length > 0 && (
          <div className="mb-8 p-4 bg-green/10 border border-green/20 rounded-xl">
            <div className="flex items-center justify-center space-x-2">
              <Check className="text-green" size={20} />
              <span className="font-medium text-green">
                {students.length} student{students.length !== 1 ? 's' : ''} added successfully!
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Option 1: Upload Spreadsheet */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple/20 rounded-lg flex items-center justify-center">
                <Upload className="text-purple" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Option 1: Upload Your Student Roster
                </h3>
                <p className="text-sm text-green font-medium">(Recommended for multiple students)</p>
              </div>
            </div>
            
            <p className="text-text-secondary mb-6">
              Import comprehensive student data including demographics, educational information, and contact details.
            </p>

            {/* Essential vs Comprehensive Columns */}
            <div className="mb-6 space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2 mb-3">
                  <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300">Essential Columns (Required):</h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                      These columns are required for basic functionality:
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {essentialColumns.map((column, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">{column}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  Additional Columns (Optional but Recommended):
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                  Include these for comprehensive student profiles:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {comprehensiveColumns.slice(0, 8).map((column, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">{column}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  ...and {comprehensiveColumns.length - 8} more columns for complete demographics
                </p>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-purple bg-purple/5' 
                  : uploadStatus === 'success'
                  ? 'border-green bg-green/5'
                  : 'border-border hover:border-purple/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadStatus === 'uploading' ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-purple font-medium">Processing your file...</p>
                </div>
              ) : uploadStatus === 'success' ? (
                <div className="space-y-4">
                  <Check className="w-12 h-12 text-green mx-auto" />
                  <p className="text-green font-medium">File uploaded successfully!</p>
                  <p className="text-sm text-text-secondary">{students.length} students imported</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-text-secondary mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-text-primary mb-2">
                      Drop your spreadsheet here or click to browse
                    </p>
                    <p className="text-sm text-text-secondary">
                      Accepted formats: .csv, .xlsx, .xls
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 bg-purple text-white font-semibold rounded-lg hover:bg-purple/90 transition-colors cursor-pointer"
                  >
                    <Upload className="mr-2" size={20} />
                    Upload Student Roster
                  </label>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center text-sm text-purple hover:underline"
              >
                <Download className="mr-1" size={16} />
                Download Comprehensive Template
              </button>
            </div>
          </div>

          {/* Option 2: Manual Entry */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple/20 rounded-lg flex items-center justify-center">
                <Plus className="text-purple" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Option 2: Add Student Manually
                </h3>
                <p className="text-sm text-text-secondary">Complete student profile with all demographics</p>
              </div>
            </div>

            {!showManualForm ? (
              <button
                onClick={() => setShowManualForm(true)}
                className="w-full py-4 border-2 border-dashed border-border hover:border-purple/50 rounded-lg text-text-secondary hover:text-purple transition-all"
              >
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium">Click to add a student manually</span>
              </button>
            ) : (
              <form onSubmit={handleAddStudent} className="space-y-6">
                {/* Success Message */}
                <div id="success-message" className="hidden p-3 bg-green/10 border border-green/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="text-green" size={16} />
                    <span className="text-green font-medium">
                      Student {formData.firstName} {formData.lastName} added successfully!
                    </span>
                  </div>
                </div>

                {/* Form Progress */}
                <div className="flex items-center justify-between mb-6 p-3 bg-bg-secondary rounded-lg">
                  <span className="text-sm font-medium">Step {currentStep} of 5</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full ${
                          step <= currentStep ? 'bg-purple' : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                {renderFormSection('personal', 'Personal Information', 1, (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Preferred Name
                        </label>
                        <input
                          type="text"
                          value={formData.preferredName}
                          onChange={(e) => handleInputChange('preferredName', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Student ID *
                        </label>
                        <input
                          type="text"
                          value={formData.studentId}
                          onChange={(e) => handleInputChange('studentId', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Gender
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Grade *
                        </label>
                        <select
                          value={formData.grade}
                          onChange={(e) => handleInputChange('grade', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        >
                          <option value="">Select Grade</option>
                          {grades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Ethnicity
                      </label>
                      <select
                        value={formData.ethnicity}
                        onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                      >
                        <option value="">Select Ethnicity</option>
                        {ethnicityOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {/* Contact Information */}
                {renderFormSection('contact', 'Contact Information', 2, (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        rows={2}
                        placeholder="Street, City, State, ZIP"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="student@school.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Emergency Contact *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="Name - Phone Number"
                        required
                      />
                    </div>
                  </div>
                ))}

                {/* Educational Information */}
                {renderFormSection('educational', 'Educational Information', 3, (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Program *
                        </label>
                        <select
                          value={formData.program}
                          onChange={(e) => handleInputChange('program', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        >
                          <option value="">Select Program</option>
                          {programOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Case Manager *
                        </label>
                        <input
                          type="text"
                          value={formData.caseManager}
                          onChange={(e) => handleInputChange('caseManager', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="Your name or assigned case manager"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Primary Disability *
                        </label>
                        <select
                          value={formData.primaryDisability}
                          onChange={(e) => handleInputChange('primaryDisability', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        >
                          <option value="">Select Primary Disability</option>
                          {disabilityOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Secondary Disability
                        </label>
                        <select
                          value={formData.secondaryDisability}
                          onChange={(e) => handleInputChange('secondaryDisability', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        >
                          <option value="">Select Secondary Disability</option>
                          {disabilityOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Placement *
                      </label>
                      <select
                        value={formData.placement}
                        onChange={(e) => handleInputChange('placement', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        required
                      >
                        <option value="">Select Placement</option>
                        {placementOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          IEP Date *
                        </label>
                        <input
                          type="date"
                          value={formData.iepDate}
                          onChange={(e) => handleInputChange('iepDate', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Next Review
                        </label>
                        <input
                          type="date"
                          value={formData.nextReview}
                          onChange={(e) => handleInputChange('nextReview', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Evaluation Date
                        </label>
                        <input
                          type="date"
                          value={formData.evaluationDate}
                          onChange={(e) => handleInputChange('evaluationDate', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ), true)}

                {/* Medical Information */}
                {renderFormSection('medical', 'Medical & Accommodations', 4, (
                  <div className="space-y-4">
                    <p className="text-sm text-text-secondary">
                      Separate multiple items with semicolons (;)
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Medications
                        </label>
                        <textarea
                          value={formData.medications}
                          onChange={(e) => handleInputChange('medications', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          rows={2}
                          placeholder="e.g., Adderall XR 10mg - Morning; Melatonin 3mg - Bedtime"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Allergies
                        </label>
                        <textarea
                          value={formData.allergies}
                          onChange={(e) => handleInputChange('allergies', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          rows={2}
                          placeholder="e.g., Peanuts; Tree Nuts; Dairy"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Medical Conditions
                        </label>
                        <textarea
                          value={formData.medicalConditions}
                          onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          rows={2}
                          placeholder="e.g., ADHD; Mild Asthma; Diabetes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Accommodations
                        </label>
                        <textarea
                          value={formData.accommodations}
                          onChange={(e) => handleInputChange('accommodations', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          rows={2}
                          placeholder="e.g., Extended time; Frequent breaks; Preferential seating"
                        />
                      </div>
                    </div>
                  </div>
                ), false)}

                {/* Parent Information */}
                {renderFormSection('parents', 'Parent/Guardian Information', 5, (
                  <div className="space-y-6">
                    {/* Parent 1 */}
                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium text-text-primary mb-3">Parent/Guardian 1 *</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={formData.parent1Name}
                            onChange={(e) => handleInputChange('parent1Name', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={formData.parent1Email}
                              onChange={(e) => handleInputChange('parent1Email', e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              value={formData.parent1Phone}
                              onChange={(e) => handleInputChange('parent1Phone', e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                              placeholder="(555) 123-4567"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent 2 */}
                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium text-text-primary mb-3">Parent/Guardian 2 (Optional)</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={formData.parent2Name}
                            onChange={(e) => handleInputChange('parent2Name', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.parent2Email}
                              onChange={(e) => handleInputChange('parent2Email', e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={formData.parent2Phone}
                              onChange={(e) => handleInputChange('parent2Phone', e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowManualForm(false)}
                      className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <X className="mr-1" size={16} />
                      Cancel
                    </button>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center px-4 py-2 border border-border rounded-lg hover:bg-bg-secondary transition-colors"
                      >
                        Previous
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep(currentStep)}
                        className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                          validateStep(currentStep)
                            ? 'bg-purple text-white hover:bg-purple/90'
                            : 'bg-bg-secondary text-text-secondary cursor-not-allowed'
                        }`}
                      >
                        Next
                        <ArrowRight className="ml-1" size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!validateStep(5)}
                        className={`flex items-center px-6 py-2 rounded-lg font-semibold transition-all ${
                          validateStep(5)
                            ? 'bg-purple text-white hover:bg-purple/90'
                            : 'bg-bg-secondary text-text-secondary cursor-not-allowed'
                        }`}
                      >
                        <Plus className="mr-2" size={20} />
                        Add Student
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Next Steps Section */}
        {students.length > 0 && (
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple/20 rounded-lg flex items-center justify-center">
                <Settings className="text-purple" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                What's Next for Your Student Profiles?
              </h3>
            </div>
            
            <p className="text-text-secondary mb-6">
              Your comprehensive student profiles are ready! You can now access detailed demographics, 
              track progress, and manage IEPs with all the information you've provided.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button className="p-4 border border-border rounded-lg hover:border-purple/30 transition-all text-left">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="text-purple" size={20} />
                  <span className="font-medium">Upload IEP Documents</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Import existing IEP documents to automatically populate goals and services
                </p>
              </button>
              
              <button className="p-4 border border-border rounded-lg hover:border-purple/30 transition-all text-left">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="text-purple" size={20} />
                  <span className="font-medium">Set Up Progress Tracking</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Configure data collection and progress monitoring for each student
                </p>
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center px-8 py-4 bg-purple text-white text-lg font-semibold rounded-xl hover:bg-purple/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        )}

        {/* Students List */}
        {students.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Added Students ({students.length})</h3>
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {student.firstName} {student.lastName}
                      {student.preferredName && ` (${student.preferredName})`}
                    </h4>
                    <div className="text-sm text-text-secondary space-y-1">
                      <p>{student.grade} • {student.program} • Case Manager: {student.caseManager}</p>
                      <p>Primary Disability: {student.primaryDisability}</p>
                      {student.iepDate && <p>IEP Date: {new Date(student.iepDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green/20 text-green text-sm rounded-full">
                      Complete Profile
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action for Empty State */}
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Ready to get started?
            </h3>
            <p className="text-text-secondary mb-6">
              Add your first student with comprehensive demographics using either upload or manual entry above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizeDashboardPage;