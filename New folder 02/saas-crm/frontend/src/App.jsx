import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LeadsTable from './components/LeadsTable';
import LeadForm from './components/LeadForm';
import LeadDetail from './components/LeadDetail';
import Pipeline from './components/Pipeline';
import Analytics from './components/Analytics';
import MRRDashboard from './components/MRRDashboard';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-0 min-h-screen overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsTable />} />
          <Route path="/leads/new" element={<LeadForm />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/leads/:id/edit" element={<LeadForm />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/revenue" element={<MRRDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
