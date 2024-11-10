import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import "./Tour.scss";

const { Meta } = Card;

const Tour = ({ searchTours }) => {
  const [tours, setTours] = useState([]);
  const [filterTours, setfilterTours] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const fetchTours = async () => {
    try {
      const response = await api.get("/tour");
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching all tours:", error.toString());
    }
  };

  useEffect(() => {
    console.log("Tha la bo di het: ", searchTours);
    if (searchTours) {
      setfilterTours(searchTours);
      setIsSearch(true);
    }
    fetchTours();
  }, []);




  return (
    <div className="tour-page">
      <div className="tour-banner">
        <h1>Explore Tours at Koi Farm</h1>
        <p>
          Enjoy an exciting tour experience at Koi Farm with many interesting
          activities.
        </p>
        <Button type="primary">
          <Link to="/book">Book a Tour</Link>
        </Button>
      </div>

      {/* Search Tours */}
      {/* Search Tours */}
      {filterTours && filterTours.length > 0 ? (
        <div className="tour-list">
          <h2>Your searching tours:</h2>
          <Row gutter={16}>
            {filterTours.map((tour) => (
              <Col span={8} key={tour.id}>
                <Card
                  cover={<img alt={tour.tourName} src={tour.image} />}
                  actions={[
                    <Button type="primary">
                      <Link to={`/tourdetail/${tour.id}`}>View Details</Link>
                    </Button>,
                  ]}
                >
                  <Meta title={tour.tourName} />
                  <p>
                    <strong>Price:</strong> {tour.priceAdult} VND
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {new Date(tour.tourStart).toLocaleString()} -{" "}
                    {new Date(tour.tourEnd).toLocaleString()}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <>
        {
          isSearch ? (
            <h2 style={{
              textAlign: 'center',
              margin: '50px 0',
              padding: '50px 0',
              border: '1px solid #EB9448',
              borderRadius: '10px'
            }}>
              No tours were found that meet your requirements 😭😭😭
              </h2>
          ) : (
            <>
            </>
          )
        }
        </>
      )}

      {/* Danh sách Tour */}
      <section className="tour-list">
        <h2>Tour List</h2>
        <Row gutter={16}>
          {tours.length > 0 ? (
            tours.map((tour) => (
              <Col span={8} key={tour.id}>
                <Card
                  cover={<img alt={tour.tourName} src={tour.image} />}
                  actions={[
                    <Button type="primary">
                      <Link to={`/tourdetail/${tour.id}`}>View Details</Link>
                    </Button>,
                  ]}
                >
                  <Meta title={tour.tourName} />
                  <p>
                    <strong>Price:</strong> {tour.priceAdult} VND
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {new Date(tour.tourStart).toLocaleString()} -{" "}
                    {new Date(tour.tourEnd).toLocaleString()}
                  </p>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <p>No tours available based on your filters.</p>
            </Col>
          )}
        </Row>
      </section>
    </div>
  );
};

export default Tour;
