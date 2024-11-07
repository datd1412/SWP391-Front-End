import React, { useEffect, useState } from 'react';
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Button, Popconfirm, Modal, Input } from 'antd';

function BookingManagement() {
    const [bookingData, setBookingData] = useState([]);
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [formValues, setFormValues] = useState([]); // State for form values
    const [filter, setFilter] = useState('ALL'); // State for filtering
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    // Fetch booking data
    const fetchBookingData = async () => {
        try {
            const response = await api.get("booking/all");
            const approvedBookings = response.data.filter(booking => booking.status === 'APPROVED');

            // Fetch detailed data for each approved booking
            const detailedBookings = await Promise.all(
                approvedBookings.map(async (booking) => {
                    const detailsResponse = await api.get(`booking/${booking.id}`);
                    return detailsResponse.data; // Return the detailed booking info
                })
            );

            // Further filter based on payment status
            const filteredBookings = detailedBookings.filter(booking =>
                filter === 'ALL' ||
                (filter === 'PAID' && booking.paymentStatus === 'PAID') ||
                (filter === 'NOT_PAID' && booking.paymentStatus === 'NOT_PAID')
            );

            setBookingData(filteredBookings);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching booking data");
        }
    };

    useEffect(() => {
        fetchBookingData();
    }, [filter]); // Fetch data whenever the filter changes

    // Update processing status
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

    // Show modal to update processing status
    const openUpdateModal = (booking) => {
        setCurrentBooking(booking); // Set the current booking data
        setModalVisible(true); // Show the modal
        setFormValues(booking.processing.map(process => ({ 
            status: process.status, 
            description: process.description 
        }))); // Initialize form values
    };

    // Handle saving processing status
    const handleSave = () => {
        const updatedProcessingList = currentBooking.processing.map((process, index) => ({
            ...process,
            status: formValues[index].status, // Use updated status from form
            description: formValues[index].description // Use updated description from form
        }));

        updateProcessingStatus(currentBooking.id, updatedProcessingList);
        setModalVisible(false); // Close modal after saving
    };

    // Handle deleting a booking (implementation not shown)
    const handleDelete = async (id) => {
        // Implement delete logic here
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tour Name', dataIndex: 'tourName', key: 'tourName' },
        { title: 'Number of Adults', dataIndex: 'numberOfAdult', key: 'numberOfAdult' },
        { title: 'Number of Children', dataIndex: 'numberOfChild', key: 'numberOfChild' },
        {
            title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice',
            render: (text) => <span>{text.toLocaleString()} VND</span>
        },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Action', dataIndex: 'id', key: 'action',
            render: (id, booking) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => openUpdateModal(booking)} // Open modal with booking details
                    >
                        Update Processing
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h4>Manage Bookings</h4>
            {/* Filter Buttons */}
            <div style={{ marginBottom: 16 }}>
                <Button onClick={() => setFilter('ALL')} type={filter === 'ALL' ? 'primary' : 'default'}>All</Button>
                <Button onClick={() => setFilter('PAID')} type={filter === 'PAID' ? 'primary' : 'default'}>Paid</Button>
                <Button onClick={() => setFilter('NOT_PAID')} type={filter === 'NOT_PAID' ? 'primary' : 'default'}>Not Paid</Button>
            </div>
            <Table dataSource={bookingData} columns={columns} />

            <Modal title="Update Processing Status" visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSave}>
                {currentBooking && currentBooking.processing.map((process, index) => (
                    <div key={process.type} style={{ marginBottom: 16 }}>
                        <label>{process.type}</label>
                        <div>
                            {formValues[index]?.status === 1 ? "Bước này đã hoàn tất" : "Bước này chưa hoàn tất"}
                        </div>
                        <Input
                            type="text"
                            value={formValues[index]?.description || ''} // Ensure to use optional chaining
                            onChange={(e) => {
                                const newValues = [...formValues];
                                newValues[index] = {
                                    ...newValues[index],
                                    description: e.target.value
                                };
                                setFormValues(newValues);
                            }}
                            placeholder="Nhập mô tả..."
                        />
                        <Button
                            type="primary"
                            onClick={() => {
                                const newValues = [...formValues];
                                newValues[index] = {
                                    ...newValues[index],
                                    status: newValues[index].status === 1 ? 0 : 1 // Toggle status on button click
                                };
                                setFormValues(newValues);
                            }}
                        >
                            {formValues[index]?.status === 1 ? "Đánh dấu là chưa hoàn tất" : "Đánh dấu là hoàn tất"}
                        </Button>
                    </div>
                ))}
            </Modal>
        </div>
    );
}

export default BookingManagement;
