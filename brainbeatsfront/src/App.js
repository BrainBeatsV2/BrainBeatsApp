import './App.css';
import 'semantic-ui-css/semantic.css';
import isElectron from './library/isElectron';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages'
import Login from './pages/login'
import MusicGeneration from './pages/music-generation'
import Dashboard from './pages/dashboard'
import Play from './pages/play'

function App() {
  let curLocation = window.location.pathname

  return (

    <Router>
      <Navbar />



      <Switch>
        <Route path="/" exact component={Home} render={props =>
          (<Home {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/login" exact component={Login} render={props =>
          (<Login {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/music-generation" exact component={MusicGeneration} render={props =>
          (<MusicGeneration {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/dashboard" exact component={Dashboard} render={props =>
          (<Dashboard {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/play" exact component={Play} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}

console.log(isElectron())

export default App;
