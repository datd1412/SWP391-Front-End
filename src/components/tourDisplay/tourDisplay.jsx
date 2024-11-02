import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './TourDisplay.scss';
import api from '../../config/axios'; // Ensure this is your API configuration

const { Meta } = Card;

const TourDisplay = () => {
  const [tours, setTours] = useState([]); // State to hold tour data

  // Fetch tour data from the API
  const fetchTours = async () => {
    try {
      const response = await api.get('/tour'); // Fetch data from the API
      setTours(response.data); // Set the state with fetched data
    } catch (error) {
      console.error('Error fetching tours:', error); // Log any errors
    }
  };

  useEffect(() => {
    fetchTours(); // Call fetchTours when the component mounts
  }, []);

  // Get only the first 3 tours
  const limitedTours = tours.slice(0, 3);

  return (
    <div className="tour-display-container">
      <div className="tour-label">
        <div className="text-wrapper-title">Tour Listings</div>
        <div className="text-wrapper-describe">Explore our exciting tours!</div>
      </div>
      {/* List of Tours */}
      <section className="tour-list">
        <Row gutter={16}>
          {limitedTours.map((tour) => (
            <Col span={8} key={tour.id}>
              <Card
                cover={<img alt={tour.tourName} src={tour.image} style={{width:576, height:400}} />}
                actions={[
                  <Button type="primary">
                    <Link to={`/tourdetail/${tour.id}`}>Xem Chi Tiết</Link>
                  </Button>
                ]}
              >
                <Meta title={tour.tourName} />
                <p>
                  <strong>Giá:</strong> {tour.priceAdult}đ
                </p>
                <p>
                  <strong>Thời gian:</strong> {new Date(tour.tourStart).toLocaleString()} - {new Date(tour.tourEnd).toLocaleString()}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default TourDisplay;
