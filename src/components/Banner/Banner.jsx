import React from 'react';
import { Carousel } from 'antd';
import './Banner.scss';

const Banner = () => {
  return (
    <Carousel>
      <div className='banner-item'>
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2335da3c-0b92-4efd-8589-97cab1d3c2ea/dgfob7i-676713ac-ee25-4218-8ff8-ec07e46df8b8.jpg/v1/fill/w_1154,h_692,q_75,strp/koi_pond___ai_wallpaper_by_marwil_arts_dgfob7i-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjkyIiwicGF0aCI6IlwvZlwvMjMzNWRhM2MtMGI5Mi00ZWZkLTg1ODktOTdjYWIxZDNjMmVhXC9kZ2ZvYjdpLTY3NjcxM2FjLWVlMjUtNDIxOC04ZmY4LWVjMDdlNDZkZjhiOC5qcGciLCJ3aWR0aCI6Ijw9MTE1NCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.iP5PGBM2h58oRyikq_KIwWgNEwUFtL0vyGUwwVdSFXo"
          alt="Sale Banner 1"
          style={{ width: '700px' }}
        />
      </div>
      <div className='banner-item'>
        <img
          src="https://thumbs.dreamstime.com/b/beautiful-koi-fish-wallpaper-colorful-graceful-digital-art-captivating-showcases-stunning-arrangement-vividly-308854647.jpg"
          alt="Sale Banner 2"
          style={{ width: '700px' }}
        />
      </div>
    </Carousel>
  );
};

export default Banner;
