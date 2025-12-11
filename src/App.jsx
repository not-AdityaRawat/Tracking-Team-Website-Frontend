import { useEffect, useState } from 'react'
import './App.css'
import Performance from './Performance'
import InstallPWA from './InstallPWA'

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [coordinatorInput, setCoordinatorInput] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [companiesPerPage, setCompaniesPerPage] = useState(50);
  const [currentView, setCurrentView] = useState('companies'); // 'companies' or 'performance'
  
  const handleCoordinatorUpdate = async (companyId, currentCoordinator) => {
    setEditingId(companyId);
    setCoordinatorInput(currentCoordinator || "");
  };
  
  const saveCoordinator = async (companyId) => {
    try {
      const response = await fetch(`${API_URL}/company/${companyId}/coordinator`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinator: coordinatorInput }),
      });
      
      if (!response.ok) throw new Error("Failed to update coordinator");
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, Coordinator: coordinatorInput } : c
      ));
      setEditingId(null);
      setCoordinatorInput("");
    } catch (err) {
      console.error("Error updating coordinator:", err);
      alert("Failed to update coordinator");
    }
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  
  const getCoordinatorColor = (name) => {
    if (!name) return "";
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return Math.abs(hash % 8) + 1;
  };
  
  const toggleStatus = async (companyId, field, currentValue) => {
    try {
      const response = await fetch(`${API_URL}/company/${companyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value: !currentValue }),
      });
      
      if (!response.ok) throw new Error("Failed to update status");
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, [field]: !currentValue } : c
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };
  
  // Fetch companies for current page directly from backend (which queries MongoDB)
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/companies?page=${currentPage}&limit=${companiesPerPage}`;
        if (sortBy) {
          url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch companies");
        
        const data = await response.json();
        
        setCompanies(data.companies);
        setTotalCount(data.total);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching page data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, [currentPage, sortBy, sortOrder, companiesPerPage]);

  if (error) return <p className="error">Error: {error}</p>;

  if (currentView === 'performance') {
    return (
      <>
        <nav className="navbar">
          <button onClick={() => setCurrentView('companies')} className="nav-btn">Companies</button>
          <button onClick={() => setCurrentView('performance')} className="nav-btn active">Performance</button>
        </nav>
        <Performance />
      </>
    );
  }

  const totalPages = Math.ceil(totalCount / companiesPerPage);

  return (
    <>
      <InstallPWA />
      <nav className="navbar">
        <button onClick={() => setCurrentView('companies')} className="nav-btn active">Companies</button>
        <button onClick={() => setCurrentView('performance')} className="nav-btn">Performance</button>
      </nav>
      <div className="app-container">
      <section className="header">
        <h1>T&P Tracking Team</h1>
        <p className="header-info">Total Companies: {totalCount} | Showing: {companies.length}</p>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#6b6b6b' }}>Show:</span>
          <select 
            value={companiesPerPage} 
            onChange={(e) => { setCompaniesPerPage(Number(e.target.value)); setCurrentPage(1); }}
            style={{ 
              padding: '6px 12px', 
              border: '1px solid #e5e5e5', 
              borderRadius: '6px',
              background: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={300}>300</option>
          </select>
          <span style={{ fontSize: '0.9rem', color: '#6b6b6b' }}>per page</span>
        </div>
      </section>
    
      <div className="sort-container">
          <p className='filter'>Sort by:</p>
        <button onClick={() => handleSort("Name")} className={`sort-btn ${sortBy === "Name" ? "active" : ""}`}>
          Company Name {sortBy === "Name" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("CGPA")} className={`sort-btn ${sortBy === "CGPA" ? "active" : ""}`}>
          CGPA {sortBy === "CGPA" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("Stipend")} className={`sort-btn ${sortBy === "Stipend" ? "active" : ""}`}>
          Stipend {sortBy === "Stipend" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("Arrival Date")} className={`sort-btn ${sortBy === "Arrival Date" ? "active" : ""}`}>
          Arrival Date {sortBy === "Arrival Date" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("Type")} className={`sort-btn ${sortBy === "Type" ? "active" : ""}`}>
          Type {sortBy === "Type" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("Coordinator")} className={`sort-btn ${sortBy === "Coordinator" ? "active" : ""}`}>
          Coordinator {sortBy === "Coordinator" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        {sortBy && (
          <button onClick={() => { setSortBy(""); setSortOrder("asc"); }} className="sort-btn clear-btn">
            Clear Sort
          </button>
        )}
      </div>
      
      {loading ? (
        <p className="loading">Loading companies...</p>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Job Title</th>
                  <th>CGPA</th>
                  <th>Stipend</th>
                  <th>Location</th>
                  <th>Arrival Date</th>
                  <th>Type</th>
                  <th>Coordinator</th>
                  <th>Tracked</th>
                  <th>Invited</th>
                  <th>Called</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index}>
                    <td>{company.Name}</td>
                    <td>{company["Job Title"]}</td>
                    <td>{company.CGPA}</td>
                    <td>₹{company.Stipend?.toLocaleString()}</td>
                    <td>{company.Location}</td>
                    <td>{company["Arrival Date"]}</td>
                    <td>{company.Type}</td>
                    <td>
                      {editingId === company.id ? (
                        <div className="coordinator-input-container">
                          <input
                            type="text"
                            value={coordinatorInput}
                            onChange={(e) => setCoordinatorInput(e.target.value)}
                            placeholder="Enter your name"
                            className="coordinator-input"
                          />
                          <button onClick={() => saveCoordinator(company.id)} className="btn btn-save">Save</button>
                          <button onClick={() => setEditingId(null)} className="btn btn-cancel">Cancel</button>
                        </div>
                      ) : (
                        <div className="coordinator-cell">
                          <span className={company.Coordinator ? "coordinator-name" : "coordinator-unassigned"} data-color={company.Coordinator ? getCoordinatorColor(company.Coordinator) : ""}>
                            {company.Coordinator || "Not assigned"}
                          </span>
                          <button 
                            onClick={() => handleCoordinatorUpdate(company.id, company.Coordinator)}
                            className="btn"
                          >
                            {company.Coordinator ? "Edit" : "Assign"}
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={company.Tracked || false}
                          onChange={() => toggleStatus(company.id, 'Tracked', company.Tracked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={company.Invited || false}
                          onChange={() => toggleStatus(company.id, 'Invited', company.Invited)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={company.Called || false}
                          onChange={() => toggleStatus(company.id, 'Called', company.Called)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
      </div>
    </>
  );
}

export default App