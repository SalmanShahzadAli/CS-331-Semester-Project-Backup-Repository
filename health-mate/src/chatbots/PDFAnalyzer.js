import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Moon, Sun, X, File, Send, Loader } from 'lucide-react';

export default function PDFAnalyzer({ onBack }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFileId, setActiveFileId] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate PDF
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploadedFiles([...uploadedFiles, {
      id: Date.now(),
      name: selectedFile.name,
      size: selectedFile.size,
      uploadedAt: new Date().toLocaleString()
    }]);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId(null);
      setMessages([]);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          // For PDFs, convert to base64
          resolve(content.split(',')[1] || content);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyzePDF = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !input.trim()) return;

    setActiveFileId(fileId);
    const apiKey = process.env.REACT_APP_API_KEY;
    
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are an expert PDF analyzer and document assistant. Your role is to:
1. Extract and understand content from PDF documents
2. Answer questions about the document content
3. Summarize key information
4. Provide insights and analysis
5. Help users find specific information within their documents

Be helpful, accurate, and concise in your responses.`
            },
            {
              role: 'user',
              content: `I've uploaded a PDF file named "${file.name}". Please help me analyze and answer questions about its content. My question or request: ${currentInput}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        text: data.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I apologize, but I'm having trouble analyzing the PDF right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const containerStyle = {
    minHeight: '100vh',
    background: isDarkMode
      ? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    background: isDarkMode ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: isDarkMode
      ? '0 4px 20px rgba(0, 0, 0, 0.5)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
  };

  const mainContentStyle = {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const uploadAreaStyle = {
    background: isDarkMode
      ? 'rgba(162, 155, 254, 0.1)'
      : 'rgba(108, 92, 231, 0.1)',
    border: `2px dashed ${isDarkMode ? '#a29bfe' : '#6c5ce7'}`,
    borderRadius: '1rem',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    maxWidth: '500px',
    width: '100%',
  };

  const filesListStyle = {
    marginTop: '2rem',
    width: '100%',
    maxWidth: '600px',
  };

  const fileItemStyle = {
    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    border: isDarkMode ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid #e9ecef',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: isDarkMode ? '#e0e0e0' : '#333',
  };

  const selectedFileBoxStyle = {
    background: isDarkMode ? 'rgba(108, 92, 231, 0.2)' : 'rgba(108, 92, 231, 0.1)',
    border: isDarkMode ? '2px solid #a29bfe' : '2px solid #6c5ce7',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '1rem',
    color: isDarkMode ? '#a29bfe' : '#6c5ce7',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'transform 0.2s ease',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#a29bfe' : '#6c5ce7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
            }}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 style={{
            margin: 0,
            color: isDarkMode ? '#ffffff' : '#1a1a2e',
            fontSize: '1.5rem',
          }}>
            PDF Analyzer
          </h1>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDarkMode ? '#a29bfe' : '#6c5ce7',
            fontSize: '1.25rem',
          }}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Main Content */}
      {activeFileId ? (
        // Analysis View
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
        }}>
          {/* Current File Info */}
          <div style={{
            background: isDarkMode ? 'rgba(162, 155, 254, 0.1)' : 'rgba(108, 92, 231, 0.1)',
            border: isDarkMode ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid #e9ecef',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: isDarkMode ? '#a29bfe' : '#6c5ce7',
          }}>
            <File size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600' }}>
                {uploadedFiles.find(f => f.id === activeFileId)?.name}
              </div>
            </div>
            <button
              onClick={() => {
                setActiveFileId(null);
                setMessages([]);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDarkMode ? '#a29bfe' : '#6c5ce7',
                padding: '0.25rem',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
          }}>
            {messages.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: isDarkMode ? '#b0b0b0' : '#666',
              }}>
                <p>Ask questions about the PDF or request analysis</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'
                        : isDarkMode ? 'rgba(162, 155, 254, 0.2)' : 'rgba(108, 92, 231, 0.1)',
                      color: msg.sender === 'user'
                        ? '#ffffff'
                        : isDarkMode ? '#e0e0e0' : '#333',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.text}
                    <div style={{
                      fontSize: '0.75rem',
                      marginTop: '0.25rem',
                      opacity: '0.7',
                    }}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  background: isDarkMode ? 'rgba(162, 155, 254, 0.2)' : 'rgba(108, 92, 231, 0.1)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: isDarkMode ? '#a29bfe' : '#6c5ce7',
                }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Analyzing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyzePDF(activeFileId)}
              placeholder="Ask a question about the PDF..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: isDarkMode ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid #e9ecef',
                borderRadius: '0.5rem',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#1a1a2e',
                fontSize: '1rem',
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => handleAnalyzePDF(activeFileId)}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isLoading || !input.trim() ? '0.5' : '1',
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLoading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      ) : (
        // Upload View
        <div style={mainContentStyle}>
        <h2 style={{
          color: isDarkMode ? '#ffffff' : '#1a1a2e',
          marginBottom: '0.5rem',
        }}>
          Upload PDF Files
        </h2>
        <p style={{
          color: isDarkMode ? '#b0b0b0' : '#666',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          Upload your PDF files here (Max 10MB)
        </p>

        {/* Selected file preview */}
        {selectedFile && (
          <div style={selectedFileBoxStyle}>
            <File size={20} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: '600' }}>{selectedFile.name}</div>
              <div style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDarkMode ? '#a29bfe' : '#6c5ce7',
                padding: '0.25rem',
              }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Upload area */}
        <div
          style={uploadAreaStyle}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.background = isDarkMode
              ? 'rgba(162, 155, 254, 0.2)'
              : 'rgba(108, 92, 231, 0.2)';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'rgba(162, 155, 254, 0.1)'
              : 'rgba(108, 92, 231, 0.1)';
          }}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && file.type === 'application/pdf') {
              setSelectedFile(file);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Upload size={48} style={{
            color: isDarkMode ? '#a29bfe' : '#6c5ce7',
            marginBottom: '1rem',
          }} />
          <h3 style={{
            color: isDarkMode ? '#a29bfe' : '#6c5ce7',
            margin: '0.5rem 0',
          }}>
            Drag and drop your PDF here
          </h3>
          <p style={{
            color: isDarkMode ? '#b0b0b0' : '#666',
            margin: '0.5rem 0 0 0',
          }}>
            or click to browse
          </p>
        </div>

        {/* Upload button */}
        {selectedFile && (
          <button
            onClick={handleUpload}
            style={{
              ...buttonStyle,
              marginTop: '1.5rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Upload File
          </button>
        )}

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div style={filesListStyle}>
            <h3 style={{ color: isDarkMode ? '#ffffff' : '#1a1a2e', marginBottom: '1rem' }}>
              Uploaded Files ({uploadedFiles.length})
            </h3>
            {uploadedFiles.map((file) => (
              <div key={file.id} style={fileItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <File size={20} />
                  <div>
                    <div style={{ fontWeight: '600' }}>{file.name}</div>
                    <div style={{
                      fontSize: '0.85rem',
                      opacity: '0.7',
                    }}>
                      {(file.size / 1024).toFixed(2)} KB • {file.uploadedAt}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setActiveFileId(file.id)}
                    style={{
                      background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.4rem 0.8rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                    cursor: 'pointer',
                    color: isDarkMode ? '#ff6b6b' : '#e74c3c',
                    padding: '0.25rem',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <X size={20} />
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}
    </div>
  );
}
