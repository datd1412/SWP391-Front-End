import React, { useEffect, useState } from 'react';
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, TimePicker, Popconfirm, Upload, Select, Row, Col, AutoComplete, Image } from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file';

function ManageFarm() {
    const [datas, setDatas] = useState([]);
    const [tourList, setTourList] = useState([]);
    const [koiList, setKoiList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [locationFilter, setLocationFilter] = useState('');

    const fetchRelatedData = async () => {
        try {
            const tours = await api.get("tour");
            const kois = await api.get("koifish");
            setTourList(tours.data);
            setKoiList(kois.data);
        } catch (err) {
            toast.error("Error fetching tour or koi data");
        }
    };

    const fetchData = async () => {
        try {
            const response = await api.get("farm");
            setDatas(response.data);
            setFilteredData(response.data);
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    const handleSumbit = async (values) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            const url = await uploadFile(file.originFileObj);
            values.image = url; // Add image URL to values
        }
    
        const formattedValues = {
            ...values,
            startTime: values.startTime.format("HH:mm:ss"),
            endTime: values.endTime.format("HH:mm:ss"),
            listFarmTour: values.listFarmTour.map(tour => ({
                farmId: tour.farmId,
                tourId: tour.tourId,
                description: tour.description,
            })),
            listFarmKoi: values.listFarmKoi.map(koi => ({
                farmId: koi.farmId,
                koiId: koi.koiId,
                quantity: koi.quantity,
            })),    
        };

        if (!formattedValues.id) {
            formattedValues.id = 0;
        }

        try {
            setLoading(true);
            if (formattedValues.id && formattedValues.id !== 0) {
                await api.put(`farm/${formattedValues.id}`, formattedValues);
            } else {
                await api.post("farm", formattedValues);
            }
            toast.success("Successfully saved");
            fetchData();
            form.resetFields();
            setShowModal(false);
        } catch (err) {
            toast.error(err.response?.data || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`farm/${id}`);
            toast.success("Successfully deleted");
            fetchData();
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRelatedData();
    }, []);

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
        setFileList([{ preview: file.url || file.preview }]);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div>Upload</div>
        </div>
    );

    const handleFilterChange = (value) => {
        const filtered = datas.filter(item => 
            item.farmName.toLowerCase().includes(value.toLowerCase()) ||
            item.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleLocationFilterChange = (value) => {
        setLocationFilter(value);
        handleFilterChange(value);
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (image ? <Image width={50} src={image} /> : 'No Image'),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Farm Name',
            dataIndex: 'farmName',
            key: 'farmName',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id, farm) => (
                <>
                    <Button type="default" style={{ marginLeft: 8 }} onClick={() => {
                        setShowModal(true);
                        form.setFieldsValue({
                            ...farm,
                            startTime: dayjs(farm.startTime, "HH:mm:ss"),
                            endTime: dayjs(farm.endTime, "HH:mm:ss"),
                            listFarmTour: farm.listFarmTour.map(tour => ({
                                tourId: tour.tourId,
                                description: tour.description,
                            })),
                            listFarmKoi: farm.listFarmKoi.map(koi => ({
                                koiId: koi.koiId,
                                quantity: koi.quantity,
                            })),
                        });
                    }}>
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete"
                        description="Do you want to delete this farm?"
                        onConfirm={() => handleDelete(id)}
                    >
                        <Button type="default" danger style={{ marginLeft: 8 }}>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Search by Farm Name"
                    options={datas.map(farm => ({ value: farm.farmName }))}
                    onChange={handleFilterChange}
                />
                <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Search by Location"
                    options={datas.map(farm => ({ value: farm.location }))}
                    onChange={handleLocationFilterChange}
                />
            </div>

            <Button onClick={() => {
                setShowModal(true);
                form.resetFields();
            }}>
                Add Farm
            </Button>
            <Typography.Title level={4}>Farm</Typography.Title>
            <Table dataSource={filteredData.length > 0 ? filteredData : datas} columns={columns} />

            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                title="Farm"
                onOk={() => form.submit()}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    labelCol={{ span: 24 }}
                    onFinish={handleSumbit}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="farmName"
                        label="Farm Name"
                        rules={[{ required: true, message: 'Please input the farm name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please input the location!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item label="Time">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="startTime"
                                    rules={[{ required: true, message: 'Please select the start time!' }]}
                                >
                                    <TimePicker format="HH:mm:ss" placeholder="Start Time" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="endTime"
                                    rules={[{ required: true, message: 'Please select the end time!' }]}
                                >
                                    <TimePicker format="HH:mm:ss" placeholder="End Time" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.List name="listFarmTour">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'tourId']}
                                            label="Tour"
                                            rules={[{ required: true, message: 'Please select a tour' }]}
                                        >
                                            <Select placeholder="Select tour">
                                                {tourList.map(tour => (
                                                    <Select.Option key={tour.id} value={tour.id}>
                                                        {tour.tourName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            label="Tour Description"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Button onClick={() => remove(name)} danger>Remove</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>Add Tour</Button>
                            </>
                        )}
                    </Form.List>

                    <Form.List name="listFarmKoi">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'koiId']}
                                            label="Koi"
                                            rules={[{ required: true, message: 'Please select a koi' }]}
                                        >
                                            <Select placeholder="Select koi">
                                                {koiList.map(koi => (
                                                    <Select.Option key={koi.id} value={koi.id}>
                                                        {koi.koiName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            label="Quantity"
                                            rules={[{ required: true, message: 'Please input the quantity!' }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                        <Button onClick={() => remove(name)} danger>Remove</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>Add Koi</Button>
                            </>
                        )}
                    </Form.List>

                    <Form.Item
                        label="Upload Image"
                        name="image"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManageFarm;
