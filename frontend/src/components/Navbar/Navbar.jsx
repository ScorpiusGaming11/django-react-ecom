import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if access token is present
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Fetch cart count when the component mounts
      fetchCartCount();
    }
    setIsLoggedIn(!!accessToken);
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/shop/cart/');
      setCartCount(response.data.cart_items);
    } catch (error) {
      console.error('Error fetching cart count: ', error);
    }
  }

  const handleCartClick = () => {
    // Check if the user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      // Fetch cart count again to update the cart icon
      fetchCartCount();
      navigate('/shop/cart');
    }
  }

  const refreshAccessToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const response = await axios.post('http://127.0.0.1:8000/login/refresh/', {
        refresh: refresh,
      });
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  const handleLogout = async () => {
    try {
      let accessToken = await refreshAccessToken();
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.error('Refresh token not found');
        navigate('/login');
        return;
      }

      await axios.post('http://127.0.0.1:8000/logout/', {
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed: ', error);
      navigate('/');
    }
  }

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light navbar-bg shadow">
      <div className="container">
        <Link className="navbar-brand" to='/'>
          <img src="/assets/shop-logo.png" alt="The Plant Corner" className="img-fluid navbar-logo" />
        </Link>
        <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to='/'>HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link ms-4 me-2" to='/shop'>SHOP</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link ms-2 me-4" to='/about'>ABOUT</Link>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <button className="nav-link btn-link" onClick={handleLogout}>LOGOUT</button>
              ) : (
                <Link className="nav-link" to='/login'>LOGIN</Link>
              )}
            </li>
            <li className="d-flex align-items-center ms-4 cart" onClick={handleCartClick}>
              <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
              <span className="cart-count">({isLoggedIn ? cartCount : 0})</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;