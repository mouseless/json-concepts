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
        <p>{ todo.services.update("test-update") }</p>
        <p>{ todo.services.delete("test-delete") }</p>
        <h1>crm</h1>
        <p>{ crm.services.negotiate("test-negotiate") }</p>
      </header>
    </div>
  );
}

export default App;
