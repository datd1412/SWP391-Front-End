import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal } from "antd";
import { Link } from "react-router-dom";
import "./KoiFarm.scss";
import api from "../../config/axios";

const { Meta } = Card;

const KoiFarm = () => {
  const [farmData, setFarmData] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [koiDetails, setKoiDetails] = useState({});
  const [tourImages, setTourImages] = useState({}); // New state to store tour images by ID

  // Fetch farm list data from API when component mounts
  const fetchKoiFarm = async () => {
    try {
      const response = await api.get("/farm");
      setFarmData(response.data); // Save data to state
    } catch (error) {
      console.log(error.toString());
    }
  };

  // Fetch detailed data of a specific farm by ID
  const fetchKoiFarmDetails = async (farmId) => {
    try {
      const response = await api.get(`/farm/${farmId}`);
      setSelectedFarm(response.data); // Save selected farm data to state
      fetchAllKoiDetails(response.data.listFarmKoi); // Fetch koi details for each koi in the farm
      fetchTourImages(response.data.listFarmTour); // Fetch tour images for each tour
    } catch (error) {
      console.log(error.toString());
    }
  };
  
  // Fetch koi details by koiId
  const fetchKoiDetails = async (koiId) => {
    try {
      const response = await api.get(`/koifish/${koiId}`);
      return response.data; // Return koi details
    } catch (error) {
      console.log(error.toString());
      return null;
    }
  };

  // Fetch details for all kois in the selected farm
  const fetchAllKoiDetails = async (listFarmKoi) => {
    const details = {};
    for (const koi of listFarmKoi) {
      const koiDetail = await fetchKoiDetails(koi.koiId);
      if (koiDetail) {
        details[koi.koiId] = koiDetail; // Store koi details by koiId
      }
    }
    setKoiDetails(details); // Save koi details to state
  };

 
  useEffect(() => {
    fetchKoiFarm();
  }, []);

  const showModal = (farm) => {
    fetchKoiFarmDetails(farm.id); // Fetch details for the selected farm
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedFarm(null); // Clear selected farm
    setKoiDetails({}); // Clear koi details
    setTourImages({}); // Clear tour images
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
                  <img
                    src={
                      koiDetails[koi.koiId]?.image || "default-koi-image.jpg"
                    }
                    alt={koiDetails[koi.koiId]?.koiName}
                    className="koi-thumbnail"
                    style={{ maxWidth: 400, maxHeight: 400 }}
                  />
                  <p>
                    <span style={{ fontWeight: "bold" }}> Koi Name:</span>{" "}
                    {koiDetails[koi.koiId]?.koiName || "Loading..."}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Quantity:</span>{" "}
                    {koi.quantity}
                  </p>
                  <Button type="primary" style={{ marginTop: 8 }}>
                    <Link to={`/koifish?selectedKoiId=${koi.koiId}`}>
                      View Detail
                    </Link>
                  </Button>
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
