import * as React from 'react';
import { CircularProgress } from '@material-ui/core';

export const LoadingOrError = ({
  loading,
  error
}: {
  loading: boolean;
  error: any;
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <CircularProgress size={20} />
      </div>
    );
  }
  if (error) {
    return <div>{`${error.message} 😦`}</div>;
  }
  return null;
};
