import React from 'react';
import { compose } from 'redux';
import { withRegularAuth } from '../hocs/withRegularAuth';
import { withApollo } from '../hocs/withApollo';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { AllUsers, AllUsersVariables } from '../__generated__/AllUsers';
import { UsersCount } from '../__generated__/UsersCount';
import { LoadingOrError } from '../components/LoadingOrError';

const COUNT_QUERY = gql`
  query UsersCount {
    usersCount
  }
`;

const USERS_QUERY = gql`
  query AllUsers($first: Int!) {
    users(first: $first) {
      id
      name
      email
      groups {
        id
        name
      }
      createdAt
    }
  }
`;

function Users() {
  const { loading, error, data } = useQuery<AllUsers, AllUsersVariables>(
    USERS_QUERY,
    {
      variables: {
        first: 50
      }
    }
  );
  const { data: countData } = useQuery<UsersCount>(COUNT_QUERY);

  if (data && data.users && countData && countData.usersCount) {
    return (
      <ul>
        {data.users.map(user => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    );
  }

  return <LoadingOrError {...{ loading, error }} />;
}

export default compose(withRegularAuth, withApollo)(Users);
