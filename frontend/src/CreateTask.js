import {useState} from 'react';
import axios from 'axios';

function CreateTask({ token, onTaskCreated }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    const handleCreate = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            await axios.post('http://localhost:8000/tasks/',
                {title, description},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setTitle('')
            setDescription('')
            setError('')
            onTaskCreated();
        } catch(err) {
            setError('Failed to create task ' + (err.response?.data?.detail || 'Unknown error'));
        }
     };
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Create New Task</h3>
        <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
        />
        <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
        />
        <button 
            onClick={handleCreate}
            style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
            Create Task
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
  );
}

export default CreateTask;