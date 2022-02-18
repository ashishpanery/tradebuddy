import React from 'react'
import './Footer.css'
import footerLogo from '../../images/mentortalk.png'

import { Link } from 'react-router-dom'
function Footer() {
    return (
        <footer className='footer'>
            <div className='footerContainer'>
                <div className='footerLogo'>
                    {/* <img src={footerLogo} alt='footer_logo' style={{ filter: "brightness(120%) " }} /> */}
                    <img src={footerLogo} alt='footer_logo' />
                </div>
                <div className='footerColumn'>
                    <h2>Resources</h2>
                    <li><Link to='/about-us'>About us</Link></li>
                    <li><Link to='/contact-us'>Contact us</Link></li>
                    <li><Link to='/terms-of-use'>Review</Link></li>
                    <li><Link to='/terms-of-use'>Terms of use</Link></li>
                    <li><Link to='/privacy-policy'>Privacy policy</Link></li>
                    <li><Link to='/cancellation-&#38;-refunds'>Refunds &#38; Cancellation</Link></li>

                </div>
                <div className='footerColumn'>
                    <h2>Follow us on</h2>
                    <li><Link to="/">Youtube</Link></li>
                    <li><Link to="/">LinkedIn</Link></li>
                    <li><Link to="/">Facebook</Link></li>
                    <li><Link to="/">Twitter</Link></li>
                    <li><Link to="/">Instagram</Link></li>
                    <li><Link to="/">Reviews on Quora</Link></li>

                </div>
                <div className='footerColumn'>
                    <h2>Contact us</h2>
                    <div className='footerColumnContact'>
                        <p>Email us at</p>
                        <h5>connect@tradebuddy.io</h5>
                    </div>
                    <div className='footerColumnContact'>
                        <p>Contact number</p>
                        <h5>+91-9358515499  </h5>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
