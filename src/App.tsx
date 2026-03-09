import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './presentation/hooks/useAuth';
import { useMembers } from './presentation/hooks/useMembers';
import { useCategories } from './presentation/hooks/useCategories';
import { useMatches } from './presentation/hooks/useMatches';
import Layout from './presentation/components/Layout';
import LoginPage from './presentation/components/LoginPage';
import DashboardPage from './presentation/pages/DashboardPage';
import MembersPage from './presentation/pages/MembersPage';
import MatchesPage from './presentation/pages/MatchesPage';
import CategoriesPage from './presentation/pages/CategoriesPage';
import ImportPage from './presentation/pages/ImportPage';
import './App.css';

function AuthenticatedApp() {
  const {
    members, loading: membersLoading, stats,
    addMember, removeMember, bulkImport, clearAll,
  } = useMembers();

  const {
    categories, loading: catsLoading,
    addCategory, removeCategory, syncCategories,
  } = useCategories();

  const { matches, weights, setWeights, mode, setMode } = useMatches(members);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={
          <DashboardPage stats={stats} categoryCount={categories.length} />
        } />
        <Route path="/members" element={
          <MembersPage
            members={members}
            loading={membersLoading}
            onAdd={addMember}
            onRemove={removeMember}
          />
        } />
        <Route path="/matches" element={
          <MatchesPage
            matches={matches}
            weights={weights}
            setWeights={setWeights}
            mode={mode}
            setMode={setMode}
          />
        } />
        <Route path="/categories" element={
          <CategoriesPage
            categories={categories}
            loading={catsLoading}
            onAdd={addCategory}
            onRemove={removeCategory}
          />
        } />
        <Route path="/import" element={
          <ImportPage
            onImport={bulkImport}
            onClear={clearAll}
            onSyncCategories={syncCategories}
            currentCount={stats.total}
          />
        } />
      </Route>
    </Routes>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {user ? <AuthenticatedApp /> : <LoginPage />}
    </BrowserRouter>
  );
}

export default App;
