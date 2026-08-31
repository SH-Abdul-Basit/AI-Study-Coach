import React from 'react'; 
import '../styles/questionaire.css';

const OnboardingQuestionnaire = () => {
  return (
    <div className="app-container">
      <div className="card">
        <div className="progress-container">
          <div className="progress-bar" id="progressBar"></div>
        </div>
        <div className="progress-text" id="progressText"></div>
        
        <h1 className="heading" id="questionHeading"></h1>
        <p className="subtext" id="questionSubtext"></p>
        
        <div className="input-container" id="inputContainer"></div>
        <div className="error-message" id="errorMessage"></div>
        
        <button className="primary-btn" id="actionBtn"></button>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;