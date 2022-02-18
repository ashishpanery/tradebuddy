import React from 'react'
import { MoonLoader } from 'react-spinners'
import { css } from "@emotion/react";
import './ComponentLoader.css'
export default function ComponentLoader({ size = 60 }) {
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
    `;
    return (
        <div className='componentLoader'>
            <MoonLoader color='#2EAFB4' css={override} size={size} />
        </div>
    )
}

