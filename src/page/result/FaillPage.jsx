import React from 'react';
import { Button, Result, Typography } from 'antd';
import './FailPage.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Text } = Typography;

function FailPage() {
  const navigate = useNavigate();

  toast.error("Something go wrong!", {
    position: "top-center",
    autoClose: 2000,
    closeOnClick: true,
  });

  return (
    <Result
      className='fail-container'
      status="warning"
      title="There are an error occurred during your payment."
      extra={[
        <Button type="primary" key="console" onClick={() => navigate("/")}>
          Return Home
        </Button>
      ]
      }
    />
  )
}

export default FailPage;
