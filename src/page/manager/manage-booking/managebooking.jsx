import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import api from "../../../config/axios";  // Sử dụng axios để gọi API

const BookingApproval = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);


    useEffect(() => {
        setLoading(true);
        api.get('booking/all')
            .then((response) => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch((error) => {
                message.error('Failed to load bookings');
                setLoading(false);
            });
    }, []);

    const approveBooking = (id) => {
        api.put(`booking/${id}`, { status: 'APPROVED' })
            .then(() => {
                message.success('Booking approved successfully');
        
                setBookings(bookings.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b));
            })
            .catch(() => {
                message.error('Failed to approve booking');
            });
    };


    const rejectBooking = (id) => {
        api.put(`booking/${id}`, { status: 'REJECTED' })
            .then(() => {
                message.success('Booking rejected successfully');
                setBookings(bookings.map(b => b.id === id ? { ...b, status: 'REJECTED' } : b));
            })
            .catch(() => {
                message.error('Failed to reject booking');
            });
    };


    const deleteBooking = (id) => {
        api.delete(`booking/${id}`)
            .then(() => {
                message.success('Booking deleted successfully');
                setBookings(bookings.filter(b => b.id !== id));
            })
            .catch(() => {
                message.error('Failed to delete booking');
            });
    };

   
    const columns = [
        {
            title: 'Tour Name',
            dataIndex: 'tourName',
            key: 'tourName',
        },
        {
            title: 'Adults',
            dataIndex: 'numberOfAdult',
            key: 'numberOfAdult',
        },
        {
            title: 'Children',
            dataIndex: 'numberOfChild',
            key: 'numberOfChild',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button type="primary" onClick={() => approveBooking(record.id)} disabled={record.status === 'APPROVED'}>Approve</Button>
                    <Button type="danger" onClick={() => rejectBooking(record.id)} disabled={record.status === 'REJECTED'}>Reject</Button>
                    <Button onClick={() => deleteBooking(record.id)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={bookings}
                loading={loading}
                rowKey="id"
            />
        </div>
    );
};

export default BookingApproval;
