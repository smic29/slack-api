import './App.css';
import Home from './Components/Home/Home';
import Channels from './Components/Channels/Channels';
import Dms from './Components/DMs/Dms';
import NotFound from './Components/NotFound';
import Navigation from './Components/Navigation/Navigation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DataProvider from './Context/DataProvider';

function App() {
  return (
    <DataProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigation />}>
              <Route index element={<Home />} />
              <Route path='channels' element={<Channels />} />
              <Route path='dms' element={<Dms />} />
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      </DataProvider>
  );
}

export default App;
