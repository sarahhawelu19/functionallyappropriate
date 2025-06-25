import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Calendar, FileText, Edit3, Save, X } from 'lucide-react';
import CollapsibleSection from '../../common/CollapsibleSection';

interface StudentInfo {
  personalInfo: {
    fullName: string;
    preferredName: string;
    dateOfBirth: string;
    age: string;
    grade: string;
    studentId: string;
    gender: string;
    ethnicity: string;
  };
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    emergencyContact: string;
  };
  educationalInfo: {
    program: string;
    primaryDisability: string;
    secondaryDisability: string;
    iepDate: string;
    nextReview: string;
    evaluationDate: string;
    placement: string;
  };
  medicalInfo: {
    medications: string[];
    allergies: string[];
    medicalConditions: string[];
    accommodations: string[];
  };
}

const DemographicsTab: React.FC = () => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    personalInfo: {
      fullName: 'John Michael Smith',
      preferredName: 'Johnny',
      dateOfBirth: '2015-03-15',
      age: '9 years old',
      grade: '3rd Grade',
      studentId: 'STU-2025-001',
      gender: 'Male',
      ethnicity: 'Hispanic/Latino',
    },
    contactInfo: {
      address: '123 Main Street, Anytown, ST 12345',
      phone: '(555) 123-4567',
      email: 'parent@email.com',
      emergencyContact: 'Maria Smith - (555) 987-6543',
    },
    educationalInfo: {
      program: 'Resource Support',
      primaryDisability: 'Specific Learning Disability',
      secondaryDisability: 'ADHD',
      iepDate: '2024-09-15',
      nextReview: '2025-09-15',
      evaluationDate: '2024-08-01',
      placement: 'General Education with Resource Support',
    },
    medicalInfo: {
      medications: ['Adderall XR 10mg - Morning', 'Melatonin 3mg - Bedtime'],
      allergies: ['Peanuts', 'Tree Nuts'],
      medicalConditions: ['ADHD', 'Mild Asthma'],
      accommodations: ['Extended time', 'Frequent breaks', 'Preferential seating'],
    }
  });

  const [tempData, setTempData] = useState<StudentInfo>(studentInfo);

  const handleEdit = (section: string) => {
    setEditMode(section);
    setTempData({ ...studentInfo });
  };

  const handleSave = (section: string) => {
    setStudentInfo({ ...tempData });
    setEditMode(null);
  };

  const handleCancel = () => {
    setTempData({ ...studentInfo });
    setEditMode(null);
  };

  const updateTempData = (section: keyof StudentInfo, field: string, value: any) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayField = (section: keyof StudentInfo, field: string, index: number, value: string) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].map((item: string, i: number) => 
          i === index ? value : item
        )
      }
    }));
  };

  const addArrayItem = (section: keyof StudentInfo, field: string) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section] as any)[field], '']
      }
    }));
  };

  const removeArrayItem = (section: keyof StudentInfo, field: string, index: number) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const renderEditableField = (
    section: keyof StudentInfo,
    field: string,
    label: string,
    value: string,
    type: 'text' | 'date' | 'select' = 'text',
    options?: string[]
  ) => {
    const isEditing = editMode === section;
    const currentValue = isEditing ? (tempData[section] as any)[field] : value;

    if (!isEditing) {
      return (
        <div>
          <label className="text-sm font-medium text-text-secondary">{label}</label>
          <p className="font-medium">{value}</p>
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div>
          <label className="text-sm font-medium text-text-secondary">{label}</label>
          <select
            value={currentValue}
            onChange={(e) => updateTempData(section, field, e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple mt-1"
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <input
          type={type}
          value={currentValue}
          onChange={(e) => updateTempData(section, field, e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple mt-1"
        />
      </div>
    );
  };

  const renderEditableArray = (
    section: keyof StudentInfo,
    field: string,
    label: string,
    items: string[]
  ) => {
    const isEditing = editMode === section;
    const currentItems = isEditing ? (tempData[section] as any)[field] : items;

    if (!isEditing) {
      return (
        <div>
          <label className="text-sm font-medium text-text-secondary">{label}</label>
          <ul className="mt-1 space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-sm bg-bg-secondary p-2 rounded">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <div className="mt-1 space-y-2">
          {currentItems.map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayField(section, field, index, e.target.value)}
                className="flex-1 p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder={`Enter ${label.toLowerCase().slice(0, -1)}`}
              />
              <button
                onClick={() => removeArrayItem(section, field, index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Remove item"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem(section, field)}
            className="text-sm text-purple hover:text-purple/80 font-medium"
          >
            + Add {label.slice(0, -1)}
          </button>
        </div>
      </div>
    );
  };

  const renderSectionActions = (section: string) => {
    const isEditing = editMode === section;

    return (
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="p-2 text-text-secondary hover:bg-bg-secondary rounded-md transition-colors"
              aria-label="Cancel editing"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => handleSave(section)}
              className="p-2 bg-purple text-white hover:bg-purple/80 rounded-md transition-colors"
              aria-label="Save changes"
            >
              <Save size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEdit(section)}
            className="p-2 text-purple hover:bg-purple/10 rounded-md transition-colors"
            aria-label="Edit section"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Personal Information - Collapsible */}
      <CollapsibleSection
        title="Personal Information"
        icon={<User className="text-purple" size={20} />}
        badge={
          editMode === 'personalInfo' ? (
            <span className="px-2 py-1 bg-purple/10 text-purple text-xs rounded-full">
              Editing Mode
            </span>
          ) : undefined
        }
        defaultExpanded={true}
        accentColor="purple"
        className={`transition-all ${editMode === 'personalInfo' ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        headerClassName="relative"
      >
        <div className="absolute top-4 right-4">
          {renderSectionActions('personalInfo')}
        </div>
        
        <div className="space-y-3 pr-20">
          <div className="grid grid-cols-2 gap-4">
            {renderEditableField('personalInfo', 'fullName', 'Full Name', studentInfo.personalInfo.fullName)}
            {renderEditableField('personalInfo', 'preferredName', 'Preferred Name', studentInfo.personalInfo.preferredName)}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {renderEditableField('personalInfo', 'dateOfBirth', 'Date of Birth', studentInfo.personalInfo.dateOfBirth, 'date')}
            {renderEditableField('personalInfo', 'age', 'Age', studentInfo.personalInfo.age)}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {renderEditableField('personalInfo', 'studentId', 'Student ID', studentInfo.personalInfo.studentId)}
            {renderEditableField('personalInfo', 'grade', 'Grade', studentInfo.personalInfo.grade, 'select', [
              'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
              '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
            ])}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {renderEditableField('personalInfo', 'gender', 'Gender', studentInfo.personalInfo.gender, 'select', [
              'Male', 'Female', 'Non-binary', 'Prefer not to say'
            ])}
            {renderEditableField('personalInfo', 'ethnicity', 'Ethnicity', studentInfo.personalInfo.ethnicity, 'select', [
              'American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic/Latino',
              'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races'
            ])}
          </div>
        </div>
      </CollapsibleSection>

      {/* Contact Information - Collapsible */}
      <CollapsibleSection
        title="Contact Information"
        icon={<MapPin className="text-purple" size={20} />}
        badge={
          editMode === 'contactInfo' ? (
            <span className="px-2 py-1 bg-purple/10 text-purple text-xs rounded-full">
              Editing Mode
            </span>
          ) : undefined
        }
        defaultExpanded={false}
        accentColor="purple"
        className={`transition-all ${editMode === 'contactInfo' ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        headerClassName="relative"
      >
        <div className="absolute top-4 right-4">
          {renderSectionActions('contactInfo')}
        </div>
        
        <div className="space-y-3 pr-20">
          {renderEditableField('contactInfo', 'address', 'Address', studentInfo.contactInfo.address)}
          {renderEditableField('contactInfo', 'phone', 'Phone', studentInfo.contactInfo.phone)}
          {renderEditableField('contactInfo', 'email', 'Email', studentInfo.contactInfo.email)}
          {renderEditableField('contactInfo', 'emergencyContact', 'Emergency Contact', studentInfo.contactInfo.emergencyContact)}
        </div>
      </CollapsibleSection>

      {/* Educational Information - Collapsible */}
      <CollapsibleSection
        title="Educational Information"
        icon={<FileText className="text-purple" size={20} />}
        badge={
          editMode === 'educationalInfo' ? (
            <span className="px-2 py-1 bg-purple/10 text-purple text-xs rounded-full">
              Editing Mode
            </span>
          ) : undefined
        }
        defaultExpanded={false}
        accentColor="purple"
        className={`transition-all ${editMode === 'educationalInfo' ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        headerClassName="relative"
      >
        <div className="absolute top-4 right-4">
          {renderSectionActions('educationalInfo')}
        </div>
        
        <div className="space-y-3 pr-20">
          <div className="grid grid-cols-2 gap-4">
            {renderEditableField('educationalInfo', 'program', 'Program', studentInfo.educationalInfo.program, 'select', [
              'General Education', 'Resource Support', 'Self-Contained', 'Inclusion', 'ESN Program'
            ])}
            {renderEditableField('educationalInfo', 'placement', 'Placement', studentInfo.educationalInfo.placement)}
          </div>
          
          {renderEditableField('educationalInfo', 'primaryDisability', 'Primary Disability', studentInfo.educationalInfo.primaryDisability, 'select', [
            'Specific Learning Disability', 'Intellectual Disability', 'Autism Spectrum Disorder',
            'Emotional Disturbance', 'Speech or Language Impairment', 'Visual Impairment',
            'Hearing Impairment', 'Orthopedic Impairment', 'Other Health Impairment',
            'Multiple Disabilities', 'Deaf-Blindness', 'Traumatic Brain Injury'
          ])}
          
          {renderEditableField('educationalInfo', 'secondaryDisability', 'Secondary Disability', studentInfo.educationalInfo.secondaryDisability)}
          
          <div className="grid grid-cols-2 gap-4">
            {renderEditableField('educationalInfo', 'iepDate', 'IEP Date', studentInfo.educationalInfo.iepDate, 'date')}
            {renderEditableField('educationalInfo', 'nextReview', 'Next Review', studentInfo.educationalInfo.nextReview, 'date')}
          </div>
        </div>
      </CollapsibleSection>

      {/* Medical Information & Accommodations - Collapsible */}
      <CollapsibleSection
        title="Medical & Accommodations"
        icon={<Calendar className="text-purple" size={20} />}
        badge={
          editMode === 'medicalInfo' ? (
            <span className="px-2 py-1 bg-purple/10 text-purple text-xs rounded-full">
              Editing Mode
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
              {studentInfo.medicalInfo.allergies.length} Allergies
            </span>
          )
        }
        defaultExpanded={false}
        accentColor="purple"
        className={`transition-all ${editMode === 'medicalInfo' ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        headerClassName="relative"
      >
        <div className="absolute top-4 right-4">
          {renderSectionActions('medicalInfo')}
        </div>
        
        <div className="space-y-4 pr-20">
          {renderEditableArray('medicalInfo', 'medications', 'Medications', studentInfo.medicalInfo.medications)}
          
          <div>
            <label className="text-sm font-medium text-text-secondary">Allergies</label>
            {editMode === 'medicalInfo' ? (
              <div className="mt-1 space-y-2">
                {(tempData.medicalInfo.allergies).map((allergy: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) => updateArrayField('medicalInfo', 'allergies', index, e.target.value)}
                      className="flex-1 p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                      placeholder="Enter allergy"
                    />
                    <button
                      onClick={() => removeArrayItem('medicalInfo', 'allergies', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      aria-label="Remove allergy"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('medicalInfo', 'allergies')}
                  className="text-sm text-purple hover:text-purple/80 font-medium"
                >
                  + Add Allergy
                </button>
              </div>
            ) : (
              <div className="mt-1 flex flex-wrap gap-2">
                {studentInfo.medicalInfo.allergies.map((allergy, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {allergy}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {renderEditableArray('medicalInfo', 'accommodations', 'Accommodations', studentInfo.medicalInfo.accommodations)}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default DemographicsTab;