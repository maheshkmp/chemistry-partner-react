import React from 'react';

const MCQUploadButton = ({ onChange, disabled }) => {
  return (
    <div className="form-group">
      <label>MCQ Answer Sheet:</label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={onChange}
        className="file-input"
        disabled={disabled}
      />
    </div>
  );
};

export default MCQUploadButton;