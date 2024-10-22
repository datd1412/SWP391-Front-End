import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import './FarmDisplay.scss';
import FarmCard from '../farmCard/FarmCard'; // Đảm bảo bạn đã tạo FarmCard component
import api from '../../config/axios';

const farmDisplay = () => {


  /* const farms = [
    {
      "id": 0,
      "farmName": "string",
      "location": "string",
      description: "string",
      "startTime": "2024-10-09T09:40:59.345Z",
      "endTime": "2024-10-09T09:40:59.346Z",
      "farmTourEntities": [
        {
          "id": 0,
          "description": "string",
          "farm": "string",
          "tour": {
            "id": 0,
            "tourName": "string",
            "tourStart": "2024-10-09T09:40:59.346Z",
            "tourEnd": "2024-10-09T09:40:59.346Z",
            "decription": "string",
            "tourPrice": 0,
            "farmTourEntities": [
              "string"
            ]
          }
        }
      ],
      "farmKoisEntities": [
        {
          "id": 0,
          "koiFish": {
            "id": 0,
            "koiName": "string",
            "detail": "string",
            "price": 0,
            "farmKoisEntities": [
              "string"
            ]
          },
          "farmKoi": "string",
          "quantity": 0
        }
      ]
    }
  ]; */

  const [farms, setFarms] = useState([]);

  const fetchFarms = async () => {
    try {
      const response = await api.get("/admin/farm/all");
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
