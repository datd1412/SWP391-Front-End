import { Flex, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const CustomHeader = ({ user }) => {
  return (
    <Flex>
      <Title level={3} type="secondary">
        Welcome back, {user?.data?.fullName || 'Guest'}
      </Title>
    </Flex>
  );
}

export default CustomHeader;
