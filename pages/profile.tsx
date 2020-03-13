import React from 'react';
import { compose } from 'redux';
import { withRegularAuth } from '../hocs/withRegularAuth';
import { withApollo } from '../hocs/withApollo';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { LoadingOrError } from '../components/LoadingOrError';
import { Me } from '../__generated__/Me';
import { Typography, Button } from '@material-ui/core';
import { logout } from '../lib/utils';

const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      ...UserInfo
    }
  }
  ${USER_FRAGMENT}
`;

function Profile() {
  const { loading, error, data } = useQuery<Me>(ME_QUERY);

  if (data && data.me) {
    return (
      <div style={{ padding: 16 }}>
        <Typography variant="h2">Hello, {`${data.me.name}`}</Typography>
        <Typography>Email: {`${data.me.email}`}</Typography>
        <br />
        <Button color="primary" variant="outlined" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return <LoadingOrError {...{ loading, error }} />;
}

export default compose(withRegularAuth, withApollo)(Profile);
