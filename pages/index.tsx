import React, { useContext } from 'react';
import { compose } from 'redux';
import { withDimensions, DimensionsContext } from '../hocs/withDimensions';
import { Typography, Button, Link } from '@material-ui/core';
import MuiLink from '../components/MuiLink';

export function Index() {
  const { width, height } = useContext(DimensionsContext);
  const ButtonLink = React.forwardRef((props: any, ref: any) => (
    <a ref={ref} href="/api/pdf/demo" {...props} />
  ));
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h1">Furiosa</Typography>
      <div style={{ display: 'flex' }}>
        <MuiLink href="/profile">
          <Typography>Profile</Typography>
        </MuiLink>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <MuiLink href="/video">
          <Typography>Video</Typography>
        </MuiLink>
      </div>
      <br />
      <Button variant="contained" color="secondary" component={ButtonLink}>
        Download PDF
      </Button>
    </div>
  );
}

export default compose(withDimensions)(Index, {});
