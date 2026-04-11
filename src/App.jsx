import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')

  // In a real app, this would be fetched from data.json
  // For now, we'll keep the sample data inline
  const users = [
    { username: 'admin', password: 'admin123', role: 'administrator' },
    { username: 'user', password: 'user123', role: 'regular' }
  ]

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

  if (isLoggedIn) {
    return (
      <div className="app">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="logo">
              <h2>Enterprise Network Dashboard</h2>
            </div>
            <div className="user-info">
              <span>Welcome, {username}</span>
              <span className="role-badge">{userRole}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </header>
          <main className="dashboard-main">
            <div className="welcome-card">
              <h1>Access Granted</h1>
              <p>You have successfully logged into the Enterprise Network Dashboard.</p>
              <div className="user-details">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Role:</strong> {userRole}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
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

export default App
