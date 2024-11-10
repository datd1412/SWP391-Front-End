import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import "./KoiFish.scss";
import api from "../../config/axios";

const KoiFish = () => {
  const [koiFishs, setKoiFishs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const location = useLocation();

  const fetchKoiFishs = async () => {
    try {
      const response = await api.get("/koifish");
      setKoiFishs(response.data);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const fetchKoiDetails = async (koiId) => {
    try {
      const response = await api.get(`/koifish/${koiId}`);
      setSelectedFish(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const fetchFarmDetails = async (koiId) => {
    try {
      // Fetch farm data for the koi
      const response = await api.get(`/api/farm/${koiId}`);
      return response.data.listFarmKoi;
    } catch (error) {
      console.log(error.toString());
      return [];
    }
  };

  useEffect(() => {
    const { selectedKoiId } = queryString.parse(location.search);
    if (selectedKoiId) {
      fetchKoiDetails(selectedKoiId);
    }
    fetchKoiFishs();
  }, [location.search]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedFish(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredKoiFishs = koiFishs.filter((fish) =>
    fish.koiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className="koifish">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by koi name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <h2>All Koi Fish</h2>
      <div className="koi-grid">
        {filteredKoiFishs.map((fish) => (
          <div
            className="koi-card"
            key={fish.id}
            onClick={() => fetchKoiDetails(fish.id)}
          >
            <img
              src={fish.image || "https://via.placeholder.com/150"}
              alt={fish.koiName}
              className="koi-image"
            />
            <h3>{fish.koiName}</h3>
            <p>Price: {fish.price.toLocaleString()} VND</p>
          </div>
        ))}
      </div>

      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {selectedFish && (
          <div>
            <img
              alt={selectedFish.koiName}
              src={selectedFish.image || "https://via.placeholder.com/500"}
              style={{ width: "100%", marginBottom: "40px" }}
            />
            <p><strong>Type:</strong> {selectedFish.koiType}</p>
            <p><strong>Name:</strong> {selectedFish.koiName}</p>
            <p><strong>Price:</strong> {selectedFish.price.toLocaleString()} VND</p>
             {/* Display Farms and Quantities */}
             <div>
              <h3>Farm(s) and Quantity:</h3>
              {selectedFish.farmKoiList?.map((farmKoi, index) => (
                <div key={index}>
                  <p><strong>Farm {index + 1}:</strong> {farmKoi.farmId}</p>
                  <p><strong>Quantity:</strong> {farmKoi.quantity}</p>
                </div>
              ))}
            </div>
            <p><strong>Description:</strong> {isDescriptionExpanded ? selectedFish.detail : `${selectedFish.detail.slice(0, 100)}...`}</p>
            <Button type="link" onClick={toggleDescription}>
              {isDescriptionExpanded ? "Show Less" : "Read More"}
            </Button>

           
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KoiFish;
