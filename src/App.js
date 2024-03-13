import logo from './logo.svg';
import './App.css';
import ChoreTracker from './components/ChoreTracker';
import ChoreTable from './components/ChoreTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ChoreTracker />
        <ChoreTable />
      </header>
    </div>
  );
}

export default App;
