import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Typography, List, Spin, message } from "antd";
import api from "../../../config/axios";
import "./TourDetail.scss";

const { Title, Paragraph } = Typography;

function TourPage() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [farmImages, setFarmImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTourDetail = async () => {
    try {
      const response = await api.get(`/tour/${id}`);
      setTour(response.data);

      const farmIds = response.data.listFarmTour.map((farmTour) => farmTour.farmId);
      const farmDataPromises = farmIds.map((farmId) => api.get(`/farm/${farmId}`));
      const farmsData = await Promise.all(farmDataPromises);

      const farms = farmsData.map((farm) => ({
        name: farm.data.farmName,
        location: farm.data.location,
        image: farm.data.image,
        koiTypes: farm.data.listFarmKoi.map((koi) => koi.koiId),
      }));

      setFarmImages(farms);
    } catch (error) {
      console.error(error.toString());
      setError("Unable to load tour data.");
      message.error("Unable to load tour data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourDetail();
  }, [id]);

  const getNumberOfDays = () => {
    if (tour?.tourStart && tour?.tourEnd) {
      const startDate = new Date(tour.tourStart);
      const endDate = new Date(tour.tourEnd);
      const timeDiff = endDate - startDate;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Adding 1 to include start day
    }
    return 0;
  };

  const numberOfDays = getNumberOfDays();

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tour) {
    return <div>Tour not found.</div>;
  }

  return (
    <div className="tour-detail">
      <div className="container">
        <header className="tour-header">
          <Title>{tour.tourName}</Title>
          <Paragraph className="tour-subtitle">{tour.description}</Paragraph>
          <Paragraph className="tour-description">{tour.recipients} participants</Paragraph>
        </header>

        <div className="tour-content">
          <div className="tour-image">
            <img src={tour.image} alt="Tour main" loading="lazy" />
          </div>

          <Card className="tour-details">
            <List>
              <List.Item>
                <strong>Duration:</strong> {tour.tourStart} - {tour.tourEnd}
              </List.Item>
              <List.Item>
                <strong>Destinations:</strong>
                <ul>
                  {farmImages.map((farm, index) => (
                    <li key={index}>{farm.name} - {farm.location}</li>
                  ))}
                </ul>
              </List.Item>
            </List>
            <div className="price">
              <div className="price-label">Price:</div>
              <div className="adult-price">
                <span>Adult:</span> {tour.priceAdult.toLocaleString()} VND
              </div>
              <div className="child-price">
                <span>Child:</span> {tour.priceChild.toLocaleString()} VND
              </div>
            </div>
            <Button className="btn-book" type="primary" onClick={() => navigate("/bookingTour", { state: { tour } })}>
              Book Tour
            </Button>
          </Card>
        </div>

        <section className="tour-schedule">
          <Title level={2}>Detailed Tour Schedule</Title>
          {[...Array(numberOfDays)].map((_, index) => (
            <div key={index} className="tour-day">
              <Title level={3}>Day {index + 1}</Title>
              <Paragraph>
                {tour.listFarmTour[index]?.description || "Enter detailed description for this day..."}
              </Paragraph>
              {farmImages[index] && (
                <img src={farmImages[index].image} alt="Farm" className="farm-image" />
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default TourPage;
