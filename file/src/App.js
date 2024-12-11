import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [file, setFile] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [fileInfo, setFileInfo] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setFeedback('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFileInfo(response.data);
            setFeedback('File uploaded successfully!');
        } catch (error) {
            setFeedback(error.response?.data?.error || 'File upload failed.');
        }
    };

    return (
        <div className="container">
            <h2>File Upload</h2>
            <form onSubmit={handleUpload}>
                <div className="input-container">
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" className="upload-button">Upload</button>
            </form>
            {feedback && (
                <div className={`feedback ${feedback.includes('success') ? 'success' : 'error'}`}>
                    {feedback}
                </div>
            )}
            {fileInfo && (
                <div className="file-info">
                    <h4>Uploaded File Info:</h4>
                    <p><strong>Name:</strong> {fileInfo.fileName}</p>
                    <p><strong>Size:</strong> {fileInfo.fileSize} bytes</p>
                    <p><strong>Type:</strong> {fileInfo.fileType}</p>
                </div>
            )}
        </div>
    );
};

export default App;
