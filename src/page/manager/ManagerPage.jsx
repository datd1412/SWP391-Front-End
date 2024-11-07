import { Button, Layout } from "antd";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import CustomHeader from "../../components/managerHeader/Header";
import './ManagerPage.scss';
import { Outlet } from 'react-router-dom'; 

const {Sider, Header, Content} =Layout;
const ManagerPage = () => {
  const [collapsed, setCollapsed] = useState(false)
  return( 
     <Layout className="Manager">
        <Sider 
        theme="light" 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        className="sider"
        >
           <Sidebar/>  
           <Button 
               type="text" 
               icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/>}
               onClick={()=> setCollapsed(!collapsed)}  
               className="trigger-btn"
            />
        </Sider>
        <Layout>
            <Header className="header">
            <CustomHeader />
            </Header>
            <Content className="content">
                <Outlet />
          </Content>
        </Layout>
  </Layout>
  ); 
};
export default ManagerPage;