import React from "react";
import { Button, Card } from "antd";
import "./FishCard1.scss";

const { Meta } = Card;

const FishCard1 = ({ fish, onViewDetail }) => (
  <Card
    style={{ width: 300 }} // Đặt chiều rộng cố định cho card
    cover={<img alt={fish.koiName} src={fish.image || "https://via.placeholder.com/300"} />}
  >
    <Meta title={fish.koiName} />
    <Button className="detail" onClick={onViewDetail}>View Detail</Button> {/* Nút View Detail */}
  </Card>
);

export default FishCard1;