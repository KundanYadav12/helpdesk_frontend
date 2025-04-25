



// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import Home from './pages/Home'; // Dashboard or landing after login
// import NotFound from './pages/NotFound';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import UploadTicket from './pages/UploadTicket';
import TicketList from './pages/TicketList';
import PrivateRoute from './components/PrivateRoute';
import MyTickets from './pages/MyTickets';
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="" element={<Layout />}>
          {/* Protected routes */}
          <Route path="/upload-ticket" element={<PrivateRoute><UploadTicket /></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute allowedRoles={['admin', 'agent']}><TicketList /></PrivateRoute>} />
          <Route path="/my-tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['admin', 'agent']}><Dashboard /></PrivateRoute>} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
