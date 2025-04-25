// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404 - Page Not Found</h1>
      <p className="lead">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}

export default NotFound;
