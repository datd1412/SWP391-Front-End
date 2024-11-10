import React from "react";
import { Menu, Button, Dropdown, Switch, Avatar, Typography } from "antd"; // Add Typography
import {
  BellOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./Header.scss";
import { useNavigate } from "react-router-dom";

const { Text } = Typography; // Destructure Text from Typography

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleSwitchAdmin = () => {
    navigate("/manager");

  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => navigate("/profile", { state: { user } })} key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="notifications" icon={<BellOutlined />}>
        Notifications
        <Switch style={{ marginLeft: "10px" }} defaultChecked />
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <img src="https://firebasestorage.googleapis.com/v0/b/loginby-35c92.appspot.com/o/koi%20logo%20-%20remove%20bg.png?alt=media&token=e721ab61-93b9-45d8-92bd-eb4177902ed7" width={'70px'} />
      <Menu mode="horizontal" theme="light" className="menu-items">
        <Menu.Item onClick={() => navigate("/")} key="home">
          Home
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/koifarm")} key="koiFarm">
          Koi Farm
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/tour")} key="tour">
          Tour
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/koifish")} key="koiFish">
          Koi Fish
        </Menu.Item>
      </Menu>

      {
      (user?.data.role === "ADMIN" || user?.data.role === "STAFF" || user?.data.role === "CONSULTANT_STAFF") && (
          <Switch
            unCheckedChildren="Switch Staff"
            defaultChecked={false}
            style={{
              marginRight: '30px'
            }}
            onChange={handleSwitchAdmin}
          />
        )
      }

      <div className="auth-buttons">
        {user ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Avatar
                size={30}
                src="https://example.com/path-to-avatar.jpg"
                icon={<UserOutlined />}
              />
              <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
                <Text strong>{user.data?.username}</Text>
              </div>
            </div>
          </Dropdown>
        ) : (
          <>
            <Button
              type="text"
              icon={<LoginOutlined />}
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
