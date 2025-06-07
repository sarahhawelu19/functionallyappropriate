import React, { createContext, useState, useContext } from 'react';

export interface Report {
  id: number | string; // Allow string for potential UUIDs later
  name: string;        // Typically student name + report type
  type: string;        // e.g., 'academic-achievement', 'cognitive-processing'
  date: string;        // ISO string date
  status: 'Draft' | 'In Progress' | 'Completed';
  content?: string;     // The fully populated report text
  formData?: Record<string, any>; // The raw form data used
}

export interface ReportContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  // We can add updateReport, deleteReport later
}

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([
    // Initial mock data (can be moved from ReportDrafting.tsx later)
    { id: 1, name: 'John Smith - Progress Report', type: 'Progress Report (Old)', date: '2025-01-15', status: 'Draft' },
    { id: 2, name: 'Emily Johnson - Initial Evaluation', type: 'Initial Evaluation (Old)', date: '2025-02-10', status: 'Completed' },
  ]);

  const addReport = (newReport: Report) => {
    setReports(prevReports => [...prevReports, { ...newReport, id: Date.now() }]); // Simple ID generation
  };

  return (
    <ReportContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};