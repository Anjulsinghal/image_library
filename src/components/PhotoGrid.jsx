import React from 'react';
import Masonry from 'react-masonry-css';
import PhotoCard from './PhotoCard';

const PhotoGrid = ({ photos }) => {
  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };
  
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {photos.map(photo => (
        <div key={photo._id} className="mb-4">
          <PhotoCard photo={photo} />
        </div>
      ))}
    </Masonry>
  );
};

export default PhotoGrid;