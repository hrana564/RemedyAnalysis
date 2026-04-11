import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' })

  // Load users from data.json
  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users)
        setFilteredUsers(data.users)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  // Apply filtering
  useEffect(() => {
    let result = users
    
    if (searchTerm) {
      result = result.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredUsers(result)
  }, [searchTerm, users])

  // Apply sorting
  useEffect(() => {
    let sortedUsers = [...filteredUsers]
    
    if (sortConfig.key) {
      sortedUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    setFilteredUsers(sortedUsers)
  }, [sortConfig])

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return '↕️'
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Find user in our sample data
    const foundUser = users.find(
      u => u.username === username && u.password === password
    )
    
    if (foundUser) {
      setIsLoggedIn(true)
      setUserRole(foundUser.role)
      setError('')
    } else {
      setError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
    setUserRole('')
  }

  if (!isLoggedIn) {
    return (
      <div className="app">
        {/* Emirates NBD Header */}
        <header className="navbar">
          <div className="container">
            <div className="navbar__inner">
              <a href="/en" className="navbar__brand" title="Emirates NBD">
                <img src="/-/media/enbd/images/logos/horizontal_logo.svg?la=en&amp;hash=A33654369475CF9B1FA76FEB570F9B9D" alt="Emirates NBD" />
              </a>
              
              <div className="navbar__content">
                <div className="d-flex align-items-center ml-auto">
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Login Form */}
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="logo">
                <h2>Enterprise Network Dashboard</h2>
              </div>
              <p>Secure Access Portal</p>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="login-btn">Sign In</button>
            </form>
            <div className="login-footer">
              <p>© 2023 Enterprise Network Dashboard. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Emirates NBD Header */}
      <header className="navbar">
        <div className="container">
          <div className="navbar__inner">
            <a href="/en" className="navbar__brand" title="Emirates NBD">
              <img src="/-/media/enbd/images/logos/horizontal_logo.svg?la=en&amp;hash=A33654369475CF9B1FA76FEB570F9B9D" alt="Emirates NBD" />
            </a>
            
            <div className="navbar__content">
              <div className="d-flex align-items-center ml-auto">
                <div className="user-info">
                  <span>Welcome, {username}</span>
                  <span className="role-badge">{userRole}</span>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Landing Page with Table */}
      <main className="dashboard-main">
        <div className="landing-page">
          <h1>User Management Dashboard</h1>
          
          {/* Search Filter */}
          <div className="filter-section">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* User Table */}
          <table className="user-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('username')} className="sortable">
                  Username {getSortIcon('username')}
                </th>
                <th onClick={() => requestSort('role')} className="sortable">
                  Role {getSortIcon('role')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App
