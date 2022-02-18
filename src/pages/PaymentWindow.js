import React from 'react'
import './PaymentWindow.css'
import Header from '../components/Header/Header'
import CardComponent from '../components/CardComponent/CardComponent'
function PaymentWindow() {
    return (
        <div className='paymentWindow'>
            <div className='paymentWindowHeader'>
                <Header/>
            </div>
            <div className='paymentWindowContainer'>
                <div className='paymentWindowLeft'>
                </div>
                <div className='paymentWindowRight'>
                    <div className='paymentWindowRightBox'>
                        <div className='paymentWindowRightBoxTop'>
                            <h3>total amount:</h3>
                            <h1>$ 120</h1>
                        </div>
                        <div className='paymentEindowRightBoxContainer'>
                            <p>Pay Using</p>
                            <CardComponent/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentWindow
