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
          <button onClick={() => setToken('')}>Logout</button>
          <CreateTask token={token} onTaskCreated={() => setRefresh(r => r + 1)} />
          <TaskList token={token} onRefresh={refresh} />
        </div>
      )}
    </div>
  );
}

export default App;