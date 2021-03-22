import logo from './logo.svg';
import './App.css';

function App() {
    const mongoose = require("mongoose");

    mongoose.connect("mongodb://127.0.0.1:27017/main", {
        useNewUrlParser: true
    });

    const connection = mongoose.connection;

    connection.once("open", function() {
        console.log("Connection with MongoDB was successful");
    });

    let detail = require("./model");
    
    /*
    detail.find({}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    */
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
        
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
