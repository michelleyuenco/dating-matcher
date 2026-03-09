import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      signUp(email, password);
    } else {
      signIn(email, password);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Dating Matcher</h1>
        <p className="login-subtitle">Sign in to access the matching system</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
              minLength={6}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button className="btn btn-google btn-full" onClick={signInWithGoogle}>
          Sign in with Google
        </button>

        <p className="login-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button className="btn-link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
