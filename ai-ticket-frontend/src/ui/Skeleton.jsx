import React from 'react';
import './Skeleton.css';

const Skeleton = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  ...props
}) => {
  const classes = [
    'skeleton',
    `skeleton--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const style = {
    width,
    height,
    ...props.style
  };

  return <div className={classes} style={style} {...props} />;
};

export default Skeleton;