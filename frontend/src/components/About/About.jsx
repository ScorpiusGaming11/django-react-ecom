import React from "react";
import './About.css';

const About = () => {
  return (
    <div className="about d-flex flex-column justify-content-center align-items-center">
      <div className="about-section-1 row align-items-center">
        <div className="col-md-6 about-1-img">
          <img src="/assets/about-1.jpg" alt="About Image" className="img-fluid rounded shadow-lg" />
        </div>
        <div className="col-md-6 about-1-texts">
          <h1 className="display-3 fw-semibold">Who Are We?</h1>
          <p>We are a passionate team of plant enthusiasts dedicated to bringing the beauty and tranquility of nature into your homes. Our journey began with a simple love for greenery and a desire to create living spaces that inspire and rejuvenate. We believe that plants have the power to transform any environment, fostering a sense of calm and well-being. With years of experience in horticulture and a deep understanding of plant care, we curate a diverse selection of high-quality plants, each chosen for its unique beauty and ability to thrive in various settings.</p>
        </div>
      </div>
      <div className=" about-section-2 row align-items-center">
        <div className="col-md-6 about-2-texts order-md-1">
          <h1 className="display-3 fw-semibold">What's Our Mission?</h1>
          <p>Our mission is to provide high-quality plants and exceptional customer service, fostering a thriving community of plant lovers. We strive to make gardening accessible to everyone, from beginners taking their first steps into gardening to experienced plant enthusiasts seeking to expand their collections. Through our carefully curated selection of healthy plants, expert advice, and dedication to customer satisfaction, we empower our customers to create beautiful and fulfilling green spaces that enhance their lives and contribute to a healthier planet.</p>
        </div>
        <div className="col-md-6 about-2-img order-md-2">
          <img src="/assets/about-2.jpg" alt="About Image" className="img-fluid rounded shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default About;