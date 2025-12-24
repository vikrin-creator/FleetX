import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout.js';
import ProtectedRoute from './components/common/ProtectedRoute.js';
import Home from './pages/Home.js';
import Products from './pages/Products.js';
import ProductCategories from './pages/ProductCategories.js';
import SubItems from './pages/SubItems.js';
import SubItemDetail from './pages/SubItemDetail.js';
import Admin from './pages/Admin.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import MyOrders from './pages/MyOrders.js';
import MyAddresses from './pages/MyAddresses.js';
import Profile from './pages/Profile.js';
import ChangePassword from './pages/ChangePassword.js';
import ForgotPassword from './pages/ForgotPassword.js';
import PrivacyPolicy from './pages/PrivacyPolicy.js';
import ShippingReturnPolicy from './pages/ShippingReturnPolicy.js';
import CancellationRefundPolicy from './pages/CancellationRefundPolicy.js';
import TermsConditions from './pages/TermsConditions.js';
import ContactUs from './pages/ContactUs.js';
import TestJWT from './pages/TestJWT.js';
import AuthDebug from './pages/AuthDebug.js';

function App() {
  return React.createElement(
    AuthProvider,
    null,
    React.createElement(
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
        path: '/sub-item/:subItemId', 
        element: React.createElement(Layout, null, React.createElement(SubItemDetail)) 
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
        element: React.createElement(Layout, null, React.createElement(ProtectedRoute, null, React.createElement(MyOrders))) 
      }),
      React.createElement(Route, { 
        path: '/my-addresses', 
        element: React.createElement(Layout, null, React.createElement(ProtectedRoute, null, React.createElement(MyAddresses))) 
      }),
      React.createElement(Route, { 
        path: '/profile', 
        element: React.createElement(Layout, null, React.createElement(ProtectedRoute, null, React.createElement(Profile))) 
      }),
      React.createElement(Route, { 
        path: '/change-password', 
        element: React.createElement(Layout, null, React.createElement(ProtectedRoute, null, React.createElement(ChangePassword))) 
      }),
      React.createElement(Route, { 
        path: '/login', 
        element: React.createElement(Login) 
      }),
      React.createElement(Route, { 
        path: '/forgot-password', 
        element: React.createElement(ForgotPassword) 
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
      }),
      React.createElement(Route, { 
        path: '/privacy-policy', 
        element: React.createElement(Layout, null, React.createElement(PrivacyPolicy)) 
      }),
      React.createElement(Route, { 
        path: '/shipping-return-policy', 
        element: React.createElement(Layout, null, React.createElement(ShippingReturnPolicy)) 
      }),
      React.createElement(Route, { 
        path: '/cancellation-refund-policy', 
        element: React.createElement(Layout, null, React.createElement(CancellationRefundPolicy)) 
      }),
      React.createElement(Route, { 
        path: '/terms-conditions', 
        element: React.createElement(Layout, null, React.createElement(TermsConditions)) 
      }),
      React.createElement(Route, { 
        path: '/contact', 
        element: React.createElement(Layout, null, React.createElement(ContactUs)) 
      }),
      React.createElement(Route, { 
        path: '/test-jwt', 
        element: React.createElement(Layout, null, React.createElement(ProtectedRoute, null, React.createElement(TestJWT))) 
      }),
      React.createElement(Route, { 
        path: '/auth-debug', 
        element: React.createElement(Layout, null, React.createElement(AuthDebug)) 
      })
      )
    )
  );
}

export default App;
