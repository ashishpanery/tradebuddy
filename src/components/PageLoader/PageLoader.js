import React from 'react'
import { css } from "@emotion/react";
import { MoonLoader } from 'react-spinners';
import './PageLoader.css'
export default function PageLoader() {
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
    `;
    return (
        <div className='loader'>
            <MoonLoader css={override} size={100} color='#2EAFB4' />
        </div>
    )
}