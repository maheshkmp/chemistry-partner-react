import MCQUploadButton from './MCQUploadButton';

// ... existing imports ...

const PaperForm = ({ isEdit, paperId }) => {
  // ... existing state ...
  const [mcqFile, setMcqFile] = useState(null);

  const handleMCQFileChange = (e) => {
    setMcqFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration_minutes', duration);
    formData.append('total_marks', totalMarks);
    if (pdfFile) {
      formData.append('pdf_file', pdfFile);
    }
    if (mcqFile) {
      formData.append('mcq_file', mcqFile);
    }

    try {
      const url = isEdit ? `/api/papers/${paperId}` : '/api/papers';
      const method = isEdit ? 'put' : 'post';
      await axios[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // ... handle success ...
    } catch (error) {
      // ... handle error ...
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... existing form fields ... */}
      
      <div className="flex flex-col space-y-4">
        {/* PDF Upload */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Question Paper (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* MCQ Answer Upload */}
        <MCQUploadButton onChange={handleMCQFileChange} />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        {isEdit ? 'Update Paper' : 'Create Paper'}
      </button>
    </form>
  );
};

export default PaperForm;