import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.js';
import Home from './pages/Home.js';

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      Layout,
      null,
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/', element: React.createElement(Home) })
      )
    )
  );
}

export default App;
