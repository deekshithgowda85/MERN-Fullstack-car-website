import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Loginstyle.css';
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import loginGif from '../assets/login page.gif';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({
        username: username.trim(),
        password: password
      });

      if (result.success && result.user) {
        setUser(result.user);
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-root" style={{
      backgroundImage: `url(${loginGif})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header>
          <div className="logo">
            <img src="/carlogo.png" alt="Carbay Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <h1 style={{ display: 'inline-block', margin: 0 }}>Carbay</h1>
          </div>
          <h1>Hi, welcome back!</h1>
          <p>
            First time here? <Link className="text-white" to="/register">Sign up for free</Link>
          </p>
        </header>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength="6"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>Password must be at least 6 characters</p>
          <button type="submit">Sign in</button>
          <p>
            You acknowledge that you read, and agree, to our <a href="#">Terms of Service</a> and our <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;