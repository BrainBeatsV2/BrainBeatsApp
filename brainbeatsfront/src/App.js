import './App.css';
import Navbar from './components/Navbar'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './pages'
import Login from './pages/login'
import MusicGeneration from './pages/music-generation'
import Dashboard from './pages/dashboard'

function App() {
  let curLocation = window.location.pathname

  return (
    
    <Router>
      { curLocation === '/' && <Navbar /> }
      { curLocation === '/login' && <Navbar /> }
      
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/music-generation" exact component={MusicGeneration} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;
