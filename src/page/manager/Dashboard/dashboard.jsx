import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { UserOutlined, WalletOutlined, CalendarOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../../../config/axios'; // Giả sử bạn đã cấu hình axios

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  // Dữ liệu mẫu cho biểu đồ thống kê thu nhập
  const data = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Expenses', value: 5000 }, // Placeholder cho chi phí
  ];

  const COLORS = ['#0088FE', '#FF8042'];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Gọi API để lấy số lượng user
//         const fetchedUserCount = await api.get("api/user/count"); // Chỉnh sửa theo API thực tế
//         setUserCount(fetchedUserCount.data);

//         // Gọi API để lấy số lượng booking (tour)
//         const fetchedBookingCount = await api.get("api/tour/booking/count"); // Chỉnh sửa theo API thực tế
//         setBookingCount(fetchedBookingCount.data);

//         // Gọi API để lấy tổng thu nhập từ tour
//         const fetchedIncome = await api.get("api/tour/income/total"); // Chỉnh sửa theo API thực tế
//         setTotalIncome(fetchedIncome.data);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };

//     fetchData();
//   }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <Typography.Text strong>User Count: {userCount}</Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <Typography.Text strong>Booking Count: {bookingCount}</Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WalletOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <Typography.Text strong>Income: {totalIncome.toLocaleString()} VND</Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: '20px' }}>
        <Typography.Title level={4}>Income Statistics</Typography.Title>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
