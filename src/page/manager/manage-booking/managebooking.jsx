import React, { useEffect, useState } from 'react'; 
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Button, Popconfirm, Modal, Form, Input } from 'antd';

function BookingApproval() {
    const [bookingData, setBookingData] = useState([]);
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [form] = Form.useForm();
    
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

    // Xóa booking
    const handleDelete = async (id) => {
        try {
            await api.delete(`booking/${id}`);
            toast.success("Booking deleted successfully");
            fetchBookingData();
        } catch (err) {
            toast.error(err.response?.data || "Error deleting booking");
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
                total: order.total // Thêm trường total vào đây
            });
            setShowOrderModal(true);
        }
    };

    // Xử lý cập nhật mô tả
    const handleUpdateDescription = async () => {
        try {
            await api.put(`order/${currentOrder.id}`, { description: form.getFieldValue('description') });
            toast.success("Description updated successfully");
            setShowOrderModal(false);
            fetchBookingData(); // Refresh the booking data to reflect changes
        } catch (err) {
            toast.error(err.response?.data || "Error updating description");
        }
    };

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
            title: 'Number of Adults',
            dataIndex: 'numberOfAdult',
            key: 'numberOfAdult',
        },
        {
            title: 'Number of Children',
            dataIndex: 'numberOfChild',
            key: 'numberOfChild',
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
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'action',
            render: (id, booking) => (
                <>
                    <Button 
                       
                        type="primary" 
                        onClick={() => handleViewOrder(booking)} // Hiển thị modal order
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
                    <Button 
                        style={{ marginLeft: 8 }} 
                        type="primary"
                        onClick={() => updateStatus(id, 'REJECTED')}
                        disabled={loadingIds.has(id) || booking.status !== 'PENDING'}
                    >
                        Reject
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this booking?"
                        onConfirm={() => handleDelete(id)}
                    >
                        <Button 
                            type="primary" 
                            danger 
                            style={{ marginLeft: 8 }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div>
            <h4>Manage Bookings</h4>
            <Table dataSource={bookingData} columns={columns} />

            <Modal
                title="Order Details"
                visible={showOrderModal}
                onCancel={() => setShowOrderModal(false)}
                onOk={handleUpdateDescription}
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
                        <Input type="number" readOnly /> {/* Hiển thị trường Total */}
                    </Form.Item>
                    {currentOrder?.pdfUrl && (
                        <div style={{ margin: '10px 0' }}>
                            <span>PDF URL: </span>
                            <a href={currentOrder.pdfUrl} target="_blank" rel="noopener noreferrer">
                                View Uploaded Document
                            </a>
                        </div>
                    )}
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Estimate Fee" name="estimateFee">
                        <Input type="number" readOnly />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default BookingApproval;
