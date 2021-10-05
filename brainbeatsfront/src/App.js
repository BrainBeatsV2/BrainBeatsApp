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
        (<Home {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)}/> 
      <Route path="/login" exact component={Login} render={props =>
        (<Login {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)}/> 
      <Route path="/music-generation" exact component={MusicGeneration} render={props =>
        (<MusicGeneration {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)}/> 
      <Route path="/dashboard" exact component={Dashboard} render={props =>
        (<Dashboard {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)}/> 
      <Route component={Home}/>
      </Switch>
    </Router>
  );
}

console.log(isElectron())

export default App;
