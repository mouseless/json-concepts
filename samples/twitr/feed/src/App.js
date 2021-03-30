// ---------------------------
// this file is generated
// DO NOT modify code here
// ---------------------------

import './App.css';
import { todo, crm } from './client/services';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>todo</h1>
        <p>{ todo.services.update("test-done", "test-by", "test-doneAdded") }</p>
        <p>{ todo.services.delete() }</p>
        <h1>crm</h1>
        <p>{ crm.services.negotiate("test-price", "test-priceAdded") }</p>
      </header>
    </div>
  );
}

export default App;
