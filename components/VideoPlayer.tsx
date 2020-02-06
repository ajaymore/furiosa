import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Slider, Typography, withStyles, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Tooltip from '@material-ui/core/Tooltip';
import {
  getFormattedTime,
  getFormattedTimeMS,
  getComputedHeightWidth
} from '../lib/utils';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import * as screenfull from 'screenfull';

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;

  const popperRef: any = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={getFormattedTime(value)}
    >
      {children}
    </Tooltip>
  );
}

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '15px 0'
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: '#ff0000',
    boxShadow: iOSBoxShadow,
    // marginTop: -14,
    // marginLeft: -14,
    '&:focus,&:hover,&$active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow
      }
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 11px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000'
    }
  },
  track: {
    height: 4,
    backgroundColor: '#ff0000'
  },
  rail: {
    height: 4,
    opacity: 0.5,
    backgroundColor: '#bfbfbf'
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor'
  }
})(Slider);

export function VideoPlayer({
  url,
  onEnded,
  height,
  width
}: {
  url: string;
  onEnded: any;
  height: number;
  width: number;
}) {
  const [dims, setDims] = useState({ height: 0, width: 0, duration: 0 });
  const [playing, setPlaying] = useState(false);
  const [value, setValue] = React.useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const ref: any = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);

  const keypress_event = useCallback(
    (evt: any) => {
      if (evt.keyCode === 32) {
        setPlaying(!playing);
      }
    },
    [playing]
  );
  const callback = useCallback(() => {
    setFullScreen((screenfull as any).isFullscreen);
  }, []);

  useEffect(() => {
    window.addEventListener('keypress', keypress_event);
    setPageLoaded(true);
    if ((screenfull as any).isEnabled) {
      (screenfull as any).on('change', callback);
    }
    return () => {
      window.removeEventListener('keypress', keypress_event);
      (screenfull as any).off('change', callback);
    };
  }, [callback, keypress_event]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (playing) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [playing]);

  if (!pageLoaded) {
    return null;
  }

  const { height: videoHeight, width: videoWidth } = getComputedHeightWidth(
    width,
    height,
    dims.width,
    dims.height
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width,
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: '#000'
      }}
    >
      {!dataLoaded && <Typography>Loading Video...</Typography>}
      <div
        style={{
          height: videoHeight,
          width: videoWidth,
          position: 'relative'
        }}
      >
        <video
          onClick={() => {
            setPlaying(!playing);
          }}
          onLoadedData={() => {
            setDataLoaded(true);
          }}
          onContextMenu={e => {
            e.preventDefault();
            return false;
          }}
          ref={ref}
          onDurationChangeCapture={evt => {
            const { videoHeight, videoWidth, duration }: any = evt.target;
            setDims({ height: videoHeight, width: videoWidth, duration });
          }}
          onTimeUpdate={(_evt: any) => {
            setValue(ref.current.currentTime);
          }}
          style={{
            height: videoHeight,
            width: videoWidth,
            position: 'absolute'
          }}
          src={url}
          //   controls
          //   autoPlay
          onEnded={() => {
            onEnded();
          }}
        />
        <div
          style={{
            height: 100,
            position: 'absolute',
            bottom: 0,
            width: videoWidth,
            display: 'flex',
            background: 'transparent',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          {videoHeight > 0 &&
            videoWidth > 0 && [
              <div key="b">
                <IOSSlider
                  ValueLabelComponent={ValueLabelComponent}
                  min={0}
                  max={dims.duration}
                  step={dims.duration / (videoWidth - 40 - 20)}
                  onChangeCommitted={(_event: any, value: any) => {
                    ref.current.currentTime = value;
                    setPlaying(true);
                  }}
                  style={{ zIndex: 5, width: videoWidth - 40 - 20 }}
                  value={value}
                  onChange={(_event: any, newValue: any) => {
                    setPlaying(false);
                    setValue(newValue);
                  }}
                  valueLabelDisplay="off"
                  aria-labelledby="continuous-slider"
                />
              </div>,
              <div
                key="c"
                style={{
                  width: videoWidth,
                  display: 'flex',
                  alignSelf: 'flex-start',
                  justifyContent: 'space-between',
                  paddingLeft: 20,
                  paddingRight: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {!playing ? (
                    <IconButton size="small" onClick={() => setPlaying(true)}>
                      <PlayArrowIcon
                        style={{
                          fontSize: 40,
                          cursor: 'pointer',
                          color: '#fff'
                        }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={() => setPlaying(false)}>
                      <PauseIcon
                        style={{
                          fontSize: 40,
                          cursor: 'pointer',
                          color: '#fff'
                        }}
                      />
                    </IconButton>
                  )}
                  <Typography style={{ color: '#fff', paddingLeft: 16 }}>
                    {getFormattedTimeMS(value)}&nbsp;/&nbsp;
                    {getFormattedTimeMS(dims.duration)}
                  </Typography>
                </div>

                <IconButton
                  size="small"
                  style={{
                    zIndex: 1
                  }}
                  onClick={() => {
                    console.log('clicked');
                    if ((screenfull as any).isEnabled) {
                      (screenfull as any).toggle();
                    }
                  }}
                >
                  {fullscreen ? (
                    <FullScreenExitIcon
                      style={{ color: '#fff', fontSize: 50 }}
                    />
                  ) : (
                    <FullScreenIcon style={{ color: '#fff', fontSize: 40 }} />
                  )}
                </IconButton>
              </div>
            ]}
        </div>
      </div>
    </div>
  );
}
