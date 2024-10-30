import React, { useEffect, useState } from 'react';
import './ProfilePage.scss'
import {
  BankOutlined,
  CloseCircleTwoTone,
  CreditCardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Form, Input, Layout, List, Menu, Modal, Radio, Row, Space, Switch, Tag, theme, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { useDispatch, useSelector } from 'react-redux';
import { faCalendar, faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setUser } from '../../redux/action/userAction';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

function ProfilePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const user = useSelector((state) => state.user);
  const dispath = useDispatch();
  const bookingList = useSelector((state) => state.bookings.bookings);
  const [myBookings, setmyBookings] = useState([]);
  const [myOrder, setmyOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const navigate = useNavigate();

  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const statusColorMap = {
    APPROVED: 'green',
    REJECTED: 'red',
    PROCESSING: 'yellow',
    PENDING: 'default',
  };

  const makingPayment = async (orderId) => {
    setIsModalVisible(true);
    try {
      const response = await api.get(`/order/${orderId}`);
      setmyOrder(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePayment = () => {
    console.log('Continuing with payment...');

  };


  const fetchBookings = async (tourId, bookingId) => {
    const tourInfo = await api.get(`/tour/${tourId}`);
    const bookingInfo = await api.get(`/booking/${bookingId}`);
    const row = {
      invoiceNo: bookingId,
      tourName: tourInfo.data.tourName,
      availableDates: [
        { date: tourInfo.data.tourStart, isCheckin: true },
        { date: tourInfo.data.tourEnd, isCheckin: false },
      ],
      isPaid: bookingInfo.data.paymentStatus,
      status: bookingInfo.data.status,
      location: "Ben Tre",
      avatar: "src/image/dong_thap.png",
    };
    setmyBookings((prevmyBookings) => [...prevmyBookings, row]);
    console.log(bookingInfo.data);
  };

  useEffect(() => {
    bookingList.map((index) => (
      fetchBookings(index.tourId, index.bookingId)
    ))

  }, []);

  const toggleEdit = () => {
    setIsClicked(!isClicked);
  };

  const handleUpdate = () => {
    profileForm.submit();
    passwordForm.submit();
    try {

      const profileValues = profileForm.getFieldValue();
      const passwordValues = passwordForm.getFieldValue();

      const updateInfo = {
        fullName: profileValues.fullName,
        userName: profileValues.username,
        newPassword: passwordValues.new_password,
        confirmPassword: passwordValues.retype_password,
        address: profileValues.address,
        email: profileValues.email,
      };
      const response = api.put("/user", updateInfo);
      const { confirmPassword, ...infoUpdate } = updateInfo;
      dispath(setUser(infoUpdate));
    } catch (error) {
      console.log(error.toString());
    }

  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <div className="profile-edit-container">
          <Content
            style={{
              margin: '24px 16px',
              padding: '16px 32px',
              height: 493,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Col className='left-edit-form' span={12}>
              <h2>Edit profile</h2>
              <Form
                className='profile-edit-form'
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={profileForm}
              >
                <Form.Item label="Full name" name="fullName" initialValue={user.fullName}>
                  <Input />
                </Form.Item>
                <Form.Item label="Username" name="username" initialValue={user.username} rules={[
                  {
                    required: "true",
                    message: "Username cannot be blank",
                  }
                ]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Email address" name="email" initialValue={user.email} rules={[
                  {
                    required: "true",
                    message: "Email cannot be blank",
                  }
                ]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Phone number" name="phone" rules={[
                  {
                    required: "true",
                    message: "Phone number cannot be blank"
                  },
                  {
                    pattern: '(84|0[3|5|7|8|9])+([0-9]{8})\\b',
                    message: "Illegal phone number",
                  }
                ]}
                  initialValue={user.phone}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Address" name="address" initialValue={user.address}>
                  <Input />
                </Form.Item>
              </Form>
            </Col>
            <Col className="right-edit-form" span={12}>
              <h2>Password</h2>
              <Form
                className='password-edit-form'
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={passwordForm}
              >
                <Space style={{
                  width: '100%'
                }}>
                  {isClicked ? (
                    <div>
                      <Form.Item label="New Password" name="new_password" rules={[
                        {
                          required: "true",
                          message: "Please enter new password!",
                        }
                      ]}>
                        <Input.Password />
                      </Form.Item>
                      <Form.Item label="Confirm Password" name="retype_password" rules={[
                        {
                          required: "true",
                          message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('new_password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('The two passwords do not match!')
                            );
                          },
                        }),
                      ]}>
                        <Input.Password />
                      </Form.Item>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      shape="round"
                      onClick={toggleEdit}
                      style={{ backgroundColor: '#0051FF', color: '#fff' }}
                    >
                      Change password
                    </Button>
                  )}
                </Space>
              </Form>
              <div className="submit-edit-btn">
                <Button type="primary" onClick={handleUpdate}>Save</Button>
              </div>
            </Col>
          </Content>
        </div>
      case '2':
        return <div className="profile-edit-container">
          <Content
            style={{
              margin: '24px 16px',
              padding: '16px 32px',
              height: 493,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Col span={24}>
              <h2>Notifications</h2>
              <div className='notifi-container'>
                <div className='notifi-item'>
                  Order Confirmation
                  <Switch defaultChecked={false} />
                </div>
                <div className='notifi-item'>
                  Order Delivered
                  <Switch defaultChecked={false} />
                </div>
                <div className='notifi-item'>
                  Email Notification
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </Col>
          </Content>
        </div>
      case '3':
        return <div className="profile-edit-container">
          <Content
            style={{
              margin: '24px 16px',
              padding: '16px 32px',
              height: 'fit-content',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Col span={24}>
              <h2>My Booking</h2>
              {
                myBookings.length == 0 ? (
                  <div>
                    You haven't booking any tour yet.
                  </div>
                ) : (
                  <div className="my-bookings-list">
                    <Typography.Title level={4} className="my-bookings-title">My Bookings</Typography.Title>
                    <List
                      itemLayout="vertical"
                      dataSource={myBookings}
                      renderItem={(booking) => (
                        <Card className="my-booking-card">
                          <Row gutter={16} align="middle">
                            <Col>
                              <Avatar shape="square" size={90} src={booking.avatar} />
                            </Col>
                            <Col style={{ marginLeft: '10px', marginBottom: '20px', }}>
                              <Typography.Title level={5} className="my-booking-name">
                                {booking.tourName}
                                <Tag
                                  style={{ fontSize: '15px', marginLeft: '10px' }}
                                  color={statusColorMap[booking.status.toUpperCase()]}>
                                  {booking.status.toUpperCase()}
                                </Tag>
                              </Typography.Title>
                              <Text type="secondary" style={{ fontSize: '17px', fontWeight: '480', }}>{booking.location}</Text>
                            </Col>
                            <Col>
                              {booking.availableDates.map((date, index) => (
                                <div key={index} className="my-booking-status">
                                  {date.isCheckin ? (
                                    <FontAwesomeIcon icon={faCalendar} color='#52c41a' />
                                  ) : (
                                    <FontAwesomeIcon icon={faCalendarCheck} color='#ff4d4f' />
                                  )}
                                  <Text className="my-booking-availibility-date">{date.date}</Text>
                                </div>
                              ))}
                            </Col>
                            <Col>
                              {
                                booking.isPaid === "PAID" ? (
                                  <div className='bk-payment-result'>
                                    <img width="120px" src='src/image/paid_stamp.png' />
                                  </div>
                                ) : (
                                  <Button type="link" className="complete-payment-button" onClick={() => makingPayment(booking.invoiceNo)}>
                                    Complete Payment
                                  </Button>
                                )
                              }
                              <Modal
                                title={`Invoice no ${booking.invoiceNo}`}
                                visible={isModalVisible}
                                onCancel={handleCancel}
                                footer={[
                                  <Button key="cancel" onClick={handleCancel}>
                                    Cancel
                                  </Button>,
                                  <Button
                                    key="continue"
                                    type="primary"
                                    onClick={handlePayment}
                                    disabled={!selectedMethod}
                                  >
                                    Continue to payment
                                  </Button>,
                                ]}
                              >
                                <Row>
                                  <Col span={12}>
                                    <Text>Food Fee:</Text>
                                  </Col>
                                  <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text>{myOrder?.foodFee} VND</Text>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={12}>
                                    <Text>Travel Fee:</Text>
                                  </Col>
                                  <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text>{myOrder?.travelFee} VND</Text>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={12}>
                                    <Text>Stay Fee:</Text>
                                  </Col>
                                  <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text>{myOrder?.stayFee} VND</Text>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={12}>
                                    <Text>Subtotal</Text>
                                  </Col>
                                  <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text>80 EUR</Text>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={12}>
                                    <Text>VAT (10%)</Text>
                                  </Col>
                                  <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text>20 EUR</Text>
                                  </Col>
                                </Row>
                                <Divider />
                                <Row>
                                  <Col span={12}>
                                    <Title level={4}>Total</Title>
                                  </Col>
                                  <Col span={12} style={{ textAlign: 'right' }}>
                                    <Title level={4}>{myOrder?.total}</Title>
                                  </Col>
                                </Row>

                                <Divider />

                                <Title level={5}>Choose your payment method:</Title>
                                <Radio.Group
                                  onChange={(e) => setSelectedMethod(e.target.value)}
                                  value={selectedMethod}
                                  style={{ width: '100%' }}
                                >
                                  <Radio.Button value="vnpay" style={{ width: '100%', padding: '3px', marginTop: '5px', marginBottom: '15px', borderRadius: '0px' }}>
                                    <Row>
                                      <Col style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <CreditCardOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                                        <Text style={{ marginLeft: 8, fontSize: 16 }}>VN PAY</Text>
                                      </Col>
                                    </Row>
                                  </Radio.Button>
                                  <Radio.Button value="cash" style={{ width: '100%', padding: '3px', marginBottom: '12px', borderRadius: '0px' }}>
                                    <Row>
                                      <Col style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <BankOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                                        <Text style={{ marginLeft: 8, fontSize: 16 }}>Pay with cash</Text>
                                      </Col>
                                    </Row>
                                  </Radio.Button>
                                </Radio.Group>
                                <Text
                                  underline
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#1890ff'
                                  }}
                                >
                                  Terms and Conditions
                                </Text>
                              </Modal>

                            </Col>
                          </Row>
                        </Card>
                      )}
                    />
                  </div>
                )
              }
            </Col>
          </Content>
        </div>
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null}
        collapsible collapsed={collapsed}
        style={{
          position: 'relative',
          backgroundColor: 'rgb(218, 177, 102)',
        }}>
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{
            backgroundColor: 'rgb(218, 177, 102)',
            color: '#eee',
            fontSize: '15px',
          }}
          onSelect={({ key }) => setSelectedKey(key)}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Profile',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Notifications',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'My Booking',
            },
          ]}
        />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
            position: "absolute",
            bottom: '10px',
          }}
        />
      </Sider>
      <Layout>
        <Header
          className='profile-header'
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex'
          }}
        >
          <Typography.Title
            level={2}
          >
            Welcome back, {user.data?.username}
          </Typography.Title>
        </Header>
        {
          renderContent()
        }
      </Layout>
    </Layout >
  );
};
export default ProfilePage