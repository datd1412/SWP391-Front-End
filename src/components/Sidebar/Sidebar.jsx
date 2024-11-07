import React from 'react';
import { Flex, Menu } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
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

const Sidebar = ({ user, setUser }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Clear user state
    navigate('/login'); // Navigate to login page
  };
  
  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={Logo} alt="Koi Fish Logo" />
        </div>
      </Flex>
      <Menu 
          mode="inline" 
          defaultSelectedKeys={['1']} 
          className="menu-bar"
      >
        <Menu.Item 
          key="1" 
          icon={<UserOutlined />} 
          onClick={() => navigate('/manager/Dashboard')}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item 
          key="2" 
          icon={<CarryOutOutlined />} 
          onClick={() => navigate('/manager/ManageFarm')}
        >
          Tasks
        </Menu.Item>
        <Menu.Item 
          key="3" 
          icon={<OrderedListOutlined />}
          onClick={() => navigate('/manager/ManageKoi')} 
        >
          ToDo
        </Menu.Item>
        <Menu.Item 
          key="4" 
          icon={<CarryOutOutlined />} 
          onClick={() => navigate('/manager/ManageTour')}
        >
          Tasks
        </Menu.Item>
        <Menu.Item 
          key="5" 
          icon={<ProfileOutlined />} 
          onClick={() => navigate('/manager/BookingProcess')}
        >
          Profile
        </Menu.Item>
        <Menu.Item 
          key="6" 
          icon={<CarryOutOutlined />} 
          onClick={() => navigate('/manager/ManageBooking')}
        >
          Tasks
        </Menu.Item>
        <Menu.Item 
          key="7" 
          icon={<SettingOutlined />} 
          onClick={() => navigate('/manager/BookingManagement')}
        >
          Setting
        </Menu.Item>

        <Menu.Item 
          key="8" 
          icon={<LoginOutlined />} 
          onClick={handleLogout} // Add onClick handler here
        >
          Logout
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Sidebar;
