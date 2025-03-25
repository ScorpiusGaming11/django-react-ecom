import React from "react";
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home text-white p-5">
      <div className="d-flex flex-column justify-content-center align-items-center text-center">
        <h1 className="display-1 fw-semibold">Discover the Beauty of Nature</h1>
        <p className="h3 fw-normal">Explore our wide selection of indoor and outdoor plants, succulents, herbs, and more.<br></br>
        Find the perfect green addition to your home or garden.</p>
        <Link to='/shop' className="btn btn-primary btn-lg mt-3">View Our Products</Link>
      </div>
    </div>
  );
}

export default Home;