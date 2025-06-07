import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContentHtml: string; // Expecting HTML from Mammoth.js
  initialName?: string;
  onSave: (name: string, contentHtml: string, placeholderKeys: string[]) => void; 
  // placeholderKeys will be used later
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  initialContentHtml, 
  initialName = '', 
  onSave 
}) => {
  const [editorHtml, setEditorHtml] = useState('');
  const [templateName, setTemplateName] = useState('');
  // Later, we'll add state for managing identified placeholders:
  // const [placeholders, setPlaceholders] = useState<Array<{name: string, key: string}>>([]);

  useEffect(() => {
    if (isOpen) {
      setEditorHtml(initialContentHtml);
      setTemplateName(initialName);
    }
  }, [isOpen, initialContentHtml, initialName]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    // For now, placeholderKeys is empty. We will implement placeholder identification later.
    onSave(templateName, editorHtml, []); 
    onClose();
  };

  // Basic Quill modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'align': [] }],
      ['link', /* 'image' - add if needed */],
      ['clean']                                         // remove formatting button
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'align',
    'link', /* 'image' */
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-bg-primary p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-semibold mb-5 text-text-primary">Create/Edit Custom Template</h2>
        
        <div className="mb-4">
          <label htmlFor="customTemplateName" className="block text-sm font-medium mb-1 text-text-secondary">Template Name:</label>
          <input 
            type="text" 
            id="customTemplateName"
            className="w-full p-2.5 border border-border rounded-md bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-gold text-text-primary"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter a name for this template"
          />
        </div>

        <div className="mb-4 flex-grow min-h-[400px] flex flex-col"> {/* Ensure editor has space and flex layout */}
          <label className="block text-sm font-medium mb-1 text-text-secondary">Template Content:</label>
          <ReactQuill 
            theme="snow" 
            value={editorHtml} 
            onChange={setEditorHtml} 
            modules={modules}
            formats={formats}
            className="flex-grow bg-white text-gray-900 quill-editor-container" // Quill needs specific height management
            // The .quill-editor-container and its child .ql-container might need explicit height: 100% or flex-grow
          />
        </div>
        
        {/* Placeholder for "Add Placeholder" button and list - for Phase B */}
        <div className="mb-4 p-3 border-t border-border">
             <p className="text-xs text-text-secondary">Placeholder management UI will go here.</p>
        </div>

        <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-border">
          <button onClick={onClose} className="btn border border-gray-300 hover:bg-gray-100 text-gray-700">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="btn bg-accent-gold text-black"
            disabled={!templateName.trim()} // Disable save if no name
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorModal;