import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <h1>Dating Matcher</h1>
        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/members">Members</NavLink>
          <NavLink to="/matches">Matches</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/import">Import</NavLink>
        </nav>
        {user && (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="btn btn-sm" onClick={signOut}>Sign Out</button>
          </div>
        )}
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
