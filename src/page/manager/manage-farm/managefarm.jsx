import React, { useEffect, useState } from 'react';
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Table, Space, Typography, Modal, Button, Form, Input, TimePicker, Popconfirm, Upload, Select, Row, Col} from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../utils/file'; // Giả sử bạn đã có hàm uploadFile để xử lý việc upload

function ManageFarm() {
    const [datas, setDatas] = useState([]);
    const [tourList, setTourList] = useState([]); // Danh sách tour
    const [koiList, setKoiList] = useState([]); // Danh sách cá koi
    const [fileList, setFileList] = useState([]); // Danh sách file ảnh
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Lấy danh sách tour và cá koi từ API
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

    // GET: Lấy dữ liệu farm
    const fetchData = async () => {
        try {
            const response = await api.get("farm");
            setDatas(response.data);
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    // CREATE OR UPDATE: Lưu dữ liệu farm
    const handleSumbit = async (values) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            const url = await uploadFile(file.originFileObj);
            values.image = url; // Thêm đường dẫn ảnh vào values
        }
    
        const formattedValues = {
            ...values,
            startTime: values.startTime.format("HH:mm:ss"),
            endTime: values.endTime.format("HH:mm:ss"),
            listFarmTour: values.listFarmTour.map(tour => ({
                farmId: tour.farmId, // Gửi farmId tương ứng
                tourId: tour.tourId,
                description: tour.description,
            })),
            listFarmKoi: values.listFarmKoi.map(koi => ({
                farmId: koi.farmId, // Gửi farmId tương ứng
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

    // DELETE: Xóa farm
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
        fetchRelatedData(); // Lấy dữ liệu liên quan khi component render
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

    const columns = [
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
                    <Button type="primary"  style={{ marginLeft: 8 }}  onClick={() => {
                        setShowModal(true);
                        form.setFieldsValue({
                            ...farm,
                            startTime: dayjs(farm.startTime, "HH:mm:ss"),
                            endTime: dayjs(farm.endTime, "HH:mm:ss"),
                            // Thiết lập farmKoiList và listFarmTour
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
                        <Button type="primary" danger  style={{ marginLeft: 8 }} >
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <div>
            <Button onClick={() => {
                setShowModal(true);
                form.resetFields();
            }}>
                Add 
            </Button>
            <Typography.Title level={4}>Farm</Typography.Title>
            <Table dataSource={datas} columns={columns} />

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

                    {/* Chọn Tour */}
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

                    {/* Chọn Cá Koi */}
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

                    {/* Upload Hình Ảnh */}
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
