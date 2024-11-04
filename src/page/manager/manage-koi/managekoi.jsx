import React, { useEffect, useState } from 'react';
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, Popconfirm, Image, Upload, Select, AutoComplete } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file';

function ManageKoi() {
    const [koiData, setKoiData] = useState([]);
    const [farmList, setFarmList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [koiTypes, setKoiTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    // Fetch farm data
    const fetchFarmData = async () => {
        try {
            const response = await api.get("farm");
            setFarmList(response.data);
        } catch (err) {
            toast.error(err.response?.data || "L?i khi t?i danh sách trang tr?i");
        }
    };

    // Fetch koi data
    const fetchKoiData = async () => {
        try {
            const response = await api.get("koifish");
            setKoiData(response.data);
            setFilteredData(response.data);
            const types = [...new Set(response.data.map(koi => koi.koiType))];
            setKoiTypes(types);
        } catch (err) {
            toast.error(err.response?.data || "Error fetching koi data");
        }
    };

    useEffect(() => {
        fetchKoiData();
        fetchFarmData();
    }, []);

    const handleSubmit = async (values) => {
        const farmKoiList = values.farmKoiList || [];
    
        if (fileList.length > 0) {
            const file = fileList[0];
            const url = await uploadFile(file.originFileObj);
            values.image = url;
        }
    
        const formattedValues = {
            ...values,
            farmKoiList: farmKoiList.map(farm => ({
                farmId: farm.farmId,
                quantity: farm.quantity,
            })),
        };
    
        try {
            setLoading(true);
            if (formattedValues.id) {
                await api.put(`koifish/${formattedValues.id}`, formattedValues);
            } else {
                await api.post("koifish", formattedValues);
            }
            toast.success("Successfully saved");
            setFileList([]); // Reset fileList after submit
            fetchKoiData();
            form.resetFields();
            setShowModal(false);
        } catch (err) {
            toast.error(err.response?.data || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleDelete = async (id) => {
        try {
            await api.delete(`koifish/${id}`);
            toast.success("Successfully deleted");
            fetchKoiData();
        } catch (err) {
            toast.error(err.response?.data || "Error deleting item");
        }
    };

    const handleFilterChange = (value, field) => {
        let filtered = koiData;
        if (field === 'koiType') {
            filtered = koiData.filter(koi => koi.koiType.includes(value));
        } else if (field === 'koiName') {
            filtered = koiData.filter(koi => koi.koiName.includes(value));
        }
        setFilteredData(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Image', dataIndex: 'image', key: 'image', render: (image) => (image ? <Image width={50} src={image} /> : 'No Image') },
        { title: 'Koi Name', dataIndex: 'koiName', key: 'koiName' },
        { title: 'Koi Type', dataIndex: 'koiType', key: 'koiType' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id, koi) => (
                <Space>
<<<<<<< HEAD
                    <Button onClick={() => { 
                        setShowModal(true); 
                        form.setFieldsValue({ ...koi }); 
                        setFileList([]); // Reset fileList when editing
                    }}>Edit</Button>
                    <Popconfirm title="Do you want to delete this fish?" onConfirm={() => handleDelete(id)}>
                        <Button danger>Delete</Button>
=======
                    <Button type="primary"  style={{ marginLeft: 8 }}  onClick={() => {
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
                        <Button type="primary" danger  style={{ marginLeft: 8 }} >
                            Delete
                        </Button>
>>>>>>> af33c4a6778d3171f8be99e790f5c7c4ca430230
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Filter by Koi Name"
                    options={koiData.map(koi => ({ value: koi.koiName }))}
                    onChange={(value) => handleFilterChange(value, 'koiName')}
                />
                <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Filter by Koi Type"
                    options={koiTypes.map(type => ({ value: type }))}
                    onChange={(value) => handleFilterChange(value, 'koiType')}
                />
            </div>

            <Button onClick={() => { 
                setShowModal(true); 
                form.resetFields(); 
                setFileList([]); // Reset file list when adding new Koi
            }}>Add Koi</Button>
            <Typography.Title level={4}>Manage Koi Fish</Typography.Title>
            <Table dataSource={filteredData} columns={columns} />

            <Modal open={showModal} onCancel={() => setShowModal(false)} title="Koi Fish" onOk={() => form.submit()} confirmLoading={loading}>
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="koiName" label="Koi Name" rules={[{ required: true, message: 'Please input the koi name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="koiType" label="Koi Type" rules={[{ required: true, message: 'Please input the koi type!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="detail" label="Detail" rules={[{ required: true, message: 'Please input the details!' }]}>
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
                            {fileList.length >= 1 ? null : <div><PlusOutlined /><div>Upload</div></div>}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

<<<<<<< HEAD
export default ManageKoi;
=======
export default ManageKoi; 
>>>>>>> af33c4a6778d3171f8be99e790f5c7c4ca430230
