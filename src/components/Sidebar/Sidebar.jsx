import React from 'react';
import { Flex, Menu } from 'antd';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate để điều hướng
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

const Sidebar = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

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
          onClick={() => navigate('/manager/ManageFarm')}
        >
          Dashboard
        </Menu.Item>
        
        <Menu.Item 
          key="2" 
          icon={<OrderedListOutlined />}
          onClick={() => navigate('/manager/ManageKoi')  } 
        >
          ToDo
        </Menu.Item>
        <Menu.Item 
          key="3" 
          icon={<CarryOutOutlined />} 
          onClick={() => navigate('/manager/ManageTour')  }
        >
          Tasks
        </Menu.Item>
        <Menu.Item 
          key="4" 
          icon={<ProfileOutlined />} 
        >
          Profile
        </Menu.Item>
        <Menu.Item 
          key="5" 
          icon={<SettingOutlined />} 
        >
          Setting
        </Menu.Item>
        <Menu.Item 
          key="6" 
          icon={<LoginOutlined />} 
        >
          Logout
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Sidebar;
