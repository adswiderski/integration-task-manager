import {useEffect, useState} from 'react';
import axios from 'axios';

function TaskList ({ token, onRefresh, tasks, setTasks }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [darkMode, setDarkMode] = useState(false);

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

    const handleSaveEdit = async (taskId) => {
      try {
        await axios.put(
          `http://localhost:8000/tasks/${taskId}`,
          { 
            title: editTitle,
            description: editDesc
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...task, title: editTitle, description: editDesc }
            : task
        ));
        
        setEditingId(null);
      } catch (err) {
        console.error('Failed to update task:', err);
        alert('Failed to update task');
      }
    };
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('http://localhost:8000/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchTasks();
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

    const handleClearCompleted = async () => {
      const completedTasks = tasks.filter(t => t.status === 'done');
      
      if (!window.confirm(`Delete ${completedTasks.length} completed task(s)?`)) {
        return;
      }
      
      try {
        await Promise.all(
          completedTasks.map(task =>
            axios.delete(
              `http://localhost:8000/tasks/${task.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
        
        setTasks(tasks.filter(task => task.status !== 'done'));
      } catch (err) {
        console.error('Failed to clear completed tasks:', err);
        alert('Failed to clear some tasks');
      }
    };

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
      {tasks.filter(t => t.status === 'done').length > 0 && (
        <button
          onClick={handleClearCompleted}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '10px'
          }}
        >
          🗑️ Clear Completed ({tasks.filter(t => t.status === 'done').length})
        </button>
      )}

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
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: darkMode ? '#8b949e' : '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading tasks...</p>
        </div>
      )}

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
          <button
            onClick={fetchTasks}
            style={{
              marginLeft: '16px',
              padding: '6px 12px',
              background: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p style={{ color: darkMode ? '#8b949e' : '#666', fontStyle: 'italic' }}>
          No tasks yet. Create your first task!
        </p>
      )}

      {!loading && !error && tasks.length > 0 && (
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
                {editingId === task.id ? (
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '8px',
                          fontSize: '16px',
                          border: '2px solid #007bff',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Task title"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '8px',
                          fontSize: '14px',
                          border: '2px solid #007bff',
                          borderRadius: '4px',
                          minHeight: '60px',
                          boxSizing: 'border-box',
                          resize: 'vertical'
                        }}
                        placeholder="Task description"
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: '6px 12px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // TRYB WYŚWIETLANIA (normalny)
                    <>
                      <h3 style={{ margin: '0 0 8px 0', color: darkMode ? '#58a6ff' : '#333' }}>
                        {task.title}
                      </h3>
                      <p style={{ margin: '0 0 10px 0', color: darkMode ? '#8b949e' : '#666', fontSize: '14px' }}>
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
                    </>
                  )}
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
                  {editingId !== task.id && (
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditTitle(task.title);
                        setEditDesc(task.description);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Edit
                    </button>
                  )}
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