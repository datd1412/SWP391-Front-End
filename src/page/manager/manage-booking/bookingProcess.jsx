import React, { useEffect, useState } from 'react'; 
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, Popconfirm, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file';

function BookingProcess() {
    const [bookingData, setBookingData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const [fileList, setFileList] = useState([]);

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
        fetchBookingData();
    }, []);

    // Chỉnh sửa đơn hàng
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
                total: order.total // Thêm trường total vào đây
            });

            // Nếu có file, cập nhật fileList
            if (order.pdfUrl) {
                setFileList([{
                    uid: '-1', // Dùng uid để tránh xung đột
                    name: 'File uploaded', // Tên file
                    status: 'done',
                    url: order.pdfUrl, // URL của file
                }]);
            } else {
                setFileList([]); // Reset fileList nếu không có file
            }
        }
        setShowModal(true);
    };

    // Cập nhật đơn hàng
    const handleUpdateOrder = async (values) => {
        try {
            setLoading(true);

            // Nếu có file trong fileList, upload và lấy URL
            if (fileList.length > 0) {
                const file = fileList[0]; // Lấy file đầu tiên trong danh sách
                const url = await uploadFile(file.originFileObj); // Upload file để lấy URL
                values.pdfUrl = url; // Gán URL vào pdfUrl
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
            setFileList([]); // Reset fileList sau khi submit
            form.resetFields(); // Reset các trường trong form
        } catch (err) {
            toast.error(err.response?.data || "Error updating order");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý upload file
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
                return false; // Không thêm file không hợp lệ
            }
            return true; // Giữ lại file hợp lệ
        }));
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
                <Space>
                    <Button type="primary" onClick={() => handleEditOrder(booking)}>
                        Edit Order
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this booking?"
                        onConfirm={() => handleDelete(id)}
                    >
                        <Button type="primary" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Typography.Title level={4}>Manage Bookings</Typography.Title>
            <Table dataSource={bookingData} columns={columns} />

            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                title="Edit Order"
                onOk={() => form.submit()}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    labelCol={{ span: 24 }}
                    onFinish={handleUpdateOrder} 
                >
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
                                    const url = await uploadFile(file); // Gọi hàm uploadFile để lấy URL
                                    onSuccess(url); // Thông báo thành công
                                } catch (error) {
                                    onError(error); // Thông báo lỗi
                                }
                            }}
                        >
                            {fileList.length >= 1 ? null : uploadButton} {/* Hiển thị nút upload nếu không có file */}
                        </Upload>
                        {fileList.length > 0 && fileList[0].url && (
                            <div style={{ marginTop: 10 }}>
                                <a href={fileList[0].url} target="_blank" rel="noopener noreferrer">
                                    View Uploaded Document
                                </a>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="estimateFee" label="Estimate Fee" rules={[{ required: true, message: 'Please input the estimate fee!' }]}>
                        <Input type="number" readOnly />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default BookingProcess;
