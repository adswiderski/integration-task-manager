import {useEffect, useState} from 'react';
import axios from 'axios';

function TaskList ({ token, onRefresh, tasks, setTasks }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggleStatus = async (taskId, currentStatus) => {
      const newStatus = currentStatus === 'done' ? 'pending' : 'done';
      setUpdating(taskId);
      try {
        await axios.put(
          `http://localhost:8000/tasks/${taskId}`,
          { status: newStatus },
          {headers: { Authorization: `Bearer ${token}`}}
        );
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
      } catch(err) {
        console.error('Failed to update task: ', err);
        alert('Failed to update task');
      } finally {
        setUpdating(null);
      }
    };

    const handleDelete = async (taskId) => {
      if (!window.confirm('Are you sure you want to delete this task?')) {
        return;
      }
      try {
        await axios.delete(
          `http://localhost:8000/tasks/${taskId}`,
          { headers: { Authorization: `Bearer ${token}`}}
        );

        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        console.error('Failed to delete tasky: ', err);
        alert('Failed to delete task');
      }
    };

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
    }, [token, onRefresh]);

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
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              background: filter === 'all' ? '#007bff' : '#e9ecef',
              color: filter === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: filter === 'all' ? 'bold' : 'normal'
            }}
          >
            All ({tasks.length})
          </button>
          
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '8px 16px',
              background: filter === 'pending' ? '#007bff' : '#e9ecef',
              color: filter === 'pending' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: filter === 'pending' ? 'bold' : 'normal'
            }}
          >
            Pending ({tasks.filter(t => t.status === 'pending').length})
          </button>
          
          <button
            onClick={() => setFilter('done')}
            style={{
              padding: '8px 16px',
              background: filter === 'done' ? '#28a745' : '#e9ecef',
              color: filter === 'done' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: filter === 'done' ? 'bold' : 'normal'
            }}
          >
            Done ({tasks.filter(t => t.status === 'done').length})
          </button>
        </div>

      {searchQuery && (
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '10px' 
        }}>
          Found {tasks
            .filter(task => filter === 'all' || task.status === filter)
            .filter(task => 
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).length} task(s)
        </p>
      )}
              
      {tasks.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No tasks yet. Create your first task!</p>
      ) : (
        <div>
        {tasks
          .filter(task => filter === 'all' || task.status === filter)
          .filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(task => (
            <div 
              key={task.id}
              style={{
                border: '1px solid #e0e0e0',
                borderLeft: `4px solid ${task.status === 'done' ? '#28a745' : '#007bff'}`,
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '12px',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{task.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    {task.description}
                  </p>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    background: task.status === 'done' ? '#d4edda' : '#cce5ff',
                    color: task.status === 'done' ? '#155724' : '#004085'
                  }}>
                    {task.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginLeft: '15px' }}>
                  <button
                    onClick={() => handleToggleStatus(task.id, task.status)}
                    disabled={updating === task.id}
                    style={{
                      padding: '6px 12px',
                      background: task.status === 'done' ? '#ffc107' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      opacity: updating === task.id ? 0.6 :1,
                      cursor: updating === task.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {updating === task.id ? '⏳' : task.status === 'done' ? '↩️ Undo' : '✓ Done'}
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;