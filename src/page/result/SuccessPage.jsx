import { Button, Result } from 'antd'
import React from 'react'

function SuccessPage() {
    return (
        <div className='success-container' style={{
            height: '605px',
        }}>
            <Result
                status="success"
                title="Successfully Purchased Cloud Server ECS!"
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                    <Button type="primary" key="console">
                        Go Home
                    </Button>,
                    <Button key="buy">View my booking</Button>,
                ]}
            />
        </div>
    )
}

export default SuccessPage