import Login from './Login';
import {useState} from 'react'
import TaskList from './TaskList';
import CreateTask from './CreateTask';

function App() {
  const [token, setToken] = useState('')
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Task Manager</h1>
      
      {!token ? (
        <Login onLoginSuccess={setToken} />
      ) : (
        <div>
          <CreateTask token={token} onTaskCreated={() => setRefresh(r => r + 1)} />
          <TaskList token={token} onRefresh={refresh} />
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