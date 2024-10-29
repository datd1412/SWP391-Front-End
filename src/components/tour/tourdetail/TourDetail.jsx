import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Typography, List, Spin, message } from 'antd'; // Import antd components
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import api from '../../../config/axios';
import './TourDetail.scss';

const { Title, Paragraph } = Typography;

function TourPage() {
  const { id } = useParams();
  const mainSlider = useRef(null);
  const thumbSlider = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTourDetail = async () => {
    try {
      const response = await api.get(`/tour/${id}`);
      setTour(response.data);
    } catch (error) {
      console.error(error.toString());
      setError('Không thể tải dữ liệu tour.');
      message.error('Không thể tải dữ liệu tour.'); // Use antd message for error feedback
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

  const mainImages = [
    tour.image,
    ...tour.listFarmTour.map(farmTour => farmTour.image),
  ];

  const mainSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: nav2,
    arrows: true,
    fade: true,
  };

  const thumbSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: nav1,
    focusOnSelect: true,
    arrows: false,
    centerMode: true,
  };

  return (
    <div className="tour-detail">
      <div className="container">
        <header className="tour-header">
          <Title>{tour.tourName}</Title>
          <Paragraph className="tour-subtitle">{tour.description}</Paragraph>
          <Paragraph className="tour-description">
            {tour.recipients} người tham gia
          </Paragraph>
        </header>

        <div className="tour-content">
          <div className="tour-image">
            <Button onClick={() => mainSlider.current.slickPrev()} className="prev-button">◀</Button>
            <Button onClick={() => mainSlider.current.slickNext()} className="next-button">▶</Button>

            <Slider {...mainSettings} ref={mainSlider} className="main-slider">
              {mainImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Slide ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </Slider>

            <Slider {...thumbSettings} ref={thumbSlider} className="thumbnail-slider">
              {mainImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Thumbnail ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </Slider>
          </div>

          <Card className="tour-details">
            <List>
              <List.Item>
                <strong>Thời gian:</strong> {tour.tourStart} - {tour.tourEnd}
              </List.Item>
              <List.Item>
                <strong>Phương tiện:</strong> Máy bay
              </List.Item>
              <List.Item>
                <strong>Nơi khởi hành:</strong> Hồ Chí Minh
              </List.Item>
            </List>
            <Paragraph className="price">
              <span className="old-price">{tour.priceAdult.toLocaleString()} đ</span>
              <span className="new-price">{tour.priceChild.toLocaleString()} đ</span>
            </Paragraph>
            <Button className="btn-book" type="primary">Đặt Tour</Button>
          </Card>
        </div>

        <section className="tour-schedule">
          <Title level={2}>Chương trình tour chi tiết</Title>
          {tour.listFarmTour.map((farmTour, index) => (
            <div key={index} className="tour-day">
              <Title level={3}>{farmTour.title}</Title>
              <Paragraph>{farmTour.description}</Paragraph>
            </div>
          ))}
        </section>

        <footer className="tour-footer">
          <Paragraph>&copy; 2024 Koi Farm. Bảo lưu mọi quyền.</Paragraph>
        </footer>
      </div>
    </div>
  );
}

export default TourPage;
