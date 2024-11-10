import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { UserOutlined, WalletOutlined, CalendarOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import api from '../../../config/axios'; // Giả sử bạn đã cấu hình axios

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [tourCount, setTourCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [tourRevenueStats, setTourRevenueStats] = useState([]);
  const [bookingComparison, setBookingComparison] = useState([]);
  const [paidIncomeData, setPaidIncomeData] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AA00FF', '#FF5722', '#76FF03', '#FFC107'];

  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        // Gọi API để lấy thông tin từ "admin/stats"
        const response = await api.get("/admin/stats");
        const stats = response.data;

        // Set dữ liệu nhận được từ API
        setTotalIncome(stats.totalMoney);
        setBookingCount(stats.totalTours);
      } catch (error) {
        console.error("Error fetching total income: ", error);
      }
    };

    const fetchTourCount = async () => {
      try {
        // Gọi API để lấy thông tin về tất cả các tour
        const response = await api.get("/tour");
        setTourCount(response.data.length);
      } catch (error) {
        console.error("Error fetching tour count: ", error);
      }
    };

    const fetchTourRevenueStats = async () => {
      try {
        // Gọi API để lấy tất cả các booking
        const response = await api.get("/booking/all");
        const bookings = response.data;

        // Tổng hợp dữ liệu doanh thu của từng tour
        const tourData = {};
        const comparisonData = {};
        let totalPaidIncome = 0;

        for (let booking of bookings) {
          if (!comparisonData[booking.tourId]) {
            comparisonData[booking.tourId] = {
              tourName: booking.tourName,
              totalBookings: 0,
              paidBookings: 0,
            };
          }
          comparisonData[booking.tourId].totalBookings += 1;

          // Kiểm tra trạng thái thanh toán từ order API
          const bookingDetailsResponse = await api.get(`/booking/${booking.id}`);
          const bookingDetails = bookingDetailsResponse.data;

          if (bookingDetails.paymentStatus === "PAID") {
            // Gọi API để lấy thông tin order
            const orderResponse = await api.get(`/order/${booking.id}`);
            const orderDetails = orderResponse.data;
            const orderTotal = orderDetails.total;

            if (!tourData[booking.tourId]) {
              tourData[booking.tourId] = {
                tourName: booking.tourName,
                totalIncome: 0,
              };
            }
            tourData[booking.tourId].totalIncome += orderTotal;
            totalPaidIncome += orderTotal;
            comparisonData[booking.tourId].paidBookings += 1;
          }
        }

        const tourStatsArray = Object.keys(tourData).map(tourId => ({
          tourName: tourData[tourId].tourName,
          totalIncome: tourData[tourId].totalIncome,
        }));

        const bookingComparisonArray = Object.keys(comparisonData).map(tourId => ({
          tourName: comparisonData[tourId].tourName,
          totalBookings: comparisonData[tourId].totalBookings,
          paidBookings: comparisonData[tourId].paidBookings,
        }));

        setTourRevenueStats(tourStatsArray);
        setBookingComparison(bookingComparisonArray);

        // Dữ liệu cho biểu đồ Pie về tổng số tiền kiếm được từ các booking đã thanh toán
        const paidIncomeDataArray = Object.keys(tourData).map(tourId => ({
          name: tourData[tourId].tourName,
          value: tourData[tourId].totalIncome,
        }));

        setPaidIncomeData(paidIncomeDataArray);
        setTotalIncome(totalPaidIncome); // Update total income to reflect only paid bookings
      } catch (error) {
        console.error("Error fetching tour revenue statistics: ", error);
      }
    };

    const fetchBookingTrends = async () => {
      try {
        // Gọi API để lấy tất cả các booking
        const response = await api.get("/booking/all");
        const bookings = response.data;

        // Tổng hợp dữ liệu số lượng booking theo tháng
        const monthlyBookings = Array(12).fill(0);
        bookings.forEach(booking => {
          const month = new Date(booking.bookingDate).getMonth();
          monthlyBookings[month] += 1;
        });

        const bookingTrendsArray = monthlyBookings.map((count, index) => ({
          month: `Month ${index + 1}`,
          bookings: count,
        }));

        setBookingTrends(bookingTrendsArray);
      } catch (error) {
        console.error("Error fetching booking trends: ", error);
      }
    };

    fetchTotalIncome();
    fetchTourCount();
    fetchTourRevenueStats();
    fetchBookingTrends();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3}>Management Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <Typography.Text strong>Total Tours: {tourCount}</Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <Typography.Text strong>Total Bookings: {bookingCount}</Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WalletOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <Typography.Text strong>Total Income: {totalIncome.toLocaleString()} VND</Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: '40px' }}>
        <Typography.Title level={4}>Income Distribution by Tour (Paid Bookings)</Typography.Title>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={paidIncomeData}
              cx="50%"
              cy="50%"
              outerRadius={160}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ value }) => `${((value / totalIncome) * 100).toFixed(2)}%`}
            >
              {paidIncomeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '20px' }}>
          {paidIncomeData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index % COLORS.length], marginRight: '10px' }}></div>
              <Typography.Text>{item.name}: {item.value.toLocaleString()} VND</Typography.Text>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <Typography.Title level={4}>Tour Booking Comparison</Typography.Title>
        <Typography.Paragraph>
          This chart compares the total bookings of each tour to the bookings that have been fully paid.
        </Typography.Paragraph>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={bookingComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="tourName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalBookings" fill="#8884d8" name="Total Bookings" />
            <Bar dataKey="paidBookings" fill="#82ca9d" name="Paid Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: '40px' }}>
        <Typography.Title level={4}>Tour Booking Trends Over the Year</Typography.Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#FF8042" name="Number of Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
