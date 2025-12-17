import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.js';
import Home from './pages/Home.js';
import Products from './pages/Products.js';
import ProductCategories from './pages/ProductCategories.js';
import SubItems from './pages/SubItems.js';
import Admin from './pages/Admin.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import MyOrders from './pages/MyOrders.js';
import MyAddresses from './pages/MyAddresses.js';

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
        element: React.createElement(Layout, null, React.createElement(Products)) 
      }),
      React.createElement(Route, { 
        path: '/sub-items/:itemId', 
        element: React.createElement(Layout, null, React.createElement(SubItems)) 
      }),
      React.createElement(Route, { 
        path: '/items/:itemId/sub-items', 
        element: React.createElement(Layout, null, React.createElement(SubItems)) 
      }),
      React.createElement(Route, { 
        path: '/cart', 
        element: React.createElement(Layout, null, React.createElement(Cart)) 
      }),
      React.createElement(Route, { 
        path: '/checkout', 
        element: React.createElement(Layout, null, React.createElement(Checkout)) 
      }),
      React.createElement(Route, { 
        path: '/my-orders', 
        element: React.createElement(Layout, null, React.createElement(MyOrders)) 
      }),
      React.createElement(Route, { 
        path: '/my-addresses', 
        element: React.createElement(Layout, null, React.createElement(MyAddresses)) 
      }),
      React.createElement(Route, { 
        path: '/login', 
        element: React.createElement(Login) 
      }),
      React.createElement(Route, { 
        path: '/signup', 
        element: React.createElement(SignUp) 
      }),
      React.createElement(Route, { 
        path: '/admin/categories', 
        element: React.createElement(ProductCategories) 
      }),
      React.createElement(Route, { 
        path: '/admin', 
        element: React.createElement(Admin) 
      })
    )
  );
}

export default App;
