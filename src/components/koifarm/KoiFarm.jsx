import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal } from "antd";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./KoiFarm.scss";
import api from "../../config/axios";

const { Meta } = Card;

const KoiFarm = () => {
  const [farmData, setFarmData] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch farm data from API when component mounts
  const fetchKoiFarm = async () => {
    try {
      const response = await api.get("/farm");
      setFarmData(response.data); // Save data to state
    } catch (error) {
      console.log(error.toString());
    }
  };

  useEffect(() => {
    fetchKoiFarm();
  }, []);

  const showModal = (farm) => {
    setSelectedFarm(farm);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedFarm(null); // Clear selected farm
  };

  return (
    <div className="koi-farm-page">
      {/* Header Banner */}
      <div className="header-banner">
        <h1>Welcome to Koi Farm</h1>
        <p>Discover the best Koi fish raised with care and dedication.</p>
      </div>

      {/* Farm Highlights Section */}
      <section className="farm-highlights">
        <h2>Farm</h2>
        <Row gutter={16}>
          {farmData.map((farm) => (
            <Col key={farm.id} span={8}>
              <Card
                cover={
                  <img
                    alt={farm.farmName}
                    src={farm.image || "default-image.jpg"}
                  />
                }
                onClick={() => showModal(farm)} // Show modal on click
              >
                <Meta title={farm.farmName} />
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      {/* Modal for Farm Details */}
      <Modal
        title={selectedFarm?.farmName}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedFarm && (
          <>
            <p>{selectedFarm.description}</p>
            <h3>Available Tours:</h3>
            <div className="tour-list">
              {selectedFarm.listFarmTour.map((tour) => (
                <div key={tour.tourId} className="tour-item">
                  <h4>Tour for {selectedFarm.farmName}</h4>
                  <p>{tour.description}</p>
                  <Button type="primary" style={{ marginTop: 8 }}>
                    <Link to={`/tourdetail/${tour.tourId}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
            <h3>Koi Available:</h3>
            <div className="koi-list">
              {selectedFarm.listFarmKoi.map((koi) => (
                <div key={koi.koiId} className="koi-item">
                  <p>Koi ID: {koi.koiId}</p>
                  <p>Quantity: {koi.quantity}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default KoiFarm;
