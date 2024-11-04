import React, { useEffect, useState } from 'react'; 
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Button, Modal, Form, Input, Badge, Space, Select } from 'antd';
import moment from 'moment'; 
const { Option } = Select;

function BookingApproval() {
    const [bookingData, setBookingData] = useState([]);
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [form] = Form.useForm();
    const [filterStatus, setFilterStatus] = useState("PENDING");
    const [selectedTour, setSelectedTour] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("closest");
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [formReadOnly, setFormReadOnly] = useState(false);

    // Lấy dữ liệu booking
    const fetchBookingData = async () => {
        try {
            const response = await api.get("booking/all");
            setBookingData(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching booking data");
        }
    };

    // Lấy dữ liệu đơn hàng
    const fetchOrderData = async (id) => {
        try {
            const response = await api.get(`order/${id}`);
            return response.data;
        } catch (err) {
            toast.error(err.response?.data || "Error fetching order data");
        }
    };

    useEffect(() => {
        fetchBookingData(); // Fetch booking data when the component mounts
    }, []);

    // Thay đổi trạng thái booking
    const updateStatus = async (id, status) => {
        const booking = bookingData.find(booking => booking.id === id);
        if (!booking || booking.status !== 'PENDING') {
            toast.error("This booking cannot be updated.");
            return;
        }

        setLoadingIds(prev => new Set(prev).add(id));

        try {
            await api.put(`booking/${id}`, { status });
            toast.success(`Booking status updated to ${status}`);
            fetchBookingData();
        } catch (err) {
            toast.error(err.response?.data || "Error updating booking status");
        } finally {
            setLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    // Hiển thị modal để xem và chỉnh sửa đơn hàng
    const handleViewOrder = async (booking) => {
        const order = await fetchOrderData(booking.id);
        if (order) {
            setCurrentOrder(order);
            form.setFieldsValue({
                foodFee: order.foodFee,
                travelFee: order.travelFee,
                stayFee: order.stayFee,
                description: order.description || '',
                estimateFee: booking.totalPrice,
                total: order.total // Adding total field
            });
            setShowOrderModal(true);
        }
        // Set modal to read-only if status is not "PENDING"
        setFormReadOnly(booking.status !== "PENDING");
    };
    
    

    // Xử lý cập nhật mô tả
    // Xử lý cập nhật mô tả và gửi toàn bộ thông tin đơn hàng
    const handleUpdateDescription = async () => {
        try {
            const values = form.getFieldsValue();
            await api.put(`order/${currentOrder.id}`, {
                ...values,
                total: values.total || currentOrder.total,
            });
            // Cập nhật trạng thái booking thành 'REJECTED'
            await api.put(`booking/${currentOrder.id}`, { status: 'REJECTED' });
            
            toast.success("Order rejected and description updated successfully");
            setShowOrderModal(false);
            fetchBookingData();
        } catch (err) {
            toast.error(err.response?.data || "Error updating description and rejecting order");
        }
    };
    

    
    const handleShowCustomerInfo = (customer) => {
        setSelectedCustomer(customer);
        setShowCustomerModal(true);
    };
    // Bộ lọc và sắp xếp với tùy chọn "All"
    const filteredData = bookingData
        .filter((booking) => filterStatus === "ALL" || booking.status === filterStatus)
        .filter((booking) => selectedTour === "ALL" || selectedTour === "" || booking.tourName === selectedTour)
        .sort((a, b) => {
            if (sortOrder === "closest") {
                return new Date(a.bookingDate) - new Date(b.bookingDate);
            } else if (sortOrder === "farthest") {
                return new Date(b.bookingDate) - new Date(a.bookingDate);
            } else {
                return 0;
            }
        });

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
                <Badge status={status === "PENDING" ? "success" : status === "REJECTED" ? "error" : "processing"} text={status} />
            )
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'action',
            render: (id, booking) => (
                <>
                    <Button 
                        type="primary" 
                        onClick={() => handleViewOrder(booking)} 
                    >
                        View Order
                    </Button>
                    <Button 
                        style={{ marginLeft: 8 }} 
                        type="primary" 
                        onClick={() => updateStatus(id, 'APPROVED')}
                        disabled={loadingIds.has(id) || booking.status !== 'PENDING'}
                    >
                        Approve
                    </Button>
                </>
            )    
        },
    ];

    return (
        <div>
            <h4>Manage Bookings</h4>
            <Space style={{ marginBottom: 16 }}>
                {["PENDING", "REJECTED", "APPROVED"].map((status) => {
                    const buttonStyles = {
                        backgroundColor: 
                            status === "PENDING" ? "green" :
                            status === "REJECTED" ? "red" :
                            "blue",
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
                                        status === "PENDING"
                                            ? "green"
                                            : status === "REJECTED"
                                            ? "red"
                                            : "blue",
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

                <Select
                    placeholder="Sort by Date"
                    onChange={(value) => setSortOrder(value || "ALL")}
                    allowClear
                    style={{ width: 150 }}
                >
                    <Option value="ALL">All</Option>
                    <Option value="closest">Closest</Option>
                    <Option value="farthest">Farthest</Option>
                </Select>
            </Space>

            <Table dataSource={filteredData} columns={columns} />

            <Modal
                title="Order Details"
                visible={showOrderModal}
                onCancel={() => setShowOrderModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowOrderModal(false)}>
                        Cancel
                    </Button>,
                    !formReadOnly && (
                        <Button key="submit" type="primary" danger onClick={handleUpdateDescription}>
                            Reject
                        </Button>
                    ),
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Food Fee" name="foodFee">
                        <Input type="number" readOnly />
                    </Form.Item>
                    <Form.Item label="Travel Fee" name="travelFee">
                        <Input type="number" readOnly />
                    </Form.Item>
                    <Form.Item label="Stay Fee" name="stayFee">
                        <Input type="number" readOnly />
                    </Form.Item>
                    <Form.Item label="Total" name="total">
                        <Input type="number" readOnly />
                    </Form.Item>
                    {currentOrder?.pdfUrl && (
                        <div style={{ margin: '10px 0' }}>
                            <span>PDF URL: </span>
                            <a href={currentOrder.pdfUrl} target="_blank" rel="noopener noreferrer">
                                View Uploaded Document
                            </a>
                        </div>
                    )}
                    <Form.Item label="Description" name="description">
                         <Input.TextArea rows={4} readOnly={formReadOnly} />
                     </Form.Item>
                    <Form.Item label="Estimate Fee" name="estimateFee">
                        <Input type="number" readOnly />
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

export default BookingApproval;
