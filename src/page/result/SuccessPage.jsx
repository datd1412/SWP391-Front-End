import { Button, Result } from 'antd'
import React, { useEffect } from 'react'
import useGetParams from '../../assets/hook/useGetParams'
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {

    const selectedTab = '3';
    const navigate = useNavigate();
    const params = useGetParams();
    const orderID = params("orderID");
    const vnp_TransactionStatus = params("vnp_TransactionStatus");
    console.log("orderID: ", orderID);
    console.log("vnp_TransactionStatus: ",vnp_TransactionStatus);

    const handlePayment = async () => {
        try {
            const response = await api.post(`/order/status?orderId=${orderID}`);
            console.log(response);

        } catch (error) {
            console.log(error.toString());
        }
    }

    useEffect(() => {
        if (vnp_TransactionStatus==="00") {
            handlePayment();
        }else {
            navigate("/failPayment");
        }
    })

    return (
        <div className='success-container' style={{
            height: '605px',
        }}>
            <Result
                status="success"
                title="Successfully Purchased Cloud Server ECS!"
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                    <Button type="primary" key="console" onClick={() => navigate("/")}>
                        Go Home
                    </Button>,
                    <Button key="buy" onClick={() => navigate("/profile", { state: { selectedTab } })}>View my booking</Button>,
                ]}
            />
        </div>
    )
}

export default SuccessPage