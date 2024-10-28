import React, { useEffect, useState } from "react";
import { Modal } from "antd"; 
import "./KoiFish.scss";
import api from "../../config/axios";

const KoiFish = () => {
  const [koiFishs, setKoiFishs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State cho thanh tìm kiếm

  const fetchKoiFishs = async () => {
    try {
      const response = await api.get("/koifish");
      setKoiFishs(response.data);
    } catch (error) {
      console.log(error.toString());
    }
  };

  useEffect(() => {
    fetchKoiFishs();
  }, []);

  const showModal = (fish) => {
    setSelectedFish(fish);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm để xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc danh sách cá theo tên
  const filteredKoiFishs = koiFishs.filter(fish => 
    fish.koiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="koifish">
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên cá..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <h2>Tổng hợp các loại cá koi</h2>
      <div className="koi-grid">
        {filteredKoiFishs.map((fish, index) => (
          <div className="koi-card" key={index} onClick={() => showModal(fish)}>
            <img 
              src={fish.image || "https://via.placeholder.com/150"} 
              alt={fish.koiName} 
              className="koi-image" 
            />
            <h3>{fish.koiName}</h3>
            <p>Giá: {fish.price.toLocaleString()} VND</p>
          </div>
        ))}
      </div>

      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedFish && (
          <div>
            <img
              alt={selectedFish.koiName}
              src={selectedFish.image || "https://via.placeholder.com/500"}
              style={{ width: "100%", marginBottom: "40px" }}
            />
            <p><strong>Tên loại cá:</strong> {selectedFish.koiName}</p>
            <p><strong>Trại:</strong> {selectedFish.farmKoiList[0]?.farmId}</p>
            <p><strong>Giá:</strong> {selectedFish.price.toLocaleString()} VND</p>
            <p><strong>Mô tả:</strong> {selectedFish.detail}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KoiFish;
