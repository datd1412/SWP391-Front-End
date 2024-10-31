import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import './farmDisplay.scss';
import FarmCard from '../farmCard/FarmCard'; 
import api from '../../config/axios';

const FarmDisplay = () => {
  const [farms, setFarms] = useState([]);

  const fetchFarms = async () => {
    try {
      const response = await api.get("/farm");
      setFarms(response.data);
    } catch (error) {
      console.log(error.toString());
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    <div className="farm-display-container">
      {/* Label cho phần hiển thị farm */}
      <div className="farm-label">
        <div className="text-wrapper-title">Koi Farm Display</div>
        <div className="text-wrapper-describe">Information about the Koi farms</div>
      </div>

      {/* Hiển thị các farm card */}
      <Row gutter={16}>
        {farms.map((farm) => (
          <Col key={farm.id} xs={24} sm={12} md={8}>
            <FarmCard farm={farm} /> {/* Thêm các FarmCard item */}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FarmDisplay;
