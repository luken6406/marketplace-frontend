import CreateListing from './components/pages/CreateListing';
import Listings from './components/pages/Listings';
import Profile from './components/pages/Profile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App() {

  return (
    <Router>
      <Navbar />

      <Routes>

        <Route path='/home' element={<Listings />}/>
        <Route path='/list' element={<CreateListing />}/>
        <Route path='/profile' element={<Profile />}/>

      </Routes>
    </Router>
  )
}