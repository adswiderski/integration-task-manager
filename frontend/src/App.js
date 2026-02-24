import Login from './Login';
import {useState} from 'react'
import TaskList from './TaskList';

function App() {
  const [token, setToken] = useState('')

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', color: '#333' }}>Task Manager</h1>
      {!token ? (
        <Login onLoginSuccess={setToken} />
      ) : (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
          <TaskList token={token} />
        </div>
      )}
    </div>
  );
}

export default App;