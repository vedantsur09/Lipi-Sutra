import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/firebase';
import './Login.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await loginUser(email, password);
      navigate('/historian');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-heading">
          Welcome back to <strong>LipiSutra</strong>
        </h2>
        
        {error && <p className="login-error">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <label className="login-label" htmlFor="login-email">Email</label>
          <div className="login-input-wrapper">
            <input
              id="login-email"
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          
          <label className="login-label" htmlFor="login-password">Password</label>
          <div className="login-input-wrapper">
            <input
              id="login-password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
