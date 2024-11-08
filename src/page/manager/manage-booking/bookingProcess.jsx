import React, { useEffect, useState } from 'react'; 
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, Upload, Badge, Tabs, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file';
import moment from 'moment'; // Importing moment for date formatting

import { color } from 'framer-motion';

const { TabPane } = Tabs;

function BookingProcess() {
    const [bookingData, setBookingData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("PROCESSING");
    const [selectedTour, setSelectedTour] = useState(""); // Bộ lọc tour
    const [sortOrder, setSortOrder] = useState("closest"); // Sắp xếp ngày đặt

    const fetchBookingData = async () => {
        try {
            const response = await api.get("booking/all");
            setBookingData(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching booking data");
        }
    };

    useEffect(() => {
        fetchBookingData();
    }, []);

  // Bộ lọc và sắp xếp với tùy chọn "All"
    const filteredData = bookingData
    .filter((booking) => filterStatus === "ALL" || booking.status === filterStatus)
    .filter((booking) => selectedTour === "ALL" || selectedTour === "" || booking.tourName === selectedTour) // Bộ lọc tour
    .sort((a, b) => {
        if (sortOrder === "closest") {
            return new Date(a.bookingDate) - new Date(b.bookingDate);
        } else if (sortOrder === "farthest") {
            return new Date(b.bookingDate) - new Date(a.bookingDate);
        } else {
            return 0; // Không sắp xếp nếu chọn "All"
        }
    });


    const fetchOrderData = async (id) => {
        try {
            const response = await api.get(`order/${id}`);
            return response.data;
        } catch (err) {
            toast.error(err.response?.data || "Error fetching order data");
        }
    };

    const handleEditOrder = async (booking) => {
        setCurrentBookingId(booking.id);
        const order = await fetchOrderData(booking.id);

        if (order) {
            form.setFieldsValue({
                foodFee: order.foodFee,
                travelFee: order.travelFee,
                stayFee: order.stayFee,
                pdfUrl: order.pdfUrl || '',
                description: order.description || '',
                estimateFee: booking.totalPrice,
                total: order.total,
            });

            if (order.pdfUrl) {
                setFileList([{ uid: '-1', name: 'File uploaded', status: 'done', url: order.pdfUrl }]);
            } else {
                setFileList([]);
            }
        }
        setShowModal(true);
    };

    const handleUpdateOrder = async (values) => {
        try {
            setLoading(true);
            if (fileList.length > 0) {
                const file = fileList[0];
                const url = await uploadFile(file.originFileObj);
                values.pdfUrl = url;
            }
            await api.put(`order/${currentBookingId}`, {
                foodFee: values.foodFee,
                travelFee: values.travelFee,
                stayFee: values.stayFee,
                pdfUrl: values.pdfUrl || '',
                description: values.description || '',
            });
            await api.put(`booking/${currentBookingId}`, { status: "PENDING" });

            toast.success("Order updated and booking status changed to PENDING");
            fetchBookingData();
            setShowModal(false);
            setFileList([]);
            form.resetFields();
        } catch (err) {
            toast.error(err.response?.data || "Error updating order");
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isDocOrPdf = file.type === 'application/pdf' || 
                           file.type === 'application/msword' || 
                           file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        return isDocOrPdf;
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.filter(file => {
            if (!beforeUpload(file)) {
                toast.error('Invalid file format! File has been removed.');
                return false; 
            }
            return true; 
        }));
    };

    const handleShowCustomerInfo = (customer) => {
        setSelectedCustomer(customer);
        setShowCustomerModal(true);
    };

    const uploadButton = (
        <Button icon={<PlusOutlined />} style={{ width: '100%' }}>
            Upload PDF/DOC
        </Button>
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tour Name',
            dataIndex: 'tourName',
            key: 'tourName',
        },
        {
            title: 'Customer Name',
            key: 'customerName',
            render: (_, record) => (
                <span>
                    {record.customerName}
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => handleShowCustomerInfo({ name: record.customerName, email: record.customerEmail, phoneNumber: record.phoneNumber })}
                    >
                        ...
                    </Button>
                </span>
            ),
        },
    
        {
            title: 'Booking Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            render: (date) => moment(date).format("YYYY-MM-DD") // Formatting date to exclude time
        },
        {
            title: 'Number of People',
            key: 'numberOfPeople',
            render: (_, record) => (
                <span>
                    {record.numberOfAdult + record.numberOfChild} (Adults: {record.numberOfAdult}, Children: {record.numberOfChild})
                </span>
            ),
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (text) => <span>{text.toLocaleString()} VND</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge status={status === "PROCESSING" ? "warning" : status === "PENDING" ? "success" : "error"} text={status} />
            )
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'action',
            render: (_, booking) => (
                <Space>
                    <Button 
                        type="primary" 
                        onClick={() => handleEditOrder(booking)} 
                        disabled={filterStatus === "PENDING"}
                    >
                        Edit Order
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Typography.Title level={4}>Manage Bookings</Typography.Title>
            <Space style={{ marginBottom: 16 }}>
                {["PROCESSING", "REJECTED", "PENDING"].map((status) => {
                    const buttonStyles = {
                        backgroundColor:
                            status === "PROCESSING" ? "orange" :
                            status === "REJECTED" ? "red" :
                            "green",
                        color: "#fff",
                        borderColor: "transparent",
                    };

                    return (
                        <Button
                            key={status}
                            type={filterStatus === status ? "primary" : "default"}
                            style={filterStatus === status ? buttonStyles : {}}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status}
                            <Badge
                                count={bookingData.filter((b) => b.status === status).length}
                                style={{
                                    backgroundColor:
                                        status === "PROCESSING"
                                            ? "orange"
                                            : status === "REJECTED"
                                            ? "red"
                                            : "green",
                                }}
                            />
                        </Button>
                    );
                })}

                <Select
                        placeholder="Filter by Tour Name"
                        onChange={(value) => setSelectedTour(value || "ALL")}
                        allowClear
                        style={{ width: 200 }}
                    >
                        <Option value="ALL">All</Option>
                        {[...new Set(bookingData.map((b) => b.tourName))].map((tour) => (
                            <Option key={tour} value={tour}>{tour}</Option>
                        ))}
                    </Select>

                    {/* Dropdown để sắp xếp theo ngày */}
                    <Select
                        placeholder="Sort by Date"
                        onChange={(value) => setSortOrder(value || "ALL")}
                        allowClear
                        style={{ width: 150 }}
                    >
                        <Option value="ALL">All</Option>
                        <Option value="closest">Farthest</Option>
                        <Option value="farthest">Closest</Option>
                    </Select>
            </Space>

            <Tabs defaultActiveKey="1">
                <TabPane tab={`Total Bookings: ${filteredData.length}`} key="1">
                    <Table dataSource={filteredData} columns={columns} />
                </TabPane>
            </Tabs>

            <Modal open={showModal} onCancel={() => setShowModal(false)} title="Edit Order" onOk={() => form.submit()} confirmLoading={loading}>
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleUpdateOrder}>
                    <Form.Item name="foodFee" label="Food Fee" rules={[{ required: true, message: 'Please input the food fee!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="travelFee" label="Travel Fee" rules={[{ required: true, message: 'Please input the travel fee!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="stayFee" label="Stay Fee" rules={[{ required: true, message: 'Please input the stay fee!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="total" label="Total" rules={[{ required: true, message: 'Please input the total!' }]}>
                        <Input type="number" readOnly />
                    </Form.Item>
                    <Form.Item name="pdfUrl" label="PDF URL" rules={[{ required: true, message: 'Please input the PDF URL!' }]}>
                        <Upload
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            fileList={fileList}
                            customRequest={async ({ file, onSuccess, onError }) => {
                                try {
                                    const url = await uploadFile(file); 
                                    onSuccess(url); 
                                } catch (error) {
                                    onError(error); 
                                }
                            }}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        {fileList.length > 0 && fileList[0].url && (
                            <div style={{ marginTop: 10 }}>
                                <a href={fileList[0].url} target="_blank" rel="noopener noreferrer">
                                    View Uploaded Document
                                </a>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={showCustomerModal}
                onCancel={() => setShowCustomerModal(false)}
                footer={null}
                title="Customer Information"
            >
                <p>Name: {selectedCustomer.name}</p>
                <p>Email: {selectedCustomer.email}</p>
                <p>Phone number: {selectedCustomer.phoneNumber}</p>
            </Modal>
        </div>
    );
}

export default BookingProcess;
