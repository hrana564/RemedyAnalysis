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
        <header className="app-header">
          <h1>Welcome, {username}!</h1>
          <p>Your role: {userRole}</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </header>
    </div>
  )
}

export default App
