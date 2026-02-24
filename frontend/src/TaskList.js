import {useEffect, useState} from 'react';
import axios from 'axios';

function TaskList ({ token }) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect (() => {
        const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/tasks/', {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
            });
            setTasks(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load tasks: ' + (err.response?.data?.detail || 'Unknown error'));
            setLoading(false);
            }
        };

        if (token) {
        fetchTasks();
        }
    }, [token]);

    if (!token) {
    return <p>Please log in to see tasks</p>;
    }

    if (loading) {
    return <p>Loading tasks...</p>;
    }

    if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
    }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Tasks</h2>
      
      {tasks.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No tasks yet. Create your first task!</p>
      ) : (
        <div>
          {tasks.map(task => (
            <div 
              key={task.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                background: '#f9f9f9'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{task.title}</h3>
              <p style={{ margin: '0', color: '#666' }}>{task.description}</p>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '12px',
                color: task.status === 'done' ? 'green' : '#999'
              }}>
                Status: {task.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;