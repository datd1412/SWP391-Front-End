import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Typography, List, Spin, message } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../../config/axios";
import "./TourDetail.scss";

const { Title, Paragraph } = Typography;

function TourPage() {
  const { id } = useParams();
  const mainSlider = useRef(null);
  const [tour, setTour] = useState(null);
  const [farmImages, setFarmImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTourDetail = async () => {
    try {
      const response = await api.get(`/tour/${id}`);
      setTour(response.data);
  
      // Lấy danh sách farmId từ tour
      const farmIds = response.data.listFarmTour.map(farmTour => farmTour.farmId);
      const farmDataPromises = farmIds.map(farmId => api.get(`/farm/${farmId}`));
      const farmsData = await Promise.all(farmDataPromises);
  
      const farms = farmsData.map(farm => ({
        name: farm.data.farmName,
        location: farm.data.location,
        image: farm.data.image,
        koiTypes: farm.data.listFarmKoi.map(koi => koi.koiId), // Lưu danh sách các loại cá
      }));
  
      setFarmImages(farms);
    } catch (error) {
      console.error(error.toString());
      setError("Không thể tải dữ liệu tour.");
      message.error("Không thể tải dữ liệu tour.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTourDetail();
  }, [id]);

  if (loading) {
    return <Spin tip="Đang tải..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tour) {
    return <div>Tour không tồn tại.</div>;
  }

  return (
    <div className="tour-detail">
      <div className="container">
        <header className="tour-header">
          <Title>{tour.tourName}</Title>
          <Paragraph className="tour-subtitle">{tour.decription}</Paragraph>
          <Paragraph className="tour-description">
            {tour.recipients} người tham gia
          </Paragraph>
        </header>

        <div className="tour-content">
          <div className="tour-image">
            <img src={tour.image} alt="Tour main" loading="lazy" />
          </div>

          <Card className="tour-details">
            <List>
              <List.Item>
                <strong>Thời gian:</strong> {tour.tourStart} - {tour.tourEnd}
              </List.Item>
              <List.Item>
                <strong>Địa điểm đến:</strong>
                <ul>
                  {farmImages.map((farm, index) => (
                    <li key={index}>
                      {farm.name} - {farm.location}
                    </li>
                  ))}
                </ul>
              </List.Item>
            </List>
            <div className="price">
              <div className="price-label">Giá:</div>
              <div className="adult-price">
                <span>Người lớn:</span> {tour.priceAdult.toLocaleString()} đ
              </div>
              <div className="child-price">
                <span>Trẻ em:</span> {tour.priceChild.toLocaleString()} đ
              </div>
            </div>
            <Button className="btn-book" type="primary" onClick={() => navigate("/bookingTour", { state: { tour } })}>
              Đặt Tour
            </Button>
          </Card>
        </div>

        <section className="tour-schedule">
          <Title level={2}>Chương trình tour chi tiết</Title>
          {tour.listFarmTour.map((farmTour, index) => (
            <div key={index} className="tour-day">
              <Title level={3}>{farmTour.title}</Title>
              <Paragraph>{farmTour.description}</Paragraph>
              {farmImages[index] && (
                <img
                  src={farmImages[index].image}
                  alt="Farm"
                  className="farm-image"
                />
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default TourPage;
