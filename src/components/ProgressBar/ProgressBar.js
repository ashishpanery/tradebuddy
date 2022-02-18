import React from 'react'

export default function ProgressBar(props) {
  const { bgcolor, completed } = props;
  const containerStyles = {
    height: 5,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }
  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }
  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
      </div>
    </div>
  )
}

