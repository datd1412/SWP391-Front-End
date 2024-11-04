import { Avatar, Button, Col, DatePicker, Form, Input, InputNumber, List, Menu, Popover, Result, Row, Space, Steps } from 'antd'
import React, { useState } from 'react'
import './TestSearch.scss'
import { BankOutlined, DollarOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBooking } from '../../redux/action/bookingActions';

function BookingPage() {
    const description = 'This is a description.';
    const location = useLocation();
    const dispatch = useDispatch();
    const tour = location.state?.tour;
    const [steps, setSteps] = useState(1);

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
            <div className='tracking-bar'>
                <Steps current={steps}>
                    {items.map((step, index) => (
                        <Steps key={index} title={step.title} />
                    ))}
                </Steps>
            </div>

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
                        <div className='booking-method-board'>
                            <div className='booking-payment-logo'>
                                <div className='booking-payment-logo-item'></div>
                            </div>
                            <h2>How do you want to pay?</h2>

                            <List
                                itemLayout="horizontal"
                                dataSource={paymentMethods}
                                renderItem={item => (
                                    <List.Item
                                        onClick={() => setSelectedMethod(item.title)}
                                        style={{
                                            backgroundColor: selectedMethod === item.title ? '#c3fdd7' : 'white',
                                            cursor: 'pointer',
                                            borderRadius: selectedMethod === item.title ? '8px' : '0px',
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={item.icon} />}
                                            title={item.title}
                                        />
                                        <div className='next-arrow'>{'>'}</div>
                                    </List.Item>
                                )}
                            />

                            <div className='btn-payment'>
                                <Button
                                    className='btn-booking prev'
                                    onClick={() => setSteps((steps) => steps - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    className='btn-booking next'
                                    onClick={handlePayment}
                                    disabled={!selectedMethod}
                                >
                                    Next
                                </Button>
                            </div>

                        </div>
                    </div>
                )}

                {steps == items.length - 1 && (
                    <div>
                        <div className='success-container' style={{
                            height: '605px',
                        }}>
                            <Result
                                status="success"
                                title={`Successfully booking for ${tour.tourName}`}
                                subTitle="It takes 1-5 minutes for your order to be approved, please wait."
                                extra={[
                                    <Button type="primary" key="console">
                                        Return Home
                                    </Button>,
                                    <Button key="buy">Track My Order</Button>,
                                ]}
                            />
                        </div>
                        <Button
                            className='btn-booking-prev'
                            onClick={() => setSteps((steps) => steps - 1)}
                        >
                            Previous
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingPage