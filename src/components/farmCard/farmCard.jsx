import React from "react";
import { Card, Button } from "antd";
import "./FarmCard.scss"; // File CSS chứa các class đã định nghĩa


function farmCard({ farm }) {
  return (
    <Card className="farm-card">
      <div className="farm-card-content">
        {/* Bên trái hiển thị hình ảnh farm */}
        <img src="https://koitrips.com/wp-content/uploads/2016/09/DSC_0006-1.jpg" alt="Farm Image" className="farm-image" />

        {/* Bên phải hiển thị thông tin */}
        <div className="farm-info">
          <h2 className="farm-title">{farm?.farmName}</h2>
          <h4>{farm?.startTime} - {farm?.endTime}</h4>
          <p className="farm-description">
            {farm?.description}
          </p>
          <div className="farm-actions">
            <Button className="farm-btn nut-xanh">Green</Button>
            <Button className="farm-btn nut-do">Red</Button>
            <Button className="farm-btn nut-vang">Yellow</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default farmCard