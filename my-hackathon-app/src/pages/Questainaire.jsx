import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/questionaire.css';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_TYPES = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];

const SEMESTER_OPTIONS = [
  '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
  '5th Semester', '6th Semester', '7th Semester', '8th Semester',
];

const questions = [
  {
    type: 'select',
    field: 'semester',
    heading: 'Which semester are you studying?',
    subtext: 'This helps us personalize your study experience based on your academic level.',
    validate: (val) => val !== '',
    errorMsg: 'Please select your current semester.',
  },
  {
    type: 'text',
    field: 'subject',
    heading: 'Which subject are you trying to ace?',
    subtext: "We'll use this to tailor your study material and practice experience.",
    placeholder: 'Enter subject name',
    validate: (val) => val.trim() !== '',
    errorMsg: 'Please enter a subject name.',
  },
  {
    type: 'text',
    field: 'professor',
    heading: 'Which professor is teaching you this subject?',
    subtext: 'This helps us understand your course and tailor your preparation experience.',
    placeholder: "Enter professor name",
    validate: (val) => val.trim() !== '',
    errorMsg: "Please enter your professor's name.",
  },
  {
    type: 'files',
    heading: 'Upload your study material',
    subtext: 'Upload your notes, PDFs, or slides so we can tailor your study experience to your course material.',
    validate: (files) => files.length > 0,
    errorMsg: 'Please upload at least one valid study material file.',
  },
];

export default function OnboardingQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ semester: '', subject: '', professor: '' });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const q = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;

  const handleFiles = (fileList) => {
    let firstError = '';
    const accepted = [];

    Array.from(fileList).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const isValidExtension = ALLOWED_TYPES.some((ext) => fileName.endsWith(ext));

      if (!isValidExtension) {
        firstError = 'Unsupported file type. Please upload PDF, DOC, DOCX, PPT, or PPTX.';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        firstError = 'File exceeds the 25MB size limit.';
        return;
      }
      accepted.push(file);
    });

    if (firstError) {
      setError(firstError);
    } else {
      setError('');
    }
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };
 
  const navigate = useNavigate();

  const submitOnboardingData = async () => {
    const formData = new FormData();
    formData.append('semester', answers.semester);
    formData.append('subject', answers.subject);
    formData.append('professor', answers.professor);
    files.forEach((file) => formData.append('files', file));

    setSubmitting(true);
    try {
      await sendToBackend(formData);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  const sendToBackend = async (formData) => {
    console.log('Ready to send onboarding data', formData);
  };

  const handleContinue = async () => {
    setError('');

    if (!isLast) {
      const value = answers[q.field];
      if (!q.validate(value)) {
        setError(q.errorMsg);
        return;
      }
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (!q.validate(files)) {
        setError(q.errorMsg);
        return;
      }
      await submitOnboardingData();
    }
  };

  const renderInput = () => {
    if (q.type === 'select') {
      return (
        <select
          id="answerInput"
          value={answers.semester}
          onChange={(e) => setAnswers((prev) => ({ ...prev, semester: e.target.value }))}
          required
        >
          <option value="" disabled>Select your semester</option>
          {SEMESTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (q.type === 'text') {
      return (
        <input
          type="text"
          id="answerInput"
          placeholder={q.placeholder}
          value={answers[q.field]}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.field]: e.target.value }))}
        />
      );
    }

    if (q.type === 'files') {
      return (
        <>
          <div
            id="dropzone"
            className={`dropzone${dragOver ? ' dragover' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              <path d="M12 15V9" />
              <path d="M9 12l3-3 3 3" />
            </svg>
            <div className="dropzone-text">Drag &amp; drop your files here</div>
            <div className="dropzone-subtext">or <span className="text-blue">click to upload</span></div>
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
          </div>

          <div id="fileListContainer" className="file-list">
            {files.map((file, index) => (
              <div className="file-item" key={`${file.name}-${index}`}>
                <span>{file.name}</span>
                <span
                  className="file-remove"
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="progress-container">
          <div
            className="progress-bar"
            id="progressBar"
            style={{ width: `${(currentQuestion + 1) * 25}%` }}
          />
        </div>
        <div className="progress-text" id="progressText">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h1 className="heading" id="questionHeading">{q.heading}</h1>
        <p className="subtext" id="questionSubtext">{q.subtext}</p>

        <div className="input-container" id="inputContainer">
          {renderInput()}
        </div>

        <div className="error-message" id="errorMessage" style={{ display: error ? 'block' : 'none' }}>
          {error}
        </div>

        <button className="primary-btn" id="actionBtn" onClick={handleContinue} disabled={submitting}>
          {submitting ? 'Submitting…' : isLast ? 'Finish →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
};