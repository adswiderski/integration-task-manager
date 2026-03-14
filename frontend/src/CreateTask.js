import { useState } from 'react';
import axios from 'axios';

function CreateTask({ token, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/tasks/',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      setError('');
      onTaskCreated();
    } catch (err) {
      setError(
        'Failed to create task ' +
          (err.response?.data?.detail || 'Unknown error')
      );
    }
  };
  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '20px auto',
        background: 'white',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
        ➕ Create New Task
      </h3>

      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleCreate()}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '10px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxSizing: 'border-box',
        }}
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows="3"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxSizing: 'border-box',
          resize: 'vertical',
        }}
      />

      <button
        onClick={handleCreate}
        style={{
          padding: '12px 24px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.target.style.background = '#218838')}
        onMouseOut={e => (e.target.style.background = '#28a745')}
      >
        Create Task
      </button>

      {error && (
        <p
          style={{
            color: '#dc3545',
            marginTop: '10px',
            padding: '10px',
            background: '#f8d7da',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

export default CreateTask;
