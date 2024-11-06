import React, { useEffect, useState } from 'react'; 
import api from "../../../config/axios"; 
import { toast } from "react-toastify"; 
import { Table, Button, Popconfirm, Modal, Form, Input } from 'antd'; 

function BookingManagement() { 
    const [bookingData, setBookingData] = useState([]); 
    const [loadingIds, setLoadingIds] = useState(new Set()); 
    const [showOrderModal, setShowOrderModal] = useState(false); 
    const [currentOrder, setCurrentOrder] = useState(null); 
    const [form] = Form.useForm(); 

    // Các bước xử lý
    const processingSteps = [
        { type: "Consultation and Order Confirmation", status: 0, description: null },
        { type: "Order Processing and Delivery Scheduling", status: 0, description: null },
        { type: "Pre-Delivery Confirmation", status: 0, description: null },
        { type: "Delivery and Final Payment Completion", status: 0, description: null }
    ];

    // Lấy dữ liệu booking
    const fetchBookingData = async () => { 
        try { 
            const response = await api.get("booking/all"); 
            setBookingData(response.data.filter(booking => booking.status === 'APPROVED')); // Chỉ lấy booking đã phê duyệt
        } catch (err) { 
            toast.error(err.response?.data || "Error fetching booking data"); 
        } 
    };

    useEffect(() => { 
        fetchBookingData(); // Fetch booking data when the component mounts
    }, []);

    // Cập nhật trạng thái các bước xử lý
    const updateProcessingStatus = async (id, updatedSteps) => { 
        setLoadingIds(prev => new Set(prev).add(id));

        try { 
            await api.put(`booking/${id}/processing`, { processingList: updatedSteps }); 
            toast.success("Processing status updated successfully"); 
            fetchBookingData(); 
        } catch (err) { 
            toast.error(err.response?.data || "Error updating processing status"); 
        } finally { 
            setLoadingIds(prev => { 
                const newSet = new Set(prev); 
                newSet.delete(id); 
                return newSet; 
            }); 
        } 
    };

    // Hiển thị modal để cập nhật trạng thái xử lý
    const handleUpdateProcessing = (booking) => { 
        setCurrentOrder(booking); 
        form.setFieldsValue({
            processingList: processingSteps // Set default processing steps
        });
        setShowOrderModal(true); 
    };

    // Xử lý lưu trạng thái
    const handleSaveProcessingStatus = async () => {
        const updatedSteps = form.getFieldValue('processingList');
        await updateProcessingStatus(currentOrder.id, updatedSteps);
        setShowOrderModal(false);
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
                        onClick={() => handleUpdateProcessing(booking)} // Hiển thị modal cập nhật trạng thái 
                    > 
                        Update Processing 
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
                title="Update Processing Status" 
                visible={showOrderModal} 
                onCancel={() => setShowOrderModal(false)} 
                onOk={handleSaveProcessingStatus} 
            > 
                <Form form={form} layout="vertical"> 
                    <Form.Item label="Processing Steps" name="processingList">
                        <Form.List name="processingList">
                            {(fields) => (
                                <>
                                    {processingSteps.map((step, index) => (
                                        <div key={index}>
                                            <Form.Item label={step.type} required={false}>
                                                <Input
                                                    type="checkbox"
                                                    checked={step.status === 1}
                                                    onChange={e => {
                                                        const newStatus = e.target.checked ? 1 : 0;
                                                        step.status = newStatus; // Cập nhật trạng thái
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal> 
        </div> 
    ); 
} 

export default BookingManagement;
