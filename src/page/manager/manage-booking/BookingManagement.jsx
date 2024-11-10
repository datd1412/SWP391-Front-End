import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Modal, Button, Form, Input, Badge, Select, InputNumber } from 'antd';
import { toast } from "react-toastify";
import api from "../../../config/axios";
import moment from 'moment';

const { Option } = Select;

const BookingManagement = () => {
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [paidBookings, setPaidBookings] = useState([]);
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [availableKoiFish, setAvailableKoiFish] = useState([]);
  const [addedKoiFish, setAddedKoiFish] = useState([]); // Track added koi fish
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [processingList, setProcessingList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("PAID");
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch all bookings
    const fetchBookingData = async () => {
      try {
        const response = await api.get("booking/all");
        const approved = response.data.filter(booking => booking.status === 'APPROVED');
        setApprovedBookings(approved);
  
        // Fetch payment status for each approved booking
        const paid = [];
        const unpaid = [];
        for (const booking of approved) {
          try {
            const bookingDetail = await api.get(`/booking/${booking.id}`);
            
            // Giữ lại thông tin tourName từ booking ban đầu
            const bookingWithDetails = {
              ...booking,
              ...bookingDetail.data,
            };
  
            if (bookingWithDetails.paymentStatus === 'PAID') {
              paid.push(bookingWithDetails);
            } else {
              unpaid.push(bookingWithDetails);
            }
          } catch (error) {
            toast.error(`Error fetching booking with id ${booking.id}`);
          }
        }
        setPaidBookings(paid);
        setUnpaidBookings(unpaid);
      } catch (error) {
        toast.error('Error fetching bookings');
      }
    };
    fetchBookingData();
  }, []);
  

  const handleUpdateProcessing = async (bookingId, updatedProcessingList) => {
    try {
      // Lặp qua tất cả các bước trong danh sách
      for (let i = 0; i < updatedProcessingList.length; i++) {
        const currentStep = updatedProcessingList[i];
        
        // Nếu bước hiện tại có status là 1, kiểm tra xem các bước trước đó đã hoàn thành chưa
        if (currentStep.status === 1) {
          for (let j = 0; j < i; j++) {
            if (updatedProcessingList[j].status !== 1) {
              toast.error(`Cannot update step "${currentStep.type}" before completing previous step "${updatedProcessingList[j].type}".`);
              return;
            }
          }
        }
      }
  
      // Đảm bảo rằng cá Koi đã được thêm vào trước khi hoàn thành bước thứ hai
      const stepTwo = updatedProcessingList.find(step => step.type === 'Buying KoiFish and Delivery Scheduling');
      if (stepTwo && stepTwo.status === 1 && addedKoiFish.length === 0) {
        toast.error('You must add koi fish before completing the "Buying KoiFish and Delivery Scheduling" step.');
        return;
      }
  
      // Gửi cập nhật lên server
      await api.put(`/booking/${bookingId}/processing`, {
        processingList: updatedProcessingList
      });
      toast.success('Processing status updated successfully!');
      setShowProcessingModal(false);
    } catch (error) {
      toast.error('Failed to update processing status');
    }
  };
  

  const handleSelectBooking = async (booking) => {
    setSelectedBooking(booking);
    setAddedKoiFish(booking.koifish || []); // Reset added koi fish when selecting a new booking
    try {
      // Fetch the tour details
      const tourResponse = await api.get(`/tour/${booking.tourId}`);
      const listFarmTour = tourResponse.data.listFarmTour;
  
      const koiFishPromises = listFarmTour.map(async (farm) => {
        const farmResponse = await api.get(`/farm/${farm.farmId}`);
        return farmResponse.data.listFarmKoi.map(farmKoi => ({
          ...farmKoi,
          farmId: farm.farmId, // đảm bảo farmId được xác định đúng
          farmName: farmResponse.data.farmName // Lưu tên của farm
        }));
      });
  
      const farmKoiLists = await Promise.all(koiFishPromises);
      const allKoiFish = farmKoiLists.flat();
      
      // Fetch detailed koi information
      const koiDetailsPromises = allKoiFish.map(koi => api.get(`/koifish/${koi.koiId}`));
      const koiDetailsResponses = await Promise.all(koiDetailsPromises);
  
      const koiFishWithDetails = koiDetailsResponses.map((response, index) => ({
        ...response.data,
        farmId: allKoiFish[index].farmId, // Kết hợp farmId từ dữ liệu farmKoi
        farmName: allKoiFish[index].farmName // Kết hợp farmName từ dữ liệu farmKoi
      }));
  
      setAvailableKoiFish(koiFishWithDetails);
      setShowModal(true);
    } catch (error) {
      toast.error('Error fetching available koi fish');
    }
  };
  

  const handleAddKoiFishToBooking = (koiFish) => {
    if (!koiFish.koiFishId || !koiFish.farmId) {
      toast.error('Invalid Koi Fish or Farm information. Please select valid options.');
      return;
    }
  
    setAddedKoiFish(prevState => {
      const existingFish = prevState.find(fish => fish.koiFishId === koiFish.koiFishId);
      if (existingFish) {
        return prevState.map(fish =>
          fish.koiFishId === koiFish.koiFishId ? { ...fish, quantity: fish.quantity + 1 } : fish
        );
      } else {
        return [...prevState, koiFish];
      }
    });
  };
  

  const handleSaveAddedKoiFish = async () => {
    try {
      await api.put(`/booking/${selectedBooking.id}/koifish`, {
        bookingKoifish: addedKoiFish
      });
      toast.success('Koi fish added to booking successfully!');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to add koi fish to booking');
    }
  };

  const handleShowProcessingModal = (booking) => {
    setSelectedBooking(booking);
    setProcessingList(booking.processing);
    setShowProcessingModal(true);
  };

  const filteredPaidBookings = paidBookings.filter(booking =>
    booking.customerName.toLowerCase().includes(filterCustomerName.toLowerCase())
  );

  const filteredUnpaidBookings = unpaidBookings.filter(booking =>
    booking.customerName.toLowerCase().includes(filterCustomerName.toLowerCase())
  );

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tour Name',
      dataIndex: 'tourName',
      key: 'tourName',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => <span>{text.toLocaleString()} VND</span>,
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => moment(date).format("YYYY-MM-DD")
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === "APPROVED" ? "success" : "warning"} text={status} />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, booking) => (
        <Space>
          <Button type="primary" onClick={() => handleShowProcessingModal(booking)}>Update Processing</Button>
          <Button type="default" onClick={() => handleSelectBooking(booking)}>Add Koi Fish</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="booking-management">
      <Typography.Title level={4}>Booking Management</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        {['PAID', 'UNPAID'].map((status) => {
          const buttonStyles = {
            backgroundColor: status === 'PAID' ? 'green' : 'orange',
            color: '#fff',
            borderColor: 'transparent',
          };

          return (
            <Button
              key={status}
              type={filterStatus === status ? 'primary' : 'default'}
              style={filterStatus === status ? buttonStyles : {}}
              onClick={() => setFilterStatus(status)}
            >
              {status}
              <Badge
                count={status === 'PAID' ? paidBookings.length : unpaidBookings.length}
                style={{ backgroundColor: status === 'PAID' ? 'green' : 'orange' }}
              />
            </Button>
          );
        })}
      </Space>
      
      <Table
        dataSource={filterStatus === 'PAID' ? filteredPaidBookings : filteredUnpaidBookings}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title="Add Koi Fish to Booking"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSaveAddedKoiFish}
      >
        {availableKoiFish.reduce((acc, koi, index) => {
          const farmHeader = (
            <h4 key={`farm-header-${koi.farmId}`}>{koi.farmName}</h4>
          );

          if (!acc.find(item => item.key === `farm-header-${koi.farmId}`)) {
            acc.push(farmHeader);
          }

          acc.push(
            <Table
              key={`farm-table-${index}`}
              dataSource={availableKoiFish.filter(fish => fish.farmId === koi.farmId)}
              columns={[
                {
                  title: 'Koi Name',
                  dataIndex: 'koiName',
                  key: 'koiName',
                },
                {
                  title: 'Koi Type',
                  dataIndex: 'koiType',
                  key: 'koiType',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (text) => <span>{text.toLocaleString()} VND</span>
                },
                {
                  title: 'Quantity Available',
                  key: 'quantity',
                  render: (_, koi) => (
                    koi.farmKoiList.find(farmKoi => farmKoi.farmId === selectedBooking?.tourId)?.quantity || 0
                  )
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, koi) => (
                    <InputNumber
                      min={1}
                      defaultValue={1}
                      onChange={(value) => handleAddKoiFishToBooking({
                        farmId: koi.farmKoiList[0].farmId,
                        koiFishId: koi.id,
                        quantity: value,
                        price: koi.price
                      })}
                    />
                  )
                }
              ]}
              rowKey="id"
              pagination={false}
            />
          );
          return acc;
        }, [])}

        <div>
          <h4>Selected Koi Fish:</h4>
          <ul>
            {addedKoiFish.map((fish, index) => (
              <li key={index}>{`Koi ID: ${fish.koiFishId}, Quantity: ${fish.quantity}`}</li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal
        title="Update Processing Steps"
        visible={showProcessingModal}
        onCancel={() => setShowProcessingModal(false)}
        onOk={() => handleUpdateProcessing(selectedBooking.id, processingList)}
      >
        <Form form={form} layout="vertical">
          {processingList.map((step, index) => (
            <Form.Item key={index} label={step.type}>
              <Input.Group compact>
                <InputNumber
                  min={0}
                  max={1}
                  value={step.status}
                  onChange={(value) => {
                    const updatedList = [...processingList];
                    updatedList[index].status = value;
                    setProcessingList(updatedList);
                  }}
                />
                <Input
                  style={{ width: '70%', marginLeft: 10 }}
                  placeholder="Description"
                  value={step.description || ''}
                  onChange={(e) => {
                    const updatedList = [...processingList];
                    updatedList[index].description = e.target.value;
                    setProcessingList(updatedList);
                  }}
                />
              </Input.Group>
            </Form.Item>
          ))}
        </Form>
      </Modal>

    </div>
  );
};

export default BookingManagement;
