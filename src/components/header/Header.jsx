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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
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
      <img
        src="src\\image\\koi logo - remove bg.png"
        alt="Koi Fish Logo"
        width={"70px"}
      />
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
              <div
                style={{
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text strong>{user?.username}</Text>
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
