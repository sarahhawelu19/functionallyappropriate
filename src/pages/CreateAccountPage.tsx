import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, User, Briefcase, Settings, Shield, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  // Basic Information
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  
  // Role & Experience
  profession: string[];
  otherProfession: string;
  studentTypes: string[];
  yearsExperience: string;
  schoolSetting: string[];
  otherSchoolSetting: string;
  caseloadSize: string;
  biggestChallenges: string;
  
  // Comfort & Needs
  schedulingComfort: number;
  schedulingChallenges: string;
  goalWritingComfort: number;
  goalWritingChallenges: string;
  reportDraftingComfort: number;
  reportDraftingChallenges: string;
  
  // Preferences
  receiveUpdates: boolean;
}

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    profession: [],
    otherProfession: '',
    studentTypes: [],
    yearsExperience: '',
    schoolSetting: [],
    otherSchoolSetting: '',
    caseloadSize: '',
    biggestChallenges: '',
    schedulingComfort: 3,
    schedulingChallenges: '',
    goalWritingComfort: 3,
    goalWritingChallenges: '',
    reportDraftingComfort: 3,
    reportDraftingChallenges: '',
    receiveUpdates: false,
  });

  const totalSteps = 4;

  const professionOptions = [
    'Special Education Teacher',
    'Speech Language Pathologist',
    'Occupational Therapist',
    'Behavior Specialist',
    'School Psychologist',
    'Physical Therapist',
    'Other'
  ];

  const studentTypeOptions = [
    'Mild/Moderate Disabilities',
    'Extensive Support Needs (ESN)',
    'Both'
  ];

  const schoolSettingOptions = [
    'Preschool/PreK',
    'Elementary School',
    'Middle School',
    'High School',
    'District-wide',
    'Other'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: 'profession' | 'studentTypes' | 'schoolSetting', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.confirmPassword && 
                 formData.firstName && formData.lastName && 
                 formData.password === formData.confirmPassword);
      case 2:
        return !!(formData.profession.length > 0 && formData.studentTypes.length > 0 && 
                 formData.yearsExperience && formData.caseloadSize);
      case 3:
        return true; // All fields are optional but encouraged
      case 4:
        return true; // Final review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Redirect to personalize dashboard page
    navigate('/personalize-dashboard');
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User size={20} />;
      case 2: return <Briefcase size={20} />;
      case 3: return <Settings size={20} />;
      case 4: return <CheckCircle size={20} />;
      default: return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Your Role & Experience';
      case 3: return 'Comfort & Needs Assessment';
      case 4: return 'Review & Create Account';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Let\'s start with your basic account information';
      case 2: return 'Tell us about your professional background';
      case 3: return 'Help us understand your current workflow challenges';
      case 4: return 'Review your information and complete your account setup';
      default: return '';
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Welcome to BetterSped!
        </h3>
        <p className="text-text-secondary">
          {getStepDescription(1)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
          placeholder="Enter your email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
            placeholder="Create a secure password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Tell us about your role
        </h3>
        <p className="text-text-secondary">
          {getStepDescription(2)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Profession/Role * (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {professionOptions.map((option) => (
            <label key={option} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-purple/30 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={formData.profession.includes(option)}
                onChange={() => handleMultiSelect('profession', option)}
                className="w-4 h-4 text-purple border-border rounded focus:ring-purple"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
        {formData.profession.includes('Other') && (
          <input
            type="text"
            value={formData.otherProfession}
            onChange={(e) => handleInputChange('otherProfession', e.target.value)}
            className="mt-3 w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
            placeholder="Please specify your profession"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Student Population * (Select all that apply)
        </label>
        <div className="space-y-3">
          {studentTypeOptions.map((option) => (
            <label key={option} className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-purple/30 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={formData.studentTypes.includes(option)}
                onChange={() => handleMultiSelect('studentTypes', option)}
                className="w-4 h-4 text-purple border-border rounded focus:ring-purple mt-0.5"
              />
              <div>
                <span className="text-sm font-medium">{option}</span>
                {option === 'Mild/Moderate Disabilities' && (
                  <p className="text-xs text-text-secondary mt-1">
                    Students with learning disabilities, mild intellectual disabilities, autism spectrum disorders, etc.
                  </p>
                )}
                {option === 'Extensive Support Needs (ESN)' && (
                  <p className="text-xs text-text-secondary mt-1">
                    Students requiring intensive, ongoing support across multiple life domains
                  </p>
                )}
                {option === 'Both' && (
                  <p className="text-xs text-text-secondary mt-1">
                    I work with students across the full spectrum of support needs
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Years of Experience in Special Education *
          </label>
          <select
            value={formData.yearsExperience}
            onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
          >
            <option value="">Select experience level</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="4-7">4-7 years</option>
            <option value="8-15">8-15 years</option>
            <option value="15-plus">15+ years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Number of Students on Your Caseload *
          </label>
          <select
            value={formData.caseloadSize}
            onChange={(e) => handleInputChange('caseloadSize', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
          >
            <option value="">Select caseload size</option>
            <option value="0-10">0-10 students</option>
            <option value="11-25">11-25 students</option>
            <option value="26-50">26-50 students</option>
            <option value="51-75">51-75 students</option>
            <option value="75-plus">75+ students</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Primary School Setting (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schoolSettingOptions.map((option) => (
            <label key={option} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-purple/30 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={formData.schoolSetting.includes(option)}
                onChange={() => handleMultiSelect('schoolSetting', option)}
                className="w-4 h-4 text-purple border-border rounded focus:ring-purple"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
        {formData.schoolSetting.includes('Other') && (
          <input
            type="text"
            value={formData.otherSchoolSetting}
            onChange={(e) => handleInputChange('otherSchoolSetting', e.target.value)}
            className="mt-3 w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
            placeholder="Please specify your school setting"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          What are your biggest challenges as a special education professional today?
        </label>
        <textarea
          value={formData.biggestChallenges}
          onChange={(e) => handleInputChange('biggestChallenges', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all resize-none"
          placeholder="e.g., Time management for IEPs, report writing, data tracking, collaboration with general education teachers..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Help us understand your workflow
        </h3>
        <p className="text-text-secondary">
          {getStepDescription(3)}
        </p>
      </div>

      {/* Scheduling */}
      <div className="p-6 border border-border rounded-xl bg-teal/5">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-teal/20 rounded-lg flex items-center justify-center">
            <span className="text-teal font-semibold text-sm">S</span>
          </div>
          <h4 className="text-lg font-medium text-text-primary">Scheduling IEP Meetings & Deadlines</h4>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-3">
            How comfortable are you with your current scheduling process?
          </label>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="schedulingComfort"
                  value={rating}
                  checked={formData.schedulingComfort === rating}
                  onChange={() => handleInputChange('schedulingComfort', rating)}
                  className="w-4 h-4 text-teal border-border focus:ring-teal"
                />
                <span className="text-xs text-text-secondary mt-1 text-center">
                  {rating === 1 ? 'Very Uncomfortable' : rating === 5 ? 'Very Comfortable' : rating}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            What are your primary pain points in scheduling?
          </label>
          <textarea
            value={formData.schedulingChallenges}
            onChange={(e) => handleInputChange('schedulingChallenges', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all resize-none"
            placeholder="e.g., Coordinating with multiple team members, tracking due dates, finding available meeting times..."
          />
        </div>
      </div>

      {/* Goal Writing */}
      <div className="p-6 border border-border rounded-xl bg-green/5">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-green/20 rounded-lg flex items-center justify-center">
            <span className="text-green font-semibold text-sm">G</span>
          </div>
          <h4 className="text-lg font-medium text-text-primary">IEP Goal Writing</h4>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-3">
            How comfortable are you with drafting clear, measurable IEP goals?
          </label>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="goalWritingComfort"
                  value={rating}
                  checked={formData.goalWritingComfort === rating}
                  onChange={() => handleInputChange('goalWritingComfort', rating)}
                  className="w-4 h-4 text-green border-border focus:ring-green"
                />
                <span className="text-xs text-text-secondary mt-1 text-center">
                  {rating === 1 ? 'Very Uncomfortable' : rating === 5 ? 'Very Comfortable' : rating}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            What challenges do you face when writing IEP goals?
          </label>
          <textarea
            value={formData.goalWritingChallenges}
            onChange={(e) => handleInputChange('goalWritingChallenges', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all resize-none"
            placeholder="e.g., Making goals measurable, aligning with standards, writing ambitious yet achievable goals..."
          />
        </div>
      </div>

      {/* Report Drafting */}
      <div className="p-6 border border-border rounded-xl bg-gold/5">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
            <span className="text-gold font-semibold text-sm">R</span>
          </div>
          <h4 className="text-lg font-medium text-text-primary">Report Drafting</h4>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-3">
            How comfortable are you with drafting comprehensive special education reports?
          </label>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="reportDraftingComfort"
                  value={rating}
                  checked={formData.reportDraftingComfort === rating}
                  onChange={() => handleInputChange('reportDraftingComfort', rating)}
                  className="w-4 h-4 text-gold border-border focus:ring-gold"
                />
                <span className="text-xs text-text-secondary mt-1 text-center">
                  {rating === 1 ? 'Very Uncomfortable' : rating === 5 ? 'Very Comfortable' : rating}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            What aspects of report drafting consume the most time or present the biggest hurdles?
          </label>
          <textarea
            value={formData.reportDraftingChallenges}
            onChange={(e) => handleInputChange('reportDraftingChallenges', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
            placeholder="e.g., Writing present levels, ensuring compliance, organizing data, creating comprehensive summaries..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Almost Ready!
        </h3>
        <p className="text-text-secondary">
          {getStepDescription(4)}
        </p>
      </div>

      <div className="bg-bg-secondary rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-text-secondary">Name:</span>
            <p className="text-text-primary">{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-text-secondary">Email:</span>
            <p className="text-text-primary">{formData.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-text-secondary">Role:</span>
            <p className="text-text-primary">{formData.profession.join(', ')}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-text-secondary">Student Population:</span>
            <p className="text-text-primary">{formData.studentTypes.join(', ')}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-text-secondary">Experience:</span>
            <p className="text-text-primary">{formData.yearsExperience.replace('-', ' to ')} years</p>
          </div>
          <div>
            <span className="text-sm font-medium text-text-secondary">Caseload:</span>
            <p className="text-text-primary">{formData.caseloadSize.replace('-', ' to ')} students</p>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl p-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.receiveUpdates}
            onChange={(e) => handleInputChange('receiveUpdates', e.target.checked)}
            className="w-5 h-5 text-purple border-border rounded focus:ring-purple mt-0.5"
          />
          <div>
            <span className="text-sm font-medium text-text-primary">
              Receive personalized tips and updates
            </span>
            <p className="text-xs text-text-secondary mt-1">
              Get customized recommendations based on your needs and preferences. You can unsubscribe at any time.
            </p>
          </div>
        </label>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center px-8 py-4 bg-purple text-white text-lg font-semibold rounded-xl hover:bg-purple/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Create My Account
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>

      <div className="text-center text-xs text-text-secondary">
        By creating an account, you agree to our{' '}
        <Link to="/privacy" className="text-purple hover:underline">Privacy Policy</Link>
        {' '}and{' '}
        <Link to="/terms" className="text-purple hover:underline">Terms of Service</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <span className="text-xl font-semibold">BetterSped</span>
            </Link>
            <Link 
              to="/" 
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  step <= currentStep 
                    ? 'bg-purple border-purple text-white' 
                    : 'border-border text-text-secondary'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                {step < totalSteps && (
                  <div className={`w-full h-0.5 mx-4 transition-all ${
                    step < currentStep ? 'bg-purple' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {getStepTitle(currentStep)}
            </h1>
            <p className="text-text-secondary">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-bg-primary border border-border rounded-2xl p-8 shadow-lg">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'text-text-secondary cursor-not-allowed'
                    : 'text-text-primary hover:bg-bg-secondary'
                }`}
              >
                <ArrowLeft className="mr-2" size={20} />
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  validateStep(currentStep)
                    ? 'bg-purple text-white hover:bg-purple/90'
                    : 'bg-bg-secondary text-text-secondary cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary max-w-2xl mx-auto">
            Your information is secure and will only be used to personalize your experience. 
            We never share your data with third parties. Read our{' '}
            <Link to="/privacy" className="text-purple hover:underline">Privacy Policy</Link>
            {' '}for more details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;