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
import Discover from './pages/discover'
import Help from './pages/help'
import Account from './pages/my-account'
import Settings from './pages/settings'


function App() {
  let curLocation = window.location.pathname

  return (
    
    <Router>
      



      <Switch>
        <Route path="/" exact component={Home} render={props =>
          (<Home {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/login" exact component={Login} render={props =>
          (<Login {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/music-generation" exact component={MusicGeneration} render={props =>
          (<MusicGeneration {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/dashboard" exact component={Dashboard} render={props =>
          (<Dashboard {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route path="/play" exact component={Play} render={props =>
          (<Play {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
          <Route path="/discover" exact component={Discover} render={props =>
          (<Discover {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
          <Route path="/help" exact component={Help} render={props =>
          (<Help {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
          <Route path="/settings" exact component={Settings} render={props =>
          (<Settings {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
          <Route path="/my-account" exact component={Account} render={props =>
          (<Account {...props} username={this.state.username} password={this.state.password} email={this.state.email} />)} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}

console.log(isElectron())

export default App;
