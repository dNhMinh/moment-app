import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';

// function App() {
//   return (
//     <div className="App">
//       <Home />
//     </div>
//   );
// }

class App extends Component{
  render() {
    return (
      <div className='app'>
        <Home />
      </div>
    );
  }
}

export default App;
