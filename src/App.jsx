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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    Name: '',
    CGPA: '',
    Title: '',
    Stipend: '',
    'Stipend Info': '',
    Location: '',
    'Job Title': '',
    Type: '',
    'Arrival Date': ''
  });
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  const handleAddCompany = async (e) => {
    e.preventDefault();
    
    if (!newCompanyData.Name.trim()) {
      alert('Company name is required');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: newCompanyData.Name,
          CGPA: newCompanyData.CGPA ? parseFloat(newCompanyData.CGPA) : null,
          Title: newCompanyData.Title || null,
          Stipend: newCompanyData.Stipend ? parseFloat(newCompanyData.Stipend) : null,
          'Stipend Info': newCompanyData['Stipend Info'] || null,
          Location: newCompanyData.Location || null,
          'Job Title': newCompanyData['Job Title'] || null,
          Type: newCompanyData.Type || null,
          'Arrival Date': newCompanyData['Arrival Date'] || null
        }),
      });
      
      if (!response.ok) throw new Error("Failed to add company");
      
      // Reset form and close modal
      setNewCompanyData({
        Name: '',
        CGPA: '',
        Title: '',
        Stipend: '',
        'Stipend Info': '',
        Location: '',
        'Job Title': '',
        Type: '',
        'Arrival Date': ''
      });
      setShowAddModal(false);
      
      // Refresh the company list
      setCurrentPage(1);
      alert('Company added successfully!');
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Failed to add company");
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
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
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
  }, [currentPage, sortBy, sortOrder, companiesPerPage, searchQuery]);

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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 8px 0' }}>T&P Tracking Team</h1>
          <p className="header-info">Total Companies: {totalCount} | Showing: {companies.length}</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px',
              background: '#0a0a0a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#2a2a2a'}
            onMouseLeave={(e) => e.target.style.background = '#0a0a0a'}
          >
            + Add Company
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search company name..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '0.9rem',
                width: '250px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0a0a0a'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                style={{
                  padding: '8px 12px',
                  background: '#0a0a0a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}
              >
                Clear
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
      
      {/* Add Company Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Company</h2>
            <form onSubmit={handleAddCompany}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Company Name <span style={{ color: '#ff0000' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyData.Name}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, Name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCompanyData.CGPA}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, CGPA: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Job Title</label>
                <input
                  type="text"
                  value={newCompanyData['Job Title']}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, 'Job Title': e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stipend</label>
                <input
                  type="number"
                  value={newCompanyData.Stipend}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, Stipend: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Location</label>
                <input
                  type="text"
                  value={newCompanyData.Location}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, Location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Type</label>
                <input
                  type="text"
                  value={newCompanyData.Type}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, Type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Arrival Date</label>
                <input
                  type="text"
                  value={newCompanyData['Arrival Date']}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, 'Arrival Date': e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#0a0a0a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  Add Company
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#ffffff',
                    color: '#0a0a0a',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App