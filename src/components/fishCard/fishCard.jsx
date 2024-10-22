import React, { useEffect } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function fishCard() {
  const { Meta } = Card;

  /* const [koiFishs, setKoiFishs] = useState([]);

  useEffect(() => {
    const getAllKoiFish = async () => {
      try {
        const data = await axios.get("/")
      } catch (error) {
        console.log(error.toString())
      }
    }
  }, []) */
  return (
    <Card
      style={{
        width: 300,
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
  )
}

export default fishCard