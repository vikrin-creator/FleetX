import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.js';
import Home from './pages/Home.js';
import ProductCategories from './pages/ProductCategories.js';
import Admin from './pages/Admin.js';

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { 
        path: '/', 
        element: React.createElement(Layout, null, React.createElement(Home)) 
      }),
      React.createElement(Route, { 
        path: '/products', 
        element: React.createElement(Layout, null, React.createElement(ProductCategories)) 
      }),
      React.createElement(Route, { 
        path: '/admin', 
        element: React.createElement(Admin) 
      })
    )
  );
}

export default App;
