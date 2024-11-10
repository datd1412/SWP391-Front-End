import React from 'react';
import { Flex, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import Logo from '../../image/logo.png';
import { 
    UserOutlined,
    ProfileOutlined,
    LoginOutlined,
    OrderedListOutlined,
    CarryOutOutlined,
    SettingOutlined, 
} from '@ant-design/icons';
import './Sidebar.scss';

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  
  const role = user?.data?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={Logo} alt="Koi Fish Logo" />
        </div>
      </Flex>
      <Menu mode="inline" defaultSelectedKeys={['1']} className="menu-bar">
        <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/manager/Dashboard')}>
          Dashboard
        </Menu.Item>
        {role === 'ADMIN' && (
          <>
            <Menu.Item key="2" icon={<CarryOutOutlined />} onClick={() => navigate('/manager/ManageFarm')}>
              Manage Farm
            </Menu.Item>
            <Menu.Item key="3" icon={<OrderedListOutlined />} onClick={() => navigate('/manager/ManageKoi')}>
              Manage Koi
            </Menu.Item>
            <Menu.Item key="4" icon={<CarryOutOutlined />} onClick={() => navigate('/manager/ManageTour')}>
              Manage Tour
            </Menu.Item>
            <Menu.Item key="5" icon={<ProfileOutlined />} onClick={() => navigate('/manager/ManageBooking')}>
              Booking Approval
            </Menu.Item>
          </>
        )}
        {role === 'STAFF' && (
          <Menu.Item key="6" icon={<CarryOutOutlined />} onClick={() => navigate('/manager/BookingProcess')}>
            Booking Process
          </Menu.Item>
        )}
        {role === 'CONSULTANT_STAFF' && (
          <Menu.Item key="7" icon={<SettingOutlined />} onClick={() => navigate('/manager/BookingManagement')}>
            Booking Management
          </Menu.Item>
        )}
        <Menu.Item key="8" icon={<LoginOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Sidebar;
