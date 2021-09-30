import './App.css';
import isElectron from './library/isElectron';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages'
import Login from './pages/login'
import MusicGeneration from './pages/music-generation'
import Dashboard from './pages/dashboard'

function App() {
  let curLocation = window.location.pathname

  return (

    <Router>
      {curLocation === '/' && <Navbar />}
      {curLocation === '/login' && <Navbar />}

      

      <Switch>
      <Route path="/" exact component={Home} render={props =>
        (<Home {...props} pieceOfState={this.state.pieceOfState}/>)}/> 
      <Route path="/login" exact component={Login} render={props =>
        (<Login {...props} pieceOfState={this.state.pieceOfState}/>)}/> 
      <Route path="/music-generation" exact component={MusicGeneration} render={props =>
        (<MusicGeneration {...props} pieceOfState={this.state.pieceOfState}/>)}/> 
      <Route path="/dashboard" exact component={Dashboard} render={props =>
        (<Dashboard {...props} pieceOfState={this.state.pieceOfState}/>)}/> 
      </Switch>
    </Router>
  );
}

console.log(isElectron())

export default App;
