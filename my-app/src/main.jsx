import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListingsBoardPage from './pages/ListingsBoardPage.jsx'
import AddListingPage from './pages/AddListingPage.jsx'
import EditListingPage from './pages/EditListingPage.jsx'
import SignInPage from './pages/SignIn.tsx'
import SignUpPage from './pages/SignUp.tsx'
import LandingPage from './pages/LandingPage.jsx'
import MyListingsPage from './pages/MyListingsPage.jsx'
import ItemDetailPage from './pages/ItemDetailPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/listings" element={<ListingsBoardPage />} />
        <Route path="/add" element={<AddListingPage />} />
        <Route path="/edit" element={<EditListingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />        
        <Route path="/mylistings" element={<MyListingsPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/edit/:id" element={<EditListingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
