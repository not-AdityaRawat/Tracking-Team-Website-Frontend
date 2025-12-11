import { useEffect, useState } from 'react';
import './Performance.css';

function Performance() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/coordinator-stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getCoordinatorColor = (name) => {
    if (!name) return "";
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return Math.abs(hash % 8) + 1;
  };

  if (loading) return <div className="app-container"><p className="loading">Loading performance data...</p></div>;
  if (error) return <div className="app-container"><p className="error">Error: {error}</p></div>;

  return (
    <div className="app-container">
      <section className="header">
        <h1>Coordinator Performance</h1>
        <p className="header-info">Total Coordinators: {stats.length}</p>
      </section>

      <div className="performance-grid">
        <div className="stats-overview">
          <h2>Overview</h2>
          <div className="stats-cards">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card"
                onClick={() => setSelectedCoordinator(stat.coordinator === selectedCoordinator ? null : stat.coordinator)}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-card-header">
                  <span className="coordinator-name" data-color={getCoordinatorColor(stat.coordinator)}>
                    {stat.coordinator}
                  </span>
                </div>
                <div className="stat-card-body">
                  <div className="stat-item">
                    <span className="stat-label">Assigned</span>
                    <span className="stat-value">{stat.total}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tracked</span>
                    <span className="stat-value">{stat.tracked}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Invited</span>
                    <span className="stat-value">{stat.invited}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Called</span>
                    <span className="stat-value">{stat.called}</span>
                  </div>
                </div>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill progress-tracked" 
                      style={{ width: `${(stat.tracked / stat.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill progress-invited" 
                      style={{ width: `${(stat.invited / stat.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill progress-called" 
                      style={{ width: `${(stat.called / stat.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCoordinator && (
          <div className="coordinator-details">
            <h2>Companies assigned to {selectedCoordinator}</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Tracked</th>
                    <th>Invited</th>
                    <th>Called</th>
                  </tr>
                </thead>
                <tbody>
                  {stats
                    .find(s => s.coordinator === selectedCoordinator)
                    ?.companies.map((company, index) => (
                      <tr key={index}>
                        <td>{company.name}</td>
                        <td>
                          <span className={`status-badge ${company.tracked ? 'status-yes' : 'status-no'}`}>
                            {company.tracked ? '✓' : '✗'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${company.invited ? 'status-yes' : 'status-no'}`}>
                            {company.invited ? '✓' : '✗'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${company.called ? 'status-yes' : 'status-no'}`}>
                            {company.called ? '✓' : '✗'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Performance;
