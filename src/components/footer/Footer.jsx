import { Col, Row } from 'antd';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import './Footer.scss';

function Footer() {
  return (
    <>
      <div className='footer'>
        <div className='ft-container'>
          <div className='row'>
            <div className='footer-col'>
              <div>
                <img src='src\image\koi logo - remove bg.png' alt='' width={'200px'} />
                <h3>Koi tour service</h3>
              </div>
            </div>
            <div className='footer-col'>
              <h4>Contact us</h4>
              <ul>
                <li>
                  <FontAwesomeIcon icon={faPhone} />
                  Hotline: 081 5242 499
                </li>
                <li>
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email: datdse182133@fpt.edu.vn
                </li>
                <li>
                  <FontAwesomeIcon icon={faLocationDot} />
                  Address: ???
                </li>
              </ul>
            </div>
            <div className='footer-col'>
              <h4>Follow us</h4>
              <div className='social-links'>
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
                <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer