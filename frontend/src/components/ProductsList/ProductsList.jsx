import React from "react";
import './ProductsList.css';

const ProductsList = ({ plants, onAddToCart }) => {
  return (
    <div className="row">
      {plants.map((plant) => (
        <div key={plant.id} className="col-md-4 mb-4">
          <div className="card product-card shadow m-3">
            <img src={plant.images[0]} alt={plant.name} className="card-img-top product-img" />
            <div className="card-body">
              <h3 className="card-title">{plant.name}</h3>
              <p className="card-text">{plant.description}</p>
              <h5 className="card-text">Price: {plant.price}</h5>
              <h5 className="card-text">Stock: {plant.stock > 0 ? plant.stock : 'Out of Stock'}</h5>
              <button 
              className={`btn ${plant.stock > 0 ? 'btn-primary' : 'btn-secondary disabled'}`}
              onClick={() => onAddToCart(plant)}
              disabled={plant.stock <= 0}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductsList;