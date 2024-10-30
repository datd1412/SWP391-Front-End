import { Avatar, Button, Col, DatePicker, Divider, Form, Input, InputNumber, List, Menu, Popover, Result, Row, Space, Steps, Typography } from 'antd'
import React, { useState } from 'react'
import './BookingPage.scss'
import { BankOutlined, DollarOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBooking } from '../../redux/action/bookingActions';

const { Text, Title } = Typography;

function BookingPage() {
    const description = 'This is a description.';
    const location = useLocation();
    const dispatch = useDispatch();
    const tour = location.state?.tour;
    console.log("ID: ", tour);
    const [steps, setSteps] = useState(0);

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleAdultCount = (count) => {
        setAdults((prev) => Math.max(1, prev + count));
    }

    const handleChildrenCount = (count) => {
        setChildren((prev) => Math.max(0, prev + count));
    }

    const items = [
        {
            title: 'Tour Detail',
            description,
        },
        {
            title: 'Payment Detail',
            description,
        },
        {
            title: 'Review Order',
            description,
        },
    ];

    const paymentMethods = [
        {
            title: 'VNPAY',
            icon: <BankOutlined />,
        },
        {
            title: 'Pay with Cash',
            icon: <DollarOutlined />,
        },
    ];

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
                                            Next
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
                                <Text style={{fontSize: '20px'}}>
                                    Approval may take 5-10 minutes—Please check back to complete payment.
                                </Text>
                                <Button className='payment-return-btn'>Home</Button>
                            </div>
                            <Divider />
                            <Row className='payment-gateway-row'>
                                <Col span={12} className='payment-gateway-left'>
                                    <Avatar shape='square' size={200} src="src/image/vnpay_logo.png" />
                                </Col>
                                <Col span={12}>
                                    <div className='payment-gateway-right'>
                                        <Title>A better way to <strong>Pay Money</strong></Title>
                                        <Button className='payment-method-btn'>See How it Works</Button>
                                    </div>
                                </Col>
                            </Row>






                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default BookingPage