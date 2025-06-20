import React from 'react';
import { IKImage } from 'imagekitio-react';

const Image = ({ src, className, w, h, alt }) => {
  const IK_ENDPOINT = import.meta.env.VITE_IK_URL_ENDPOINT;

  const isFullUrl = /^https?:\/\//.test(src); // better check for full URL

  if (isFullUrl || !IK_ENDPOINT) {
    return (
      <img
        src={src}
        className={className}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={IK_ENDPOINT}
      path={src}
      className={className}
      alt={alt}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
