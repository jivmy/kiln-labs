import Home from './pages/home';
import Suno from './pages/suno';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suno" element={<Suno />} />
      </Routes>
    </Router>
  );
}

export default App;
