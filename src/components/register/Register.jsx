import React from 'react';
import './Register.scss';
import { Button, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { provider } from '../../config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import api from '../../config/axios';
function Register() {

  const navigate = useNavigate();

  function handleLoginGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        navigate("/")
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  const handleFinish = async (values) => {
    try {
      const response = await api.post("/register", values);
      console.log(values);
      navigate("/login");
    }
    catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <Row className='register'>
        <Col className='left-side' span={10}>
          <div className="theme-container">
            <div className="theme-panel">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
            </div>
          </div>
        </Col>
        <Col className='right-side' span={14}>
          <div className="regis-container" >
            <h1>Create Account</h1>
            <Form onFinish={handleFinish} layout='vertical' className='form-register'>
              {/* Fullname */}
              <Form.Item label="Full name" name="fullName">
                <Input placeholder=" " />
              </Form.Item>
              {/* Username */}
              <Form.Item label="Username" name="username">
                <Input placeholder=" " />
              </Form.Item>
              {/* Email */}
              <Form.Item label="Email" name="email" rules={[
                {
                  required: true,
                  message: "Email cannot be blank",
                },
                {
                  pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                  message: "Wrong email format",
                }
              ]}>
                <Input placeholder=" " />
              </Form.Item>
              {/* Address */}
              <Form.Item label="Address" name="address">
                <Input placeholder=" " />
              </Form.Item>
              {/* Password */}
              <Form.Item label="Password" name="password" rules={[
                {
                  required: "true",
                  message: "Password cannot be blank",
                }
              ]}>
                <Input.Password placeholder=" " />
              </Form.Item>
              <Form.Item label="Confirm password" name="retype_password" rules={[
                {
                  required: "true",
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The two passwords do not match!')
                    );
                  },
                }),
              ]}>
                <Input.Password placeholder=" " />
              </Form.Item>
              <Button className='btn-container' htmlType='submit'>
                Sign Up
              </Button>
            </Form>
            <p>Already have an account?
              <Link to={"/login"}>Login</Link>
            </p>
          </div>
          <div className='login-option'>
            <Button onClick={handleLoginGoogle}>
              <img src="https://img.icons8.com/color/48/null/gmail-new.png" alt="" width='20px' />
              Sign in with Gmail
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Register