// ---------------------------
// this file is generated
// DO NOT modify code here
// ---------------------------

import './App.css';
import { business } from './Services';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>business</h1>
        <p>{ business.services.get() }</p>
        <p>{ business.services.getByName("test-name", "test-nameAdded") }</p>
      </header>
    </div>
  );
}

export default App;
