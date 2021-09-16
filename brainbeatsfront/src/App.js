import './App.css';
import isElectron from './library/isElectron';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages'
import Login from './pages/login'
import MusicGeneration from './pages/music-generation'
function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/music-generation" exact component={MusicGeneration} />
      </Switch>
    </Router>
  );
}


console.log(isElectron())

export default App;
