import React from "react";
import "./Login.scss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { provider } from "../../config/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import api from "../../config/axios";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/action/userAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand, faThumbsUp } from '@fortawesome/free-regular-svg-icons';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const response = await api.post("/login", values);
      /*       const { token } = response.data; */
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      const user = {
        fullName: response.data.data.fullName,
        username: response.data.data.username,
        email: response.data.data.email,
        address: response.data.data.address,
        role: response.data.data.role,
      }
      dispatch(setUser(user));
      navigate("/");
      toast.success("Login Success", {
        position: "top-center",
        icon: <FontAwesomeIcon icon={faThumbsUp} color="#CA803D" />,
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (e) {
      console.log(e);
      toast.error("Invalid username or password!", {
        position: "top-left",
        icon: <FontAwesomeIcon icon={faHand} color="#ED766A" />,
        autoClose: 3000,
        closeOnClick: true,
      });

    }
  };

  /* function handleLoginGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        navigate("/");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  } */

  function handleLoginGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Thông tin người dùng nhận được sau khi đăng nhập thành công
        const user = result.user;
        console.log(user);

        // Lưu thông tin người dùng vào localStorage
        const userInfo = {
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          role: "USER", // Bạn có thể xác định quyền người dùng sau, mặc định có thể là USER
        };

        localStorage.setItem("user", JSON.stringify(userInfo));

        // Cập nhật Redux store
        dispatch(setUser(userInfo));

        // Chuyển đến trang chủ
        navigate("/");
      })
      .catch((error) => {
        // Xử lý lỗi đăng nhập
        console.error("Error during Google login", error);
        alert(`Error: ${error.message}`);
      });
  }

  return (
    <Row className="login">
      <Col className="left-sider" span={14}>
        <div className="container">
          <h1>Sign in to</h1>
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            style={{
              maxWidth: 360,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              className="input-field"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              className="input-field"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a className="forgot-password" href="">
                  Forgot password
                </a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                className="login-button"
                block
                type="primary"
                htmlType="submit"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="divider">
          <span>
            ---------------------- Or login with ----------------------
          </span>
        </div>
        <div>
          <Button className="btn-gmail" onClick={handleLoginGoogle}>
            <img
              src="https://img.icons8.com/color/48/null/gmail-new.png"
              alt=""
              width="20px"
            />
            Sign in with Gmail
          </Button>
          <p className="signup-text">
            Don't have an account?
            <Link to={"/register"} className="link-register">
              Register
            </Link>
          </p>
        </div>
      </Col>
      <Col className="right-sider" span={10}>
        <div className="theme-container">
          <div className="theme-panel">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
