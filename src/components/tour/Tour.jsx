import React, { useEffect, useState } from "react";

import { Card, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import "./Tour.scss";
import api from "../../config/axios";

const { Meta } = Card;

const Tour = () => {
  const [tours, setTours] = useState([]); 

  
    
    const fetchTours = async () => {
      try {
        const response = await api.get("/tour"); 
        setTours(response.data); 
      } catch (error) {
        console.error(error.toString()); 
      }
    }; 

    useEffect(() => {
      fetchTours();
    }, []);
  

  return (
    <div className="tour-page">
      {/* Banner */}
      <div className="tour-banner">
        <h1>Khám Phá Các Tour Tại Đây</h1>
        <p>Trải nghiệm một chuyến tham quan đầy thú vị tại đây với nhiều hoạt động hấp dẫn.</p>
        <Button type="primary">
          <Link to="/book">Đặt Tour Ngay</Link>
        </Button>
      </div>

      {/* Danh Sách Các Tour */}
      <section className="tour-list">
        <h2>Danh Sách Các Tour</h2>
        <Row gutter={16}>
          {tours.map((tour) => (
            <Col span={8} key={tour.id}>
              <Card
                cover={<img alt={tour.tourName} src={tour.image} />}
                actions={[
                  <Button type="primary">
                    <Link to={`/tourdetail/${tour.id}`}>Xem Chi Tiết</Link>
                  </Button>
                ]}
              >
                <Meta title= {tour.tourName}  />
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

export default Tour;
