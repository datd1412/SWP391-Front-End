import React from 'react';
import { Carousel } from 'antd';
import TourCard from '../tourCard/tourCard';
import './TourDisplay.scss';

const TourDisplay = () => {
  return (
    <div className="carousel-container">
      <div className="tour-label">
        <div className="text-wrapper-title">Ghi gi do</div>
        <div className="text-wrapper-describe">mieu ta gi do</div>
      </div>
      <div className="Carousel-bar">
        <Carousel
          arrows={true} // Hiển thị nút mũi tên điều hướng
          infinite={false} // Không cuộn lại từ đầu
          slidesToShow={3} // Số lượng mục hiển thị trên một màn hình
          slidesToScroll={1} // Số lượng mục cuộn mỗi lần
          draggable={true} // Kéo để cuộn
          dots={false}
        >
          <div className="carousel-item">
            <TourCard isFirst={true} />
          </div>
          <div className="carousel-item">
            <TourCard isFirst={false} />
          </div>
          <div className="carousel-item">
            <TourCard isFirst={false} />
          </div>
          <div className="carousel-item">
            <TourCard isFirst={false} />
          </div>
          <div className="carousel-item">
            <TourCard isFirst={false} />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default TourDisplay;
