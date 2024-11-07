import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const FailPage = () => (
  <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
    <Row gutter={[32, 32]} justify="center">
      <Col xs={24} sm={8} md={8}>
        <Title level={1} style={{ color: '#d9d9d9' }}>1</Title>
        <Title level={4}>Sign Up Your Account</Title>
        <Paragraph>
          Become a registered user first, then log in to your account and enter your card or bank details that are required for you.
        </Paragraph>
      </Col>
      <Col xs={24} sm={8} md={8}>
        <Title level={1} style={{ color: '#d9d9d9' }}>2</Title>
        <Title level={4}>Select Your Recipient</Title>
        <Paragraph>
          Enter your recipient's email address then add an amount with currency to send securely.
        </Paragraph>
      </Col>
      <Col xs={24} sm={8} md={8}>
        <Title level={1} style={{ color: '#d9d9d9' }}>3</Title>
        <Title level={4}>Send Money</Title>
        <Paragraph>
          After sending money, the recipient will be notified via email when the money has been transferred to their account.
        </Paragraph>
      </Col>
    </Row>
  </div>
);

export default FailPage;
