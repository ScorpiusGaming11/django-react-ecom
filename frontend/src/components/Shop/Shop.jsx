import React, { useState, useEffect } from "react";
import './Shop.css';
import ProductsList from "../ProductsList/ProductsList";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/shop/');
        setPlants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/shop/categories/');
        const mapping = {};
        response.data.forEach(category => {
          mapping[category.id] = category.name;
        });
        setCategoryMapping(mapping);
      } catch (err) {
        console.error('Failed to fetch categories: ', err);
      }
    }

    fetchPlants();
    fetchCategories();
  }, []);

  const handleAddToCart = (plant) => {
    // Check if the user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      setCart([...cart, plant]);
      alert(`${plant.name} added to cart!`);
    }
  }

  const groupedPlants = plants.reduce((acc, plant) => {
    const categoryName = categoryMapping[String(plant.category)] || 'Uncategorized';
    if(!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(plant);
    return acc;
  }, {});

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="shop">
      <h1 className="display-1 my-5">Our Products</h1>
      {Object.entries(groupedPlants).map(([category, categoryPlants]) => (
        <div className="category" key={category}>
          <div className="category-header">
            <span></span>
            <h1 className="category-title">{category}</h1>
            <span></span>
          </div>
          <ProductsList plants={categoryPlants} onAddToCart={handleAddToCart} />
        </div>
      ))}
    </div>
  );
}

export default Shop;