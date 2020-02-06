export function logout() {
  window.localStorage.setItem('logout', '' + Date.now());
  window.location.href = '/auth/logout';
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export const getComputedHeightWidth = (
  windowWidth: number,
  windowHeight: number,
  videoWidth: number,
  videoHeight: number
): { width: number; height: number } => {
  if (
    windowHeight === 0 ||
    windowWidth === 0 ||
    videoHeight === 0 ||
    videoWidth === 0
  ) {
    return {
      width: 0,
      height: 0
    };
  }
  let calcHeight = (windowWidth * videoHeight) / videoWidth;
  if (calcHeight > windowHeight) {
    let newWindowWidth = windowWidth;
    while (calcHeight > windowHeight) {
      newWindowWidth -= 1;
      calcHeight = (newWindowWidth * videoHeight) / videoWidth;
    }
    return {
      width: newWindowWidth,
      height: calcHeight
    };
  }
  return {
    width: windowWidth,
    height: calcHeight
  };
};

export const getFormattedTime = (currentTime: number) => {
  return formatString(
    `${Math.floor(currentTime / 3600)}:${Math.floor(
      (currentTime % 3600) / 60
    )}:${Math.floor((currentTime % 3600) % 60)}`
  );
};

const formatString = (str: string) => {
  let splits = str.split(':');

  for (let i = 0; i < splits.length; i++) {
    splits[i] = splits[i].length === 1 ? `0${splits[i]}` : splits[i];
  }

  return splits.join(':');
};

export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(' ');

  return d;
}

export const getFormattedTimeMS = (currentTime: number) => {
  return formatString(
    `${Math.floor(currentTime / 60)}:${Math.floor((currentTime % 60) % 60)}`
  );
};
