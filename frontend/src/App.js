import Login from './Login';
import {useState} from 'react'
import TaskList from './TaskList';
import CreateTask from './CreateTask';
import Stats from './Stats';

function App() {
  const [token, setToken] = useState('')
  const [refresh, setRefresh] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div 
      className="App"
      style={{
        minHeight: '100vh',
        background: darkMode ? '#0d1117' : '#ffffff',
        color: darkMode ? '#c9d1d9' : '#24292f',
        transition: 'all 0.3s ease'
    }}
  >
    <h1 style={{ 
      textAlign: 'center', 
      color: darkMode ? '#58a6ff' : '#333',
      paddingTop: '20px'
    }}>
      Task Manager
    </h1>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        background: darkMode ? '#1a1a1a' : '#f8f9fa',
        padding: '10px',
        borderRadius: '8px'
      }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '8px 16px',
            background: darkMode ? '#4a9eff' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      
      {!token ? (
        <Login onLoginSuccess={setToken} darkMode={darkMode} />
      ) : (
        <div>
          <CreateTask token={token} onTaskCreated={() => setRefresh(r => r + 1)} darkMode={darkMode} />
          <Stats tasks={tasks} />
          <TaskList 
            token={token} 
            onRefresh={refresh} 
            tasks={tasks} 
            setTasks={setTasks}
            darkMode={darkMode}
          />
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <button 
              onClick={() => setToken('')}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>          
        </div>
      )}
    </div>
  );
}

export default App;