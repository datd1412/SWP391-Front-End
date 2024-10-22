import React from 'react';
import { Input, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import './SearchBar.scss';
const SearchBar = () => {
  return (
    <div className="search-bar" style={{ padding: '20px', textAlign: 'center' }}>
      <Space className="search-container" direction="horizontal" size="large">
        <Input className="destination"
          size="large"
          placeholder="Choose your destination"
          prefix={<EnvironmentOutlined />}
        />        
         <DatePicker className="Date_picker" size="large" placeholder="Select date" prefix={<CalendarOutlined />} />
        <Input className="Price"
          size="large"
          placeholder="Choose price"
          prefix={<DollarOutlined />}
        />
        <Input className="fish"
          size="large"
          placeholder="Koi type"
          prefix={<EnvironmentOutlined />}
        />
       
        <Button className="button_search" type="primary" size="large" icon={<SearchOutlined />}>
          Search
        </Button>
      </Space>
    </div>
  );
};

export default SearchBar;
