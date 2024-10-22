import React, { useEffect, useState } from 'react';
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, Popconfirm, Image, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file';

function ManageKoi() {
    const [koiData, setKoiData] = useState([]);
    const [farmList, setFarmList] = useState([]); // Danh sách các trang trại
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    // Lấy danh sách các trang trại
    const fetchFarmData = async () => {
        try {
            const response = await api.get("farm"); // Gọi API để lấy danh sách trang trại
            setFarmList(response.data); // Lưu dữ liệu vào state farmList
        } catch (err) {
            toast.error(err.response?.data || "Lỗi khi tải danh sách trang trại");
        }
    };

    // Lấy dữ liệu cá koi
    const fetchKoiData = async () => {
        try {
            const response = await api.get("koifish");
            setKoiData(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching koi data");
        }
    };

    useEffect(() => {
        fetchKoiData();
        fetchFarmData(); // Lấy dữ liệu trang trại khi component render
    }, []);

    // Tạo hoặc chỉnh sửa cá koi
    const handleSubmit = async (values) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            const url = await uploadFile(file.originFileObj);
            values.image = url;
        }

        const formattedValues = {
            ...values,
            farmKoiList: values.farmKoiList.map(farm => ({
                farmId: farm.farmId, // Gửi farmId khi submit
                quantity: farm.quantity,
            })),
        };

        if (!formattedValues.id) {
            formattedValues.id = 0;
        }

        try {
            setLoading(true);
            if (formattedValues.id && formattedValues.id !== 0) {
                await api.put(`koifish/${formattedValues.id}`, formattedValues);
            } else {
                await api.post("koifish", formattedValues);
            }
            toast.success("Successfully saved");
            setFileList([]); // Reset fileList sau khi submit
            fetchKoiData();
            form.resetFields();
            setShowModal(false);
        } catch (err) {
            toast.error(err.response?.data || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Các chức năng liên quan đến upload ảnh
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const handleDelete = async (id) => {
        try {
            await api.delete(`koifish/${id}`);
            toast.success("Successfully deleted");
            fetchKoiData();
        } catch (err) {
            toast.error(err.response?.data || "Error deleting item");
        }
    };

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
                    <Image
                        width={50}
                        height={50}
                        src={image}
                        alt="Koi Image"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div>No Image</div>
                )
            ),
        },
        {
            title: 'Koi Name',
            dataIndex: 'koiName',
            key: 'koiName',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id, koi) => (
                <>
                    <Button type="primary" onClick={() => {
                        setShowModal(true);
                        form.setFieldsValue({
                            ...koi,
                            farmKoiList: koi.farmKoiList.map(farmKoi => ({
                                farmId: farmKoi.farmId,
                                quantity: farmKoi.quantity,
                            })),
                        });
                    }}>
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete"
                        description="Do you want to delete this koi fish?"
                        onConfirm={() => handleDelete(id)}
                    >
                        <Button type="primary" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button onClick={() => {
                setShowModal(true);
                form.resetFields(); // Reset form fields khi mở modal
            }}>
                Add Koi
            </Button>
            <Typography.Title level={4}>Manage Koi Fish</Typography.Title>
            <Table dataSource={koiData} columns={columns} />

            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                title="Koi Fish"
                onOk={() => form.submit()}
                confirmLoading={loading}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="koiName"
                        label="Koi Name"
                        rules={[{ required: true, message: 'Please input the koi name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please input the price!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="detail"
                        label="Detail"
                        rules={[{ required: true, message: 'Please input the details!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.List name="farmKoiList">
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
                                            name={[name, 'quantity']}
                                            label="Quantity"
                                            rules={[{ required: true, message: 'Enter quantity' }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>

                                        <Button onClick={() => remove(name)} danger>Remove</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>Add Farm</Button>
                            </>
                        )}
                    </Form.List>

                    <Form.Item
                        name="image"
                        label="Image"
                    >
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

export default ManageKoi;
