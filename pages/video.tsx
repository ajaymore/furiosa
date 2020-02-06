import React, { useContext } from 'react';
import { compose } from 'redux';
import { withDimensions, DimensionsContext } from '../hocs/withDimensions';
import { VideoPlayer } from '../components/VideoPlayer';

function Video() {
  const { width, height } = useContext(DimensionsContext);
  return (
    <VideoPlayer
      url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
      {...{ height, width }}
      onEnded={() => {
        console.log('Video ends now...');
      }}
    />
  );
}

export default compose(withDimensions)(Video, {});
