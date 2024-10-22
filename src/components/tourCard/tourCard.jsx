import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
const { Meta } = Card;
const tourCard = ({ isFirst }) => (
  <Card
    style={{
      width: isFirst ? 400 : 300, // Make the first card larger
      margin: '0 auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Thêm viền bóng mờ
    }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
  >
    <Meta
      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
);
export default tourCard;