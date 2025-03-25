import React from "react";
import './About.css';

const About = () => {
  return (
    <div className="container about">
      <div className="row align-items-center mb-5">
        <div className="col-md-6 about-1-img">
          <img src="../../assets/about-1.jpg" alt="About Image" className="img-fluid" />
        </div>
        <div className="col-md-6 about-1-texts">
          <h1>Who Are We?</h1>
          <p>We are a passionate team dedicated to bringing the beauty of nature into your homes. We believe in the power of plants to enhance your living spaces and improve your well-being.</p>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-md-6 about-2-texts order-md-1">
          <h1>What's Our Mission?</h1>
          <p>Our mission is to provide high-quality plants and exceptional customer service. We strive to make gardening accessible to everyone, from beginners to experienced plant enthusiasts.</p>
        </div>
        <div className="col-md-6 about-2-img order-md-2">
          <img src="../../assets/about-2.jpg" alt="About Image" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default About;