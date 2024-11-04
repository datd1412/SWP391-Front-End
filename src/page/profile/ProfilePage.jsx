import React, { useEffect, useState } from 'react';
import './ProfilePage.scss'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Form, Input, Layout, List, Menu, Modal, Rate, Row, Space, Steps, Switch, Table, Tag, theme, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { useDispatch, useSelector } from 'react-redux';
import { faCalendar, faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setUser } from '../../redux/action/userAction';
import { cancelBooking } from '../../redux/action/bookingActions';
import { useForm } from 'antd/es/form/Form';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

function ProfilePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const user = useSelector((state) => state.user);
  const [feedbackForm] = Form.useForm();
  const dispatch = useDispatch();
  const bookingList = useSelector((state) => state.bookings.bookings);
  const [myBookings, setmyBookings] = useState([]);
  const [myOrder, setmyOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFeedback, setopenFeedback] = useState(false);
  const [koiImages, setkoiImages] = useState([]);

  const navigate = useNavigate();

  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const statusColorMap = {
    APPROVED: 'green',
    REJECTED: 'red',
    PENDING: 'yellow',
    PROCESSING: 'default',
  };

  const fetchKoiImage = async (id) => {
    try {
      const response = await api.get(`/koifish/${id}`);
      setkoiImages((prevImages) => [...prevImages, response.data.image]);
    } catch (error) {
      console.log(error.toString());
    }

  }

  const viewBookingDetails = async (booking) => {
    try {
      const response = await api.get(`/order/${booking.invoiceNo}`);
      const anOrder = {
        ...response.data,
        adults: booking.adults,
        children: booking.children,
        listOfKois: booking.koiList,
        processing: booking.processing,
      };
      setmyOrder(anOrder);
      anOrder.listOfKois.forEach((koi) => {
        if (!koiImages[koi.koiFishId]) {
          fetchKoiImage(koi.koiFishId);
        }
      })
      console.log(anOrder);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const showCancelModal = () => {
    setIsModalOpen(true);
  };

  const handleFeedback = (values) => {
    console.log(values);
  }

  const handleCancel = () => {
    setmyOrder(null);
    setIsModalOpen(false);
    setopenFeedback(false);
    console.log("hine ne ni: ", koiImages);
  };

  const handleCancelBooking = (booking) => {
    try {
      const response = api.delete(`/booking/${booking.invoiceNo}`);
      dispatch(cancelBooking(booking.invoiceNo));
      console.log("Cai nay de xoa: ", response);
    } catch (error) {
      console.log(error.toString());
    }
  };


  const columns = [
    {
      title: 'Koi Name',
      dataIndex: 'koiFishId',
      key: 'koiFishId',
      render: (koiFishId) => (
        <Avatar size={50} src={koiImages[koiFishId]} />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
    },
  ];

  const process = [
    {
      description: 'Consultation and Order Confirmation',
    },
    {
      description: 'Buying KoiFish and Delivery Scheduling',
    },
    {
      description: 'Pre-Delivery Confirmation',
    },
    {
      description: 'Delivery and Final Payment Completion',
    },
  ];

  const trackingDeliveryStatus = (processing) => {
    const index = processing.findIndex((process) => process.status === 0);
    if (index === -1) {
      return process.length - 1;
    } else {
      return index - 1;
    }
  }

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
      adults: bookingInfo.data.numberOfAdult,
      children: bookingInfo.data.numberOfChild,
      koiList: bookingInfo.data.bookingKoifish,
      isPaid: bookingInfo.data.paymentStatus,
      status: bookingInfo.data.status,
      processing: bookingInfo.data.processing,
      location: "Ben Tre",
      avatar: tourInfo.data.image,
    };
    setmyBookings((prevmyBookings) => [...prevmyBookings, row]);
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
      dispatch(setUser(infoUpdate));
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
              minHeight: '500px',
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
                        <Card
                          className="my-booking-card"
                          hoverable
                        >
                          <Row gutter={16} align="middle">
                            <Col>
                              <Avatar shape="square" size={90} src={booking.avatar} />
                            </Col>
                            <Col style={{ marginLeft: '10px', marginBottom: '20px', }}>
                              <Typography.Title level={5} className="my-booking-name">
                                {booking.tourName}
                                {
                                  booking.isPaid === "PAID" ? (
                                    <img
                                      className="bk-payment-result"
                                      src='src/image/paid_stamp.png'
                                      width="70px"
                                    />
                                  ) : (
                                    <Tag
                                      style={{ fontSize: '15px', marginLeft: '10px' }}
                                      color={statusColorMap[booking.status.toUpperCase()]}>
                                      {booking.status.toUpperCase()}
                                    </Tag>
                                  )
                                }
                              </Typography.Title>
                              <Text type="secondary" style={{ fontSize: '17px', fontWeight: '480', }}>{booking.location}</Text>
                            </Col>
                            <Col>
                              {booking.availableDates.map((date, index) => (
                                <div key={index} className="my-booking-status">
                                  {date.isCheckin ? (
                                    <div>
                                      <FontAwesomeIcon icon={faCalendar} color='#52c41a' />
                                      <Text className="my-booking-availibility-date">Checkin: {date.date}</Text>
                                    </div>
                                  ) : (
                                    <div>
                                      <FontAwesomeIcon icon={faCalendarCheck} color='#ff4d4f' />
                                      <Text className="my-booking-availibility-date">Checkout: {date.date}</Text>
                                    </div>

                                  )}
                                </div>
                              ))}
                            </Col>
                            {
                              (booking.status === "PROCESSING" || booking.status === "PENDING") ? (
                                <>
                                  <Col>
                                    <Button
                                      className='view-bk-detail-btn'
                                      onClick={() => viewBookingDetails(booking)}
                                    >
                                      View Detail
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      className="cancel-booking-btn"
                                      onClick={(e) => {
                                        showCancelModal();
                                        e.stopPropagation();
                                      }}
                                    >
                                      Cancel Booking
                                    </Button>
                                    <Modal
                                      className='cancel-booking-confirm'
                                      open={isModalOpen}
                                      onCancel={() => setIsModalOpen(false)}
                                      footer={null}
                                    >
                                      <Typography.Title
                                        level={3}
                                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                                      >
                                        Are you sure?
                                      </Typography.Title>
                                      <p style={{ textAlign: 'center', fontSize: '15px' }}>
                                        Are you sure to delete this booking? This action cannot be undone once the booking is APPROVED.
                                      </p>
                                      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                                        <Button onClick={handleCancel} style={{ borderRadius: '8px', padding: '20px 30px' }}>
                                          Cancel
                                        </Button>
                                        <Button
                                          type="primary"
                                          onClick={() => handleCancelBooking(booking)}
                                          danger
                                          style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', borderRadius: '8px', padding: '20px 30px' }}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </Modal>
                                  </Col>
                                </>
                              ) : (
                                <>
                                  {trackingDeliveryStatus(booking.processing) == process.length - 1 ? (
                                    <>
                                      <Col>
                                        <Button
                                          className='view-bk-detail-btn'
                                          onClick={() => viewBookingDetails(booking)}
                                        >
                                          View Detail
                                        </Button>
                                      </Col>
                                      <Col>
                                        <Button
                                          className='feedback-bk-btn'
                                          onClick={() => setopenFeedback(true)}
                                        >
                                          Feedback
                                        </Button>
                                      </Col>
                                      <Modal
                                        open={openFeedback}
                                        onOk={() => feedbackForm.submit()}
                                        onCancel={handleCancel}
                                        width={400}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                          <Typography.Title level={2} style={{ marginBottom: '5px' }}>Feedback</Typography.Title>
                                          <Text type='secondary' style={{ fontSize: '15px', marginBottom: '5px' }}>Please rate your experience below</Text>
                                        </div>
                                        <Form
                                          form={feedbackForm}
                                          labelCol={{
                                            span: 24,
                                          }}
                                          onFinish={handleFeedback}
                                        >
                                          <Form.Item name="rating">
                                            <Rate style={{ display: 'flex', justifyContent: 'center' }} />
                                          </Form.Item>
                                          <Form.Item label="Additional feedback" name="comment">
                                            <Input.TextArea placeholder='My Feedback!' />
                                          </Form.Item>
                                        </Form>
                                      </Modal>
                                    </>
                                  ) : (
                                    <>
                                      <Col></Col>
                                      <Col>
                                        <Button
                                          className='view-bk-detail-btn'
                                          onClick={() => viewBookingDetails(booking)}
                                        >
                                          View Detail
                                        </Button>
                                      </Col>
                                    </>
                                  )}
                                </>
                              )
                            }

                          </Row>
                        </Card>
                      )}
                    />
                  </div>
                )
              }
              {
                myOrder && (
                  <Modal
                    className='my-booking-invoice'
                    title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Invoice no. {myOrder.id}</span>}
                    open={myOrder}
                    onCancel={handleCancel}
                    footer={[
                      <Button key="cancel" onClick={handleCancel}>
                        Cancel
                      </Button>,
                      <Button
                        key="continue"
                        type="primary"
                        onClick={handleCancel}
                      >
                        Ok
                      </Button>,
                    ]}
                    width={950}
                  >
                    <Row>
                      <Col span={9}>
                        <small>WE WILL SENT AN EMAIL FOR YOUR PAYMENT</small>
                      </Col>
                      <Col span={15}>
                        <Text style={{ textAlign: 'center', fontSize: '16px', marginLeft: '15px' }}><strong>Your Booking Koi Fishs</strong></Text>
                      </Col>
                    </Row>

                    <Row
                      className='booking-invoice-body'
                      style={{
                        marginTop: '10px',
                      }}
                    >
                      <Col span={8} style={{ marginRight: '10px' }}>
                        <Row>
                          <Col span={12}>
                            <Text><strong>Passengers:</strong></Text>
                          </Col>
                          <Col span={12} style={{ textAlign: 'right' }}>
                            <Text>
                              {myOrder.adults > 0 && `${myOrder.adults} adult(s)`}
                              {myOrder.adults > 0 && myOrder.children > 0 && ', '}
                              {myOrder.children > 0 && `${myOrder.children} child(s)`}
                            </Text>
                          </Col>
                        </Row>
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
                        <Divider />
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

                        <Row>
                          <Col span={12}>
                            <Title level={4}>Total</Title>
                          </Col>
                          <Col span={12} style={{ textAlign: 'right' }}>
                            <Title level={4}>{myOrder?.total}</Title>
                          </Col>
                        </Row>

                        <Text
                          underline
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#1890ff',
                            marginTop: '10px',
                          }}
                        >
                          Terms and Conditions
                        </Text>
                      </Col>

                      <Col span={1}></Col>
                      <Col span={14} style={{ marginLeft: '10px' }} className='invoice-right-side'>
                        <Row>
                          <Col span={24}>
                            <Steps progressDot current={trackingDeliveryStatus(myOrder.processing)} style={{ paddingRight: '20px' }}>
                              {process.map((pcs, index) => (
                                <Steps key={index} title={<span style={{ fontSize: '12px' }}>{pcs.description}</span>} />
                              ))}
                            </Steps>
                          </Col>
                          <Col span={24}>
                            <Table
                            style={{ marginTop: '10px' }}
                              width='500px' 
                              columns={columns}
                              dataSource={myOrder.listOfKois}
                              pagination={{ pageSize: 2 }}
                            />
                          </Col>

                        </Row>
                      </Col>
                    </Row>
                  </Modal>
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
            Welcome back, {user.fullName}
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