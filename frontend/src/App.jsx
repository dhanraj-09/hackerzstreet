import { GoogleOAuthProvider } from '@react-oauth/google';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';


import Login from './pages/Login';


function App() {
  return (

      <GoogleOAuthProvider clientId="947114585566-mcmpppp1l943i88fo78j7egn2sem000t.apps.googleusercontent.com">

        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />

            </Routes>
          </div>
        </Router>
      </GoogleOAuthProvider>
  );
}

export default App;
