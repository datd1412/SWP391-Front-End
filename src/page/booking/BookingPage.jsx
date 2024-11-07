import { Avatar, Button, Col, DatePicker, Divider, Form, Image, Input, InputNumber, List, Menu, Popover, Result, Row, Space, Steps, Typography } from 'antd'
import React, { useState } from 'react'
import './BookingPage.scss'
import { BankOutlined, DollarOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBooking } from '../../redux/action/bookingActions';

const { Text, Title } = Typography;

function BookingPage() {
    const selectedTab = '3';
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tour = location.state?.tour;
    console.log("ID: ", tour);
    const [steps, setSteps] = useState(1);

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const [visibleDiv, setvisibleDiv] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleAdultCount = (count) => {
        setAdults((prev) => Math.max(1, prev + count));
    }

    const handleChildrenCount = (count) => {
        setChildren((prev) => Math.max(0, prev + count));
    }

    const content = (
        <Space className="bk-guest-board">
            <div>
                <span className="bk-left-board">
                    <span>Adults:</span>
                    <small>Ages 13 or above</small>
                </span>
                <span className="bk-right-board">
                    <Button icon={<MinusOutlined />} onClick={() => handleAdultCount(-1)} disabled={adults <= 1} />
                    <span>{adults}</span>
                    <Button icon={<PlusOutlined />} onClick={() => handleAdultCount(1)} />
                </span>
            </div>

            <div>
                <span>Children:</span>
                <small>Ages 13 below</small>
                <Button icon={<MinusOutlined />} onClick={() => handleChildrenCount(-1)} disabled={children <= 0} />
                <span>{children}</span>
                <Button icon={<PlusOutlined />} onClick={() => handleChildrenCount(1)} />
            </div>
        </Space>
    );

    const handleSubmit = async (values) => {
        try {
            const details = {
                tourId: tour.id,
                numberOfAdult: adults,
                numberOfChild: children,
                phoneNumber: values.phone,
            };

            const response = await api.post("/booking", details);
            console.log(response.data);
            /* console.log("Tour ID: " + tour.id);
            console.log("Adult: " + adults);
            console.log("Children: " + children);
            console.log("Phone: " + values.phone); */
            const newBooking = {
                tourId: tour.id, bookingId: response.data,
            };
            dispatch(addBooking(newBooking));
            setSteps(steps + 1);

        } catch (error) {
            console.log(error.toString());
        }
    }

    const handlePayment = () => {
        console.log(selectedMethod);
    }

    return (
        <div className='booking-container'>

            <div className='steps-content'>
                {steps == 0 && (
                    <div className="booking-info-container">
                        <div className="hotel-first">
                            <Row className="hotel-container">
                                <Col span={12} className="left-booking">
                                    <div className="hotel-header">
                                        <h1>Visit the top Koi Breeders.</h1>
                                        <p>We bring you not only a stay option, but an experience in your budget to enjoy the luxury.</p>
                                    </div>
                                    <div className="actions">
                                        <Button className="discover-now">Discover Now</Button>
                                    </div>

                                </Col>
                                <Col span={12} className="right-booking">
                                </Col>
                            </Row>
                        </div>
                        <div className="hotel-second">
                            <Row className="hotel-form-container">
                                <h2>Check Availability</h2>
                                <div className="hotel-wrapper">
                                    <Form className="hotel-form" layout="vertical" onFinish={handleSubmit}>
                                        <Form.Item label="Contact" className="booking-email" name="phone" rules={[
                                            {
                                                required: true,
                                                message: "Please enter your phone number!",
                                            },
                                            {
                                                pattern: '(84|0[3|5|7|8|9])+([0-9]{8})\\b',
                                                message: "Illegal phone number",
                                            },
                                        ]}>
                                            <Input placeholder="Phone number" />
                                        </Form.Item>

                                        <Form.Item label="Guests" className="booking-guests">
                                            <Popover content={content} title="Passengers" trigger="click">
                                                <Button>{`${adults} Adults , ${children} Children`}</Button>
                                            </Popover>
                                        </Form.Item>

                                        <Button type="primary" size="large" htmlType="submit" className="btn-booking-next">
                                            Confirm
                                        </Button>
                                    </Form>
                                </div>
                            </Row>
                        </div>
                        <div className="floating-images">
                            <div className="floating-image-1"></div>
                            <div className="floating-image-2"></div>
                            <div className="floating-image-3"></div>
                        </div>
                    </div>
                )}

                {steps == 1 && (
                    <div className='booking-payment'>
                        <div className='payment-method-board'>
                            <div className='payment-loader'></div>
                            <div className='payment-loading-row'>
                                <Title>Your booking is being reviewed.</Title>
                                <Text style={{ fontSize: '20px' }}>
                                    Approval may take 5-10 minutes—Please check back to complete payment.
                                </Text>
                                <Button className='payment-return-btn' onClick={() => navigate("/profile", { state: { selectedTab } })}>View My Booking</Button>
                            </div>
                            <Divider />
                            <Row className='payment-gateway-row'>
                                <Col span={12} className='payment-gateway-left'>
                                    <Avatar shape='square' size={200} src="src/image/vnpay_logo.png" />
                                </Col>
                                <Col span={12}>
                                    <div className='payment-gateway-right'>
                                        <Title>A better way to <strong>Pay Money</strong></Title>
                                        <Button
                                            className='payment-method-btn'
                                            onClick={() => setvisibleDiv(!visibleDiv)}
                                        >
                                            See How it Works
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}

            </div>
            {
                visibleDiv && (
                    <div className='payment-tutorial-container'>
                        <Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <Title>The simple way to send money</Title>
                        </Row>
                        <Row>
                            <Col span={8} className='payment-steps'>
                                <Row>
                                    <Col span={8}>
                                        <Text
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                                paddingRight: '40px',
                                                fontSize: '80px',
                                                fontWeight: 'bold',
                                                color: '#DEE3E4'
                                            }}
                                        >
                                            1
                                        </Text>
                                    </Col>
                                    <Col span={16} style={{ display: 'flex', flexDirection: 'column', paddingTop: '25px' }}>
                                        <Title level={3}>Choose your bank</Title>
                                        <Text style={{ fontSize: '16px' }}>In the payment method selection section, choose to use domestic card and bank.
                                            Then, choose your bank. </Text>
                                        <Image
                                            style={{ borderRadius: '10px', marginTop: '10px'}}
                                            width={400}
                                            src='src/image/step_1.png'
                                            preview={false}
                                        />
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={8} className='payment-steps'>
                                <Row>
                                    <Col span={8}>
                                        <Text
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                                paddingRight: '40px',
                                                fontSize: '80px',
                                                fontWeight: 'bold',
                                                color: '#DEE3E4'
                                            }}
                                        >
                                            2
                                        </Text>
                                    </Col>
                                    <Col span={16} style={{ display: 'flex', flexDirection: 'column', paddingTop: '25px' }}>
                                        <Row>
                                            <Title level={3}>Fill in your account</Title>
                                            <Text>Fill in the necessary information, such as full name, card number, etc.</Text>
                                            <Image
                                                style={{ borderRadius: '10px' }}
                                                width={400}
                                                src='src/image/step_2.png'
                                                preview={false}
                                            />
                                        </Row>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span={8} className='payment-steps'>
                                <Row>
                                    <Col span={8}>
                                        <Text
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                                paddingRight: '40px',
                                                fontSize: '80px',
                                                fontWeight: 'bold',
                                                color: '#DEE3E4'
                                            }}
                                        >                                            3
                                        </Text>
                                    </Col>
                                    <Col span={16} style={{ display: 'flex', flexDirection: 'column', paddingTop: '25px' }}>
                                        <Title level={3}>Enter an OTP</Title>
                                        <Text>The system will send the OTP code. Enter correctly and wait until notification of successful transaction process</Text>
                                        <Image
                                            style={{ borderRadius: '10px' }}
                                            width={400}
                                            src='src/image/step_3.png'
                                            preview={false}
                                        />
                                    </Col>

                                </Row>
                            </Col>
                        </Row>
                    </div>
                )
            }
        </div>
    )
}

export default BookingPage