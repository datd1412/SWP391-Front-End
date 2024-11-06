import React from 'react';
import { Carousel } from 'antd';
import './Banner.scss';

const Banner = () => {
  return (
    <Carousel autoplay={true}>
      <div className='banner-item'>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/loginby-35c92.appspot.com/o/Banner%201.png?alt=media&token=daa9d552-0891-4542-a0cb-b4afbdeb3c42"
          alt="Sale Banner 1"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <div className='banner-item'>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/loginby-35c92.appspot.com/o/Banner%202.png?alt=media&token=8729daeb-70f7-4e80-aae4-2e1ea64e9b87"
          alt="Sale Banner 2"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <div className='banner-item'>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/loginby-35c92.appspot.com/o/Banner%203.jpg?alt=media&token=e7d1f38f-2b0e-4fff-a1df-c203452d8212"
          alt="Sale Banner 3"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </Carousel>
  );
};

export default Banner;
