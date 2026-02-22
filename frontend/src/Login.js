import {useState} from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/login', {
                email,
                password
            });
            setToken(response.data.access_token);
            setError('');
        } catch (err) {
            setError('Login failed: ' + (err.response?.data?.detail || 'Unknown error'));
        }
    };
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
            <h1>Task Manager Login</h1>
            <div style={{ marginTop: '20px'}}>
            <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    display: 'block',
                    width: '100%',
                    margin: '10px 0',
                    padding: '10px',
                    fontSize: '16px'
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    display: 'block',
                    width: '100%',
                    margin: '10px 0',
                    padding: '10px',
                    fontSize: '16px'
                }}
            />
            <button
                onClick={handleLogin}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                Login
            </button>
            </div>
        {error && (
            <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
        )}
        {token && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px'}}>
                <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Logged in successfully!</p>
                <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>Token: {token.substring(0, 50)}...</p>
            </div>
        )}
        </div>
    );
}

export default Login;