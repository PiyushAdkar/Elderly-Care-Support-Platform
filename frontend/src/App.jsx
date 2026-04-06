import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Dummy Pages
const Home = () => (
  <div>
    <h2>Home Page</h2>
    <p>Welcome to the Elderly Care Support Platform.</p>
  </div>
);

const Login = () => (
  <div>
    <h2>Login Page</h2>
    <p>Please enter your credentials.</p>
  </div>
);

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Your health metrics and alerts.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <hr />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
