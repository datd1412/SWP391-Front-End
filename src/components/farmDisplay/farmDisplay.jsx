import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import './farmDisplay.scss';
import FarmCard from '../farmCard/FarmCard'; 
import api from '../../config/axios';

const farmDisplay = () => {


 
  const [farms, setFarms] = useState([]);

  const fetchFarms = async () => {
    try {
      const response = await api.get("/farm");
      setFarms(response.data);
    } catch (error) {
      console.log(error.toString());
    }
  }

  useEffect(() => {
    fetchFarms();
  }, [])


  return (
    <div className="carousel-container">
      {/* Label cho phần hiển thị farm */}
      <div className="farm-label">
        <div className="text-wrapper-title">Koi Farm Display</div>
        <div className="text-wrapper-describe">Information about the Koi farms</div>
      </div>

      {/* Carousel hiển thị các farm card */}
      <div className="carousel-bar">
        <Carousel
          arrows={true} // Hiển thị nút mũi tên điều hướng
          infinite={false} // Không cuộn lại từ đầu
          slidesToShow={1} // Chỉ hiển thị 1 FarmCard trên một màn hình
          slidesToScroll={1} // Số lượng mục cuộn mỗi lần là 1
          dotPosition="bottom" // Vị trí của dot indicator
          draggable={true} // Kéo để cuộn
        >
          
          {farms.map((farm) => (
            <div key={farm.id} className="carousel-item">
              <FarmCard farm={farm} /> {/* Thêm các FarmCard item */}
            </div>
          ))}

        </Carousel>
      </div>
    </div>
  );
};

export default farmDisplay;