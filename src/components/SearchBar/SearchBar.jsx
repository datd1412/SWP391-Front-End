import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Row, Col, Select, Form, DatePicker } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import './SearchBar.scss';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';


const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTours, setSearchTours] = useState([]);

  const [searchFields, setSearchFields] = useState({
    nameFarm: "",
    startTime: "2025-12-31",
    price: 1000000000,
    koiType: "",
  })

  const handleToastingLoad = (filter4) => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Data loaded successfully!");
      }, 1500);
    });

    toast.promise(myPromise, {
      pending: "Searching, please wait...",
      success: {
        render: "Data loaded successfully! 👌",
        onClose: () => navigate("/tour", { state: { filter4 } }),
      },
      error: "Failed to load data 😞"
    }, {
      position: "top-center",
      autoClose: 800,
    })

  }


  const [selectedKoiTypes, setSelectedKoiTypes] = useState([]);
  const KOITYPES = ['Kohaku', 'Taisho Sanke', 'Showa', 'utsuri', 'Asagi', 'bekko', 'chagoi', 'kiku', 'platinum'];
  const filteredKoiTypes = KOITYPES.filter((o) => !selectedKoiTypes.includes(o));

  const fetchToursByFarmName = async (tours) => {
    const result = [];

    for (const tour of tours) {
      const farmList = await Promise.all(
        tour.listFarmTour.map(async (farm) => {
          const farmData = await api.get(`/farm/${farm.farmId}`);
          return farmData.data;
        })
      );

      const isFarmExist = doesFarmNameExist(farmList);
      if (isFarmExist) {
        result.push(tour);
      }
    }

    return result;
  };

  const fetchToursByKoiType = async (tours) => {
    const result = [];

    for (const tour of tours) {
      const farmList = await Promise.all(
        tour.listFarmTour.map(async (farm) => {
          const farmData = await api.get(`/farm/${farm.farmId}`);
          return farmData.data;
        })
      );

      for (const farm of farmList) {
        const koiList = await Promise.all(
          farm.listFarmKoi.map(async (koi) => {
            const koiData = await api.get(`/koifish/${koi.koiId}`);
            return koiData.data;
          })
        );
        const isKoiExist = doesKoiTypeExist(koiList);
        if (isKoiExist) {
          result.push(tour);
        }
      }
    }

    return result;
  };

  const doesFarmNameExist = (farmsArray) => {
    return farmsArray.some(farm => farm.farmName.includes(searchFields.nameFarm));
  };

  const doesKoiTypeExist = (koisArray) => {
    return koisArray.some(koi => koi.koiType.includes(searchFields.koiType));
  };

  const handleSubmit = async () => {
    try {
      console.log(searchFields);
      const response = await api.get("/tour");
      if (searchFields.startTime !== '') {
        const filter1 = response.data.filter((tour) => new Date(tour.tourStart) < new Date(searchFields.startTime));
        setSearchTours(filter1);
      }
      if (searchFields.price>0) {
        const filter2 = searchTours.filter((tour) => tour.priceAdult < searchFields.price);
        setSearchTours(filter2);
      }

      if (searchFields.nameFarm !== '') {
        const filter3 = await fetchToursByFarmName(searchTours);
        setSearchTours(filter3);
      }

      if (searchFields.koiType !== '') {
        const filter4 = await fetchToursByKoiType(searchTours);
        setSearchTours(filter4);
      }


      console.log("a: ", response.data);
      handleToastingLoad(searchTours);
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
                value: 2000000,
                label: 'Under 2.000.000 VND',
              },
              {
                value: 5000000,
                label: 'Under 5.000.000 VND',
              },
              {
                value: 10000000,
                label: 'Under 10.000.000 VND',
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
