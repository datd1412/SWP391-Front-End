import React, { useState } from "react";
import { Card, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import "./farmCard.scss"; // File CSS chứa các class đã định nghĩa

function FarmCard({ farm }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Card className="farm-card" onClick={showModal}>
        <div className="farm-card-content">
          {/* Bên trái hiển thị hình ảnh farm */}
          <img 
            src="https://koitrips.com/wp-content/uploads/2016/09/DSC_0006-1.jpg" 
            alt="Farm Image" 
            className="farm-image" 
          />

          {/* Bên phải hiển thị thông tin */}
          <div className="farm-info">
            <h2 className="farm-title">{farm?.farmName}</h2>
            <h4>{farm?.startTime} - {farm?.endTime}</h4>
            <p className="farm-description">{farm?.description}</p>
            <div className="farm-actions">
              <Button className="farm-btn nut-xanh">Green</Button>
              <Button className="farm-btn nut-do">Red</Button>
              <Button className="farm-btn nut-vang">Yellow</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal for Farm Details */}
      <Modal
        title={farm?.farmName}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>
        ]}
      >
        <p>{farm?.description}</p>
        <h3>Available Tours:</h3>
        <div className="tour-list">
          {farm?.listFarmTour.map(tour => (
            <div key={tour.tourId} className="tour-item">
              <h4>Tour for {farm.farmName}</h4>
              <p>{tour.description}</p>
              <Button type="primary" className="view-details-button">
                <Link to={`/tourdetail/${tour.tourId}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

export default FarmCard;
