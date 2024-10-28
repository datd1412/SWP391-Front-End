import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Row, Col, Select, Form } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import './SearchBar.scss';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const SearchBar = () => {
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);

  const fetchTours = async () => {
    try {
      const response = await api.get("/tour/search");
      setTours(response.data.content);
    } catch (error) {
      console.log(error.toString());
    }
  }

  /* const tours = [
    {
      "id": 1,
      "tourName": "Mountain Explorer",
      "decription": "A thrilling journey through the mountains.",
      "location": "Himalayas",
      "tourStart": "10-11-2024",
      "tourEnd": "14-11-2024",
      "priceAdult": 200,
      "priceChild": 100,
      "koiType": "Showa",
      "image": "mountain_explorer.jpg",
      "listFarmTour": [
        {
          "description": "Visit a highland farm with fresh produce.",
          "farmId": 101,
          "tourId": 1
        }
      ]
    },
    {
      "id": 2,
      "tourName": "Beach Paradise",
      "decription": "Relax on serene beaches with crystal-clear water.",
      "location": "Maldives",
      "tourStart": "01-12-2024",
      "tourEnd": "05-12-2024",
      "priceAdult": 300,
      "priceChild": 150,
      "koiType": "Kohaku",
      "image": "beach_paradise.jpg",
      "listFarmTour": [
        {
          "description": "Explore seaside farms and seafood markets.",
          "farmId": 102,
          "tourId": 2
        }
      ]
    },
    {
      "id": 3,
      "tourName": "Safari Adventure",
      "decription": "Discover the wildlife of the savannah.",
      "location": "Kenya",
      "tourStart": "15-01-2025",
      "tourEnd": "20-01-2025",
      "priceAdult": 500,
      "priceChild": 250,
      "koiType": "Kohaku",
      "image": "safari_adventure.jpg",
      "listFarmTour": [
        {
          "description": "Visit local farms in the savannah region.",
          "farmId": 103,
          "tourId": 3
        }
      ]
    },
    {
      "id": 4,
      "tourName": "Historical Europe",
      "decription": "A tour of the most iconic historical landmarks in Europe.",
      "location": "France, Italy, Germany",
      "tourStart": "25-10-2024",
      "tourEnd": "05-11-2024",
      "priceAdult": 1000,
      "priceChild": 500,
      "koiType": "Shiro Utsuri",
      "image": "historical_europe.jpg",
      "listFarmTour": [
        {
          "description": "Learn about ancient agricultural techniques.",
          "farmId": 104,
          "tourId": 4
        }
      ]
    },
    {
      "id": 5,
      "tourName": "Rainforest Expedition",
      "decription": "Explore the deep and lush rainforests.",
      "location": "Amazon",
      "tourStart": "01-03-2025",
      "tourEnd": "10-03-2025",
      "priceAdult": 450,
      "priceChild": 220,
      "koiType": "Asagi",
      "image": "rainforest_expedition.jpg",
      "listFarmTour": [
        {
          "description": "Visit sustainable eco-farms in the rainforest.",
          "farmId": 105,
          "tourId": 5
        }
      ]
    },
    {
      "id": 6,
      "tourName": "Island Hopping",
      "decription": "Visit multiple tropical islands with beautiful beaches.",
      "location": "Caribbean",
      "tourStart": "10-12-2024",
      "tourEnd": "15-12-2024",
      "priceAdult": 350,
      "priceChild": 175,
      "koiType": "Sanke",
      "image": "island_hopping.jpg",
      "listFarmTour": [
        {
          "description": "Learn about island agriculture and fisheries.",
          "farmId": 106,
          "tourId": 6
        }
      ]
    },
    {
      "id": 7,
      "tourName": "Desert Trek",
      "decription": "A challenging trek through the arid desert landscapes.",
      "location": "Sahara Desert",
      "tourStart": "15-02-2025",
      "tourEnd": "25-02-2025",
      "priceAdult": 550,
      "priceChild": 275,
      "koiType": "Gin Rin",
      "image": "desert_trek.jpg",
      "listFarmTour": [
        {
          "description": "Experience farming in desert oases.",
          "farmId": 107,
          "tourId": 7
        }
      ]
    },
    {
      "id": 8,
      "tourName": "City Lights",
      "decription": "Discover the vibrant nightlife of world-famous cities.",
      "location": "New York, Paris, Tokyo",
      "tourStart": "20-11-2024",
      "tourEnd": "30-11-2024",
      "priceAdult": 750,
      "priceChild": 375,
      "koiType": "Bekko",
      "image": "city_lights.jpg",
      "listFarmTour": [
        {
          "description": "Visit urban farms in bustling cities.",
          "farmId": 108,
          "tourId": 8
        }
      ]
    },
    {
      "id": 9,
      "tourName": "Cultural Asia",
      "decription": "Immerse yourself in the rich culture and history of Asia.",
      "location": "China, Japan, India",
      "tourStart": "01-04-2025",
      "tourEnd": "15-04-2025",
      "priceAdult": 900,
      "priceChild": 450,
      "koiType": "Koromo",
      "image": "cultural_asia.jpg",
      "listFarmTour": [
        {
          "description": "Explore traditional Asian farming practices.",
          "farmId": 109,
          "tourId": 9
        }
      ]
    },
    {
      "id": 10,
      "tourName": "Arctic Adventure",
      "decription": "A once-in-a-lifetime experience in the Arctic Circle.",
      "location": "Arctic",
      "tourStart": "10-06-2025",
      "tourEnd": "20-06-2025",
      "priceAdult": 1200,
      "priceChild": 600,
      "koiType": "Kikokuryu",
      "image": "arctic_adventure.jpg",
      "listFarmTour": [
        {
          "description": "Learn about farming in extreme cold climates.",
          "farmId": 110,
          "tourId": 10
        }
      ]
    },
    {
      "id": 11,
      "tourName": "Alpine Escape",
      "decription": "Ski and relax in luxury mountain resorts.",
      "location": "Swiss Alps",
      "tourStart": "20-12-2024",
      "tourEnd": "27-12-2024",
      "priceAdult": 1100,
      "priceChild": 550,
      "koiType": "Chagoi",
      "image": "alpine_escape.jpg",
      "listFarmTour": [
        {
          "description": "Tour local mountain farms.",
          "farmId": 111,
          "tourId": 11
        }
      ]
    },
    {
      "id": 12,
      "tourName": "Wine Country",
      "decription": "Tour famous vineyards and enjoy wine tasting.",
      "location": "Napa Valley",
      "tourStart": "05-11-2024",
      "tourEnd": "10-11-2024",
      "priceAdult": 800,
      "priceChild": 400,
      "koiType": "Doitsu",
      "image": "wine_country.jpg",
      "listFarmTour": [
        {
          "description": "Visit vineyards and learn about grape farming.",
          "farmId": 112,
          "tourId": 12
        }
      ]
    },
    {
      "id": 13,
      "tourName": "Northern Lights",
      "decription": "Witness the beautiful Aurora Borealis in the north.",
      "location": "Iceland",
      "tourStart": "10-01-2025",
      "tourEnd": "15-01-2025",
      "priceAdult": 1400,
      "priceChild": 700,
      "koiType": "Shusui",
      "image": "northern_lights.jpg",
      "listFarmTour": [
        {
          "description": "Learn about sustainable farming in polar regions.",
          "farmId": 113,
          "tourId": 13
        }
      ]
    }
  ] */


  const [searchFields, setSearchFields] = useState({
    name: "",
    location: "",
    price: 0,
    koiType: [],
    isChange: false,
  })

  const [searchTours, setsearchTours] = useState([]);

  function filterSearchTours() {
    setSearchFields({ ...searchFields, isChange: true });
    var filterTours = tours.filter(tour => tour.tourName.toLowerCase().includes(searchFields.name.toLowerCase()));
    if (searchFields.price == 1) {
      filterTours = filterTours.filter(tour => tour.tourPrice < 300);
    } else
      if (searchFields.price == 2) {
        filterTours = filterTours.filter(tour => tour.tourPrice >= 300 && tour.tourPrice <= 1000);
      } else
        if (searchFields.price == 3) {
          filterTours = filterTours.filter(tour => tour.tourPrice >= 1000);
        }
    setsearchTours(filterTours);
  }

  const [selectedKoiTypes, setSelectedKoiTypes] = useState([]);
  const KOITYPES = ['Kohaku', 'Taisho Sanke/Sanke', 'Showa Sanshoku', 'Shiro Utsuri', 'Asagi', 'Goromo'];
  const filteredKoiTypes = KOITYPES.filter((o) => !selectedKoiTypes.includes(o));

  const [selectedLocation, setSelectedLocation] = useState([]);
  const LOCATIONS = ['Ben Tre', 'Tra Vinh', 'Kien Luong', 'Bac Lieu', 'Dong Thap', 'Sai Gon'];
  const filteredLocations = LOCATIONS.filter((o) => !selectedLocation.includes(o));


  const handleSubmit = async (value) => {
    filterSearchTours();
  }

  useEffect(() => {
    fetchTours();
    if (searchFields.isChange) {
      navigate("/tour", { state: { searchTours } });
    }
  }, [searchTours])

  return (
    <div className="search-bar" style={{ padding: '20px', textAlign: 'center' }}>
      <Form onFinish={handleSubmit} className='form-search'>
        <Space className="search-container" direction="horizontal" size="large">
          {/* Chon theo ten */}
          <Input className="name"
            size="large"
            placeholder="Search Name"
            suffix={<SearchOutlined />}
            value={searchFields.name}
            onChange={(e) =>
              setSearchFields({ ...searchFields, name: e.target.value })
            }
          />

          {/* Chon theo dia diem */}
          <Select className='location'
            placeholder="Choose Location"
            mode="multiple"
            value={selectedLocation}
            suffixIcon={<EnvironmentOutlined />}
            onChange={(selectedLocation) => {
              setSelectedLocation(selectedLocation);
              setSearchFields({ ...searchFields, location: selectedLocation })
            }}
            style={{
              width: '100%',
            }}
            options={filteredLocations.map((item) => ({
              value: item,
              label: item,
            }))}
          />

          {/* Chon theo gia tien */}
          <Select className='Price'
            placeholder="Choose Price"
            suffixIcon={<DollarOutlined />}
            options={[
              {
                value: 1,
                label: 'Under 1.000.000 VND',
              },
              {
                value: 2,
                label: 'From 1M to 2M VND',
              },
              {
                value: 3,
                label: 'Above 1 jack',
              },
            ]}
            onChange={(value) =>
              setSearchFields({ ...searchFields, price: value })
            }
          />

          {/* Chon theo giong ca */}
          <Select className='fish'
            mode="multiple"
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
