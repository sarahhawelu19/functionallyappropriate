import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Plus, FilePenLine, Sparkles, MessageSquarePlus, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportDrafting: React.FC = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'John Smith', type: 'Progress Report', date: '2025-01-15', status: 'Draft' },
    { id: 2, name: 'Emily Johnson', type: 'Initial Evaluation', date: '2025-02-10', status: 'Completed' },
    { id: 3, name: 'Michael Davis', type: 'Triennial Review', date: '2025-03-05', status: 'In Progress' },
  ]);
  
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const templates = [
    {
      id: 'progress',
      name: 'Progress Report',
      content: `# QUARTERLY PROGRESS REPORT

## Student Information
Name: [STUDENT NAME]
ID: [STUDENT ID]
Grade: [GRADE]
Reporting Period: [DATE RANGE]

## Goal Progress Summary
[GOAL AREA 1]: [PROGRESS DESCRIPTION]
Current Performance: [MEASUREMENT]
Status: [NOT MET / PARTIALLY MET / MET]

[GOAL AREA 2]: [PROGRESS DESCRIPTION]
Current Performance: [MEASUREMENT]
Status: [NOT MET / PARTIALLY MET / MET]

## Instructional Strategies Used
- [STRATEGY 1]
- [STRATEGY 2]
- [STRATEGY 3]

## Recommendations
[RECOMMENDATIONS BASED ON PROGRESS]

## Next Steps
[PLANNED INTERVENTIONS OR ADJUSTMENTS]

Report Completed By: [TEACHER NAME]
Date: [DATE]`,
    },
    {
      id: 'present-levels',
      name: 'Present Levels',
      content: `# PRESENT LEVELS OF ACADEMIC ACHIEVEMENT AND FUNCTIONAL PERFORMANCE

## Student Information
Name: [STUDENT NAME]
ID: [STUDENT ID]
Grade: [GRADE]
Date: [DATE]

## Academic Performance

### Reading
[DESCRIBE CURRENT READING PERFORMANCE INCLUDING DECODING, FLUENCY, AND COMPREHENSION SKILLS]

### Writing
[DESCRIBE CURRENT WRITING PERFORMANCE INCLUDING ORGANIZATION, GRAMMAR, AND EXPRESSION]

### Mathematics
[DESCRIBE CURRENT MATH PERFORMANCE INCLUDING CALCULATION AND PROBLEM-SOLVING SKILLS]

## Functional Performance

### Social/Emotional
[DESCRIBE SOCIAL SKILLS, EMOTIONAL REGULATION, AND INTERPERSONAL INTERACTIONS]

### Behavior
[DESCRIBE BEHAVIORAL STRENGTHS AND AREAS OF CONCERN]

### Communication
[DESCRIBE EXPRESSIVE AND RECEPTIVE LANGUAGE SKILLS]

### Fine/Gross Motor Skills
[DESCRIBE MOTOR DEVELOPMENT AND FUNCTIONING]

## Impact of Disability
[EXPLAIN HOW THE STUDENT'S DISABILITY AFFECTS INVOLVEMENT AND PROGRESS IN THE GENERAL CURRICULUM]

## Strengths and Interests
[LIST STUDENT'S STRENGTHS, INTERESTS, AND PREFERENCES]

## Parent/Student Input
[SUMMARIZE INPUT FROM PARENTS AND STUDENT REGARDING EDUCATIONAL CONCERNS AND PRIORITIES]

Completed By: [TEACHER NAME]
Date: [DATE]`,
    },
    {
      id: 'behavior',
      name: 'Behavior Intervention Plan',
      content: `# BEHAVIOR INTERVENTION PLAN (BIP)

## Student Information
Name: [STUDENT NAME]
ID: [STUDENT ID]
Grade: [GRADE]
Date: [DATE]

## Target Behavior
[OPERATIONALLY DEFINE THE BEHAVIOR OF CONCERN]

## Functional Behavior Assessment Summary
### Antecedents (When is the behavior most likely to occur?)
[DESCRIBE SITUATIONS, TIMES, SETTINGS WHEN BEHAVIOR TYPICALLY OCCURS]

### Function of Behavior (Why is the behavior occurring?)
[EXPLAIN THE PURPOSE THE BEHAVIOR SERVES FOR THE STUDENT]

## Replacement Behavior
[DESCRIBE THE APPROPRIATE BEHAVIOR THAT WILL SERVE THE SAME FUNCTION]

## Prevention Strategies
[LIST ENVIRONMENTAL MODIFICATIONS AND PROACTIVE APPROACHES]

## Teaching Strategies
[DESCRIBE HOW THE REPLACEMENT BEHAVIOR WILL BE TAUGHT]

## Reinforcement Plan
[EXPLAIN HOW THE REPLACEMENT BEHAVIOR WILL BE REINFORCED]

## Response Plan
[DESCRIBE HOW STAFF WILL RESPOND WHEN TARGET BEHAVIOR OCCURS]

## Data Collection
[SPECIFY HOW PROGRESS WILL BE MONITORED AND MEASURED]

## Communication Plan
[DESCRIBE HOW INFORMATION WILL BE SHARED BETWEEN SCHOOL AND HOME]

Team Members:
- [NAME, ROLE]
- [NAME, ROLE]
- [NAME, ROLE]

Review Date: [DATE]`,
    },
  ];
  
  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Report Drafting</h1>
        <Link to="/reports/new" className="btn bg-accent-gold text-black">
          <span className="flex items-center gap-1">
            <Plus size={18} />
            New Report
          </span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-gold" size={22} />
            <h2 className="text-xl font-medium">My Reports</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} className="border-b border-border hover:bg-bg-secondary">
                    <td className="p-3">{report.name}</td>
                    <td className="p-3">{report.type}</td>
                    <td className="p-3">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'Completed' ? 'bg-green text-white' :
                        report.status === 'Draft' ? 'bg-gold text-black' :
                        'bg-purple text-white'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-bg-secondary rounded-md transition-colors" aria-label="Edit report">
                          <FilePenLine size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-bg-secondary rounded-md transition-colors" aria-label="Download report">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {reports.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <FileText size={40} className="mx-auto mb-2 opacity-30" />
              <p>No reports have been created yet</p>
              <Link to="/reports/new" className="mt-4 btn bg-accent-gold text-black flex items-center gap-1">
                <span className="flex items-center gap-1">
                  <Plus size={16} />
                  Create First Report
                </span>
              </Link>
            </div>
          )}
          
          {activeTemplate && (
            <div className="mt-6 border border-border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">
                  {templates.find(t => t.id === activeTemplate)?.name} Template
                </h3>
                <button 
                  className="btn border border-gold text-gold hover:bg-gold hover:bg-opacity-10"
                  onClick={() => handleCopyTemplate(templates.find(t => t.id === activeTemplate)?.content || '')}
                >
                  <span className="flex items-center gap-1">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </span>
                </button>
              </div>
              
              <div className="bg-bg-secondary p-4 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
                {templates.find(t => t.id === activeTemplate)?.content}
              </div>
            </div>
          )}
        </div>
        
        <div className="card h-fit">
          <h2 className="text-xl font-medium mb-4">Report Templates</h2>
          <p className="text-text-secondary mb-4">Use these templates to create standardized reports for your students.</p>
          
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`w-full text-left p-4 border rounded-md transition-all flex flex-col ${
                  activeTemplate === template.id
                    ? 'border-gold bg-gold bg-opacity-5'
                    : 'border-border hover:border-gold hover:bg-gold hover:bg-opacity-5'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="text-gold" size={20} />
                  <h3 className="font-medium text-lg">{template.name}</h3>
                </div>
                <p className="text-sm text-text-secondary mt-1 line-clamp-3 mb-3">
                  {template.content.split('\n\n')[0].replace(/#+\s*/, '').substring(0, 120) + '...'}
                </p>
                <div className="flex items-center justify-end gap-2 mt-auto">
                  <button
                    className="btn-sm border border-border text-text-secondary hover:border-gold hover:text-gold px-3 py-1 text-xs"
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    Preview
                  </button>
                  <Link
                    to={`/reports/new?template=${template.id}`}
                    className="btn-sm bg-accent-gold text-black hover:bg-opacity-90 px-3 py-1 text-xs flex items-center gap-1"
                  >
                    Use Template
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">AI Writing Assistance</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-border rounded-md hover:border-gold hover:bg-gold hover:bg-opacity-5 transition-all">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <h3 className="text-sm">Generate Present Levels Description</h3>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Based on assessment data and observations
                </p>
              </button>
              
              <button className="w-full text-left p-3 border border-border rounded-md hover:border-gold hover:bg-opacity-5 transition-all">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus size={16} />
                  <h3 className="text-sm">Expand Goal Progress Notes</h3>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Turn brief notes into detailed progress descriptions
                </p>
              </button>
              
              <button className="w-full text-left p-3 border border-border rounded-md hover:border-gold hover:bg-opacity-5 transition-all">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} />
                  <h3 className="text-sm">Suggest Intervention Strategies</h3>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Based on student needs and goals
                </p>
              </button>
            </div>
            
            <p className="text-xs text-text-secondary mt-4">
              Note: AI suggestions should always be reviewed and edited by a qualified professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDrafting;