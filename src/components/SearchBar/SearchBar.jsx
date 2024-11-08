import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Row, Col, Select, Form, DatePicker } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import './SearchBar.scss';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';


const SearchBar = () => {
  const navigate = useNavigate();

  const [searchFields, setSearchFields] = useState({
    nameFarm: "",
    startTime: "",
    price: 0,
    koiType: "",
  })

  const handleToastingLoad = () => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Data loaded successfully!");
      }, 2000);
    });

    toast.promise(myPromise, {
      pending: "Searching, please wait...",
      success: {
        render: "Data loaded successfully! 👌",
        onClose: () => navigate("/tour"),
      },
      error: "Failed to load data 😞"
    }, {
      position: "top-center",
      autoClose: 1500,
    })

  }


  const [selectedKoiTypes, setSelectedKoiTypes] = useState([]);
  const KOITYPES = ['Kohaku', 'Taisho Sanke/Sanke', 'Showa Sanshoku', 'Shiro Utsuri', 'Asagi', 'Goromo'];
  const filteredKoiTypes = KOITYPES.filter((o) => !selectedKoiTypes.includes(o));


  const handleSubmit = async () => {
    try {
      const obj = {
        nameFarm: "duyngu",
        startTime: "2024-10-20",
        price: 1000000,
        koiType: "Kohaku",
      }
      const response = await api.get("/tour/search", searchFields);
      handleToastingLoad();
      /* navigate("/tour", { state: { response } }); */
      console.log("Danh sach tour: ", response.data);
      console.log(searchFields);
    } catch (error) {
      console.log(error.toString());
    }
  }

  return (
    <div className="search-bar" style={{ padding: '20px', textAlign: 'center' }}>
      <Form onFinish={handleSubmit} className='form-search'>
        <Space className="search-container" direction="horizontal" size="large">
          {/* Chon theo ten */}
          <Input className="name"
            size="large"
            placeholder="Search Name"
            suffix={<SearchOutlined />}
            value={searchFields.nameFarm}
            onChange={(e) =>
              setSearchFields({ ...searchFields, nameFarm: e.target.value })
            }
          />

          {/* Chon theo ngay di */}
          <DatePicker
            className='Date_picker'
            onChange={(date) =>
              setSearchFields({ ...searchFields, startTime: date ? date.format('YYYY-MM-DD') : null })
            }
          />


          {/* Chon theo gia tien */}
          <Select className='Price'
            placeholder="Choose Price"
            suffixIcon={<DollarOutlined />}
            options={[
              {
                value: 1000000,
                label: 'Under 1.000.000 VND',
              },
              {
                value: 2000000,
                label: 'Under 2.000.000 VND',
              },
              {
                value: 5000000,
                label: 'Under 5.000.000 VND',
              },
            ]}
            onChange={(value) =>
              setSearchFields({ ...searchFields, price: value })
            }
          />

          {/* Chon theo giong ca */}
          <Select className='fish'
            placeholder="Koi Type"
            value={selectedKoiTypes}
            onChange={(selectedKoiTypes) => {
              setSelectedKoiTypes(selectedKoiTypes);
              setSearchFields({ ...searchFields, koiType: selectedKoiTypes })
            }}
            style={{
              width: '100%',
            }}
            options={filteredKoiTypes.map((item) => ({
              value: item,
              label: item,
            }))}
          />

          <Button htmlType='submit'
            className="button_search"
            type="primary"
            size="large"
            icon={<SearchOutlined />}>
            Search
          </Button>
        </Space>
      </Form>
    </div>

  );
};

export default SearchBar;
