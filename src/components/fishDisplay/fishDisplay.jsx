import React, { useEffect, useState } from "react";
import { Carousel, Modal, Button } from "antd";
import "./FishDisplay.scss"; // Đảm bảo bạn tạo file SCSS này
import FishCard1 from "../fishcard1/FishCard1"; // Giả sử FishCard1 đã tồn tại
import api from "../../config/axios"; // Giả sử api đã được cấu hình

const FishDisplay = () => {
  const [fishData, setFishData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Trạng thái mô tả

  const fetchFishData = async () => {
    try {
      const response = await api.get("/koifish");
      setFishData(response.data.slice(0, 3)); // Lấy chỉ 3 con cá
    } catch (error) {
      console.log(error.toString());
    }
  };

  useEffect(() => {
    fetchFishData();
  }, []);

  const showModal = (fish) => {
    setSelectedFish(fish);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDescriptionExpanded(false); // Reset trạng thái mô tả khi đóng modal
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded); // Đảo ngược trạng thái mô tả
  };

  return (
    <div className="fish-display">
      <div className="carousel-container">
        <div className="fish-label">
          <div className="text-wrapper-title">Fish Type</div>
        </div>
        <div className="Carousel-bar">
          <Carousel
            arrows={true}
            infinite={false}
            slidesToShow={3}
            slidesToScroll={1}
            dotPosition="bottom"
            draggable={true}
          >
            {fishData.map((fish, index) => (
              <div className="carousel-item" key={index}>
                <FishCard1 fish={fish} onViewDetail={() => showModal(fish)} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {selectedFish && (
          <div>
            <img
              alt={selectedFish.koiName}
              src={selectedFish.image || "https://via.placeholder.com/500"}
              style={{ width: "100%", marginBottom: "20px" }}
            />
            <p>
              <strong>Tên loại cá:</strong> {selectedFish.koiName}
            </p>
            <p>
              <strong>Trại:</strong> {selectedFish.farmKoiList[0]?.farmId}
            </p>
            <p>
              <strong>Giá:</strong> {selectedFish.price} VND
            </p>
            <p>
              <strong>Mô tả:</strong> {isDescriptionExpanded ? selectedFish.detail : `${selectedFish.detail.slice(0, 100)}...`}
            </p>
            <Button type="link" onClick={toggleDescription}>
              {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FishDisplay;
