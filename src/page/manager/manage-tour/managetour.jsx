import React, { useEffect, useState } from 'react';
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, Popconfirm, DatePicker, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file';

function ManageTour() {
    const [tourData, setTourData] = useState([]);
    const [farmList, setFarmList] = useState([]); // List of farms
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    // Fetch farm list
    const fetchFarmData = async () => {
        try {
            const response = await api.get("farm");
            setFarmList(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching farm list");
        }
    };

    // Fetch tour data
    const fetchTourData = async () => {
        try {
            const response = await api.get("tour");
            setTourData(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching tour data");
        }
    };

    useEffect(() => {
        fetchTourData();
        fetchFarmData();
    }, []);

    // Handle submit
    const handleSubmit = async (values) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            const url = await uploadFile(file.originFileObj);
            values.image = url;
        }

        const formattedValues = {
            ...values,
            listFarmTour: values.listFarmTour.map(farm => ({
                farmId: farm.farmId,
                description: farm.description
            })),
        };

        if (!formattedValues.id) {
            formattedValues.id = 0;
        }

        try {
            setLoading(true);
            if (formattedValues.id && formattedValues.id !== 0) {
                await api.put(`tour/${formattedValues.id}`, formattedValues);
            } else {
                await api.post("tour", formattedValues);
            }
            toast.success("Successfully saved");
            setFileList([]);
            fetchTourData();
            form.resetFields();
            setShowModal(false);
        } catch (err) {
            toast.error(err.response?.data || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Image upload and preview
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handleDelete = async (id) => {
        try {
            await api.delete(`tour/${id}`);
            toast.success("Successfully deleted");
            fetchTourData();
        } catch (err) {
            toast.error(err.response?.data || "Error deleting item");
        }
    };

    // Table columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                image ? (
                    <img width={50} height={50} src={image} alt="Tour Image" style={{ objectFit: 'cover' }} />
                ) : (
                    <div>No Image</div>
                )
            ),
        },
        {
            title: 'Tour Name',
            dataIndex: 'tourName',
            key: 'tourName',
        },
        {
            title: 'Price (Adult)',
            dataIndex: 'priceAdult',
            key: 'priceAdult',
        },
        {
            title: 'Price (Child)',
            dataIndex: 'priceChild',
            key: 'priceChild',
        },
        {
            title: 'Recipients',
            dataIndex: 'recipients',
            key: 'recipients',
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (id, tour) => (
                <>
                    <Button type="primary"  style={{ marginLeft: 8 }}  onClick={() => {
                        setShowModal(true);
                        form.setFieldsValue({
                            ...tour,
                            listFarmTour: tour.listFarmTour.map(farmTour => ({
                                farmId: farmTour.farmId,
                                description: farmTour.description
                            })),
                        });
                    }}>
                        Edit
                    </Button>

                    <Popconfirm title="Delete" onConfirm={() => handleDelete(id)}>
                        <Button type="primary" danger style={{ marginLeft: 8 }}  >Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button onClick={() => {
                setShowModal(true);
                form.resetFields();
            }}>
                Add Tour
            </Button>
            <Typography.Title level={4}>Manage Tours</Typography.Title>
            <Table dataSource={tourData} columns={columns} />

            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                title="Tour"
                onOk={() => form.submit()}
                confirmLoading={loading}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
                    <Form.Item name="id" hidden><Input /></Form.Item>

                    <Form.Item name="tourName" label="Tour Name" rules={[{ required: true, message: 'Please input the tour name!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="tourStart" label="Start Date" rules={[{ required: true, message: 'Please select the start date!' }]}>
                        <DatePicker showTime />
                    </Form.Item>

                    <Form.Item name="tourEnd" label="End Date" rules={[{ required: true, message: 'Please select the end date!' }]}>
                        <DatePicker showTime />
                    </Form.Item>

                    <Form.Item name="priceAdult" label="Price (Adult)" rules={[{ required: true, message: 'Please input the price for adults!' }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="priceChild" label="Price (Child)" rules={[{ required: true, message: 'Please input the price for children!' }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="recipients" label="Recipients" rules={[{ required: true, message: 'Please input the number of recipients!' }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.List name="listFarmTour">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'farmId']}
                                            label="Farm"
                                            rules={[{ required: true, message: 'Select a farm' }]}
                                        >
                                            <Select placeholder="Select farm">
                                                {farmList.map(farm => (
                                                    <Select.Option key={farm.id} value={farm.id}>
                                                        {farm.farmName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            label="Description"
                                            rules={[{ required: true, message: 'Enter description' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Button onClick={() => remove(name)} danger>Remove</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>Add Farm</Button>
                            </>
                        )}
                    </Form.List>

                    <Form.Item name="image" label="Image">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
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
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManageTour;
