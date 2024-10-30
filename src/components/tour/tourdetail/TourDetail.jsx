import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams để lấy ID từ URL
import Slider from 'react-slick';
import './TourDetail.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import api from '../../../config/axios'; // Import axios config

function TourPage() {
  const { id } = useParams(); // Lấy ID tour từ URL
  const mainSlider = useRef(null);
  const thumbSlider = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [tour, setTour] = useState(null); 
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải
  const [error, setError] = useState(null); // State để theo dõi lỗi nếu có

  const navigate = useNavigate();

  // Hàm fetch thông tin chi tiết tour
  const fetchTourDetail = async () => {
    try {
      const response = await api.get(`/tour/${id}`); // Fetch dữ liệu tour theo ID
      setTour(response.data); // Cập nhật state với dữ liệu tour
    } catch (error) {
      console.error(error.toString());
      setError('Không thể tải dữ liệu tour.'); // Thiết lập thông báo lỗi
    } finally {
      setLoading(false); // Đặt trạng thái tải về false sau khi hoàn thành
    }
  };

  useEffect(() => {
    fetchTourDetail(); // Gọi hàm fetch khi component mount
  }, [id]); // Chạy lại khi ID thay đổi

  // Nếu đang tải, hiển thị thông báo
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div>{error}</div>;
  }

  // Nếu không tìm thấy tour
  if (!tour) {
    return <div>Tour không tồn tại.</div>;
  }

  // Chuyển đổi danh sách hình ảnh thành mảng
  const mainImages = [
    tour.image, // Sử dụng hình ảnh từ tour
    ...tour.listFarmTour.map(farmTour => farmTour.image) // Nếu có hình ảnh trong listFarmTour
  ];

  const mainSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: nav2,
    arrows: true,
    fade: true,
  };

  const thumbSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: nav1,
    focusOnSelect: true,
    arrows: false,
    centerMode: true,
  };

  return (
    <div className="tour-detail">
      <div className="container">
        <header className="tour-header">
          <h1>{tour.tourName}</h1>
          <p className="tour-subtitle">{tour.decription}</p>
          <p className="tour-description">
            {tour.recipients} người tham gia
          </p>
        </header>

        <div className="tour-content">
          <div className="tour-image">
            <button onClick={() => mainSlider.current.slickPrev()} className="prev-button">◀</button>
            <button onClick={() => mainSlider.current.slickNext()} className="next-button">▶</button>

            <Slider {...mainSettings} ref={mainSlider} className="main-slider">
              {mainImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Slide ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </Slider>

            {/* Slider hình thu nhỏ */}
            <Slider {...thumbSettings} ref={thumbSlider} className="thumbnail-slider">
              {mainImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Thumbnail ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </Slider>
          </div>

          <div className="tour-details">
            <ul>
              <li><strong>Thời gian:</strong> {tour.tourStart} - {tour.tourEnd}</li>
              <li><strong>Phương tiện:</strong> Máy bay</li>
              <li><strong>Nơi khởi hành:</strong> Hồ Chí Minh</li>
            </ul>
            <p className="price">
              <span className="old-price">{tour.priceAdult.toLocaleString()} đ</span>
              <span className="new-price">{tour.priceChild.toLocaleString()} đ</span>
            </p>
            <button className="btn-book" onClick={() => navigate("/bookingTour", {state: {tour}})} >Đặt Tour</button>
          </div>
        </div>

        <section className="tour-schedule">
          <h2>Chương trình tour chi tiết</h2>
          {/* Hiển thị lịch trình tour nếu có */}
          {tour.listFarmTour.map((farmTour, index) => (
            <div key={index} className="tour-day">
              <h3>{farmTour.title}</h3>
              <p>{farmTour.description}</p>
            </div>
          ))}
        </section>

        <footer className="tour-footer">
          <p>&copy; 2024 Koi Farm. Bảo lưu mọi quyền.</p>
        </footer>
      </div>
    </div>
  );
}

export default TourPage;
