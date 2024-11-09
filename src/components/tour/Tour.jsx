import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Input, DatePicker, Select } from "antd";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import api from "../../config/axios";
import "./Tour.scss";

const { Meta } = Card;
const { Option } = Select;

const Tour = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [koiType, setKoiType] = useState(null);

  const location = useLocation();
  const searchResults = location.state?.searchResults;

  const fetchTours = async () => {
    try {
      const response = await api.get("/tour");
      const allTours = response.data;

      // Hiển thị các kết quả tìm kiếm trước, sau đó là các tour khác
      const displayedTours = searchResults
        ? [
            ...searchResults,
            ...allTours.filter(
              (tour) => !searchResults.some((result) => result.id === tour.id)
            ),
          ]
        : allTours;

      setTours(displayedTours);
      setFilteredTours(displayedTours);
    } catch (error) {
      console.error("Error fetching all tours:", error.toString());
    }
  };

  useEffect(() => {
    fetchTours();
  }, [searchResults]);

  // Hàm lọc các tour dựa trên tiêu chí đã chọn
  const filterTours = () => {
    const filtered = tours.filter((tour) => {
      const matchesName = searchName
        ? tour.tourName.toLowerCase().includes(searchName.toLowerCase())
        : true;
  
      // Kiểm tra ngày bắt đầu
      const matchesStartDate =
        startDate && startDate.isValid()
          ? moment(tour.tourStart).isSame(startDate, "day")
          : true;
  
      const matchesPrice = priceFilter
        ? (priceFilter === "under1m" && tour.priceAdult < 1000000) ||
          (priceFilter === "under2m" && tour.priceAdult < 2000000) ||
          (priceFilter === "under5m" && tour.priceAdult < 5000000)
        : true;
  
      // Kiểm tra loại cá
      const matchesKoiType = koiType
        ? tour.listFarmTour.some((farmTour) =>
            farmImages.some((farm) =>
              farm.koiTypes.includes(koiType) && farmTour.farmId === farm.id
            )
          )
        : true;
  
      return matchesName && matchesStartDate && matchesPrice && matchesKoiType;
    });
    setFilteredTours(filtered);
  };
  
  useEffect(() => {
    filterTours();
  }, [searchName, startDate, priceFilter, koiType]);

  // Hàm đặt lại tất cả các bộ lọc
  const resetFilters = () => {
    setSearchName("");
    setStartDate(null);
    setPriceFilter(null);
    setKoiType(null);
    setFilteredTours(tours);
  };

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

      {/* Bộ lọc tìm kiếm */}
      <div className="tour-filters">
        <Input
          placeholder="Search by tour name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: "20%", marginRight: "1rem" }}
        />
        <DatePicker
          placeholder="Select Start Date"
          onChange={(date) => {
            console.log("Selected Date:", date); // Kiểm tra giá trị được chọn
            setStartDate(date);
          }}
          style={{ marginRight: "1rem" }}
          value={startDate}
        />

        <Select
          placeholder="Filter by Price"
          onChange={(value) => setPriceFilter(value)}
          style={{ width: "15%", marginRight: "1rem" }}
          value={priceFilter}
        >
          <Option value="under1m">Under 1M VND</Option>
          <Option value="under2m">Under 2M VND</Option>
          <Option value="under5m">Under 5M VND</Option>
        </Select>
        <Select
          placeholder="Filter by Koi Type"
          onChange={(value) => setKoiType(value)}
          style={{ width: "15%", marginRight: "1rem" }}
          value={koiType}
        >
          <Option value="koiType1">Koi Type 1</Option>
          <Option value="koiType2">Koi Type 2</Option>
          <Option value="koiType3">Koi Type 3</Option>
          {/* Thêm các tùy chọn khác nếu cần */}
        </Select>
        <Button type="default" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {/* Danh sách Tour */}
      <section className="tour-list">
        <h2>Tour List</h2>
        <Row gutter={16}>
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => (
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
