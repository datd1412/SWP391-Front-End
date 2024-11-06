import React from 'react'
import Banner from '../../components/Banner/Banner';
import SearchBar from '../../components/SearchBar/SearchBar';
import TourDisplay from '../../components/tourDisplay/TourDisplay';
import FarmDisplay from '../../components/farmDisplay/FarmDisplay';
import FishDisplay from '../../components/fishDisplay/fishDisplay';
import { Layout } from 'antd';  


const { Content } = Layout;

const HomePage = () => {
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Content style={{ padding: '0 50px', marginTop: '50px' }}>
        <div>
          <Banner />
          <div style={{ marginBottom: '100px' }}>
            <SearchBar />
          </div>
          <div style={{ marginBottom: '100px' }}>
            <TourDisplay />
          </div>
          <div style={{ marginBottom: '100px' }}>
            <FishDisplay />
          </div>
          <div style={{ marginBottom: '100px' }}>
            <FarmDisplay />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default HomePage