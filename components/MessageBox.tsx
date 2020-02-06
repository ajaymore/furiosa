import * as React from 'react';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';
import SuccessIcon from '@material-ui/icons/CheckCircleOutlined';

export const warningBg = '#fed9cc';
export const warningIconColor = '#d83b01';
export const infoBg = 'rgba(113, 175, 229, 0.2)';
export const infoIconColor = '#00188F';
export const errorBg = '#fde7e9';
export const errorIconColor = '#a80000';
export const successBg = '#dff6dd';
export const successIconColor = '#107c10';

const MessageBackgroud = ({ background, children }: any) => (
  <div
    style={{
      backgroundColor: background,
      padding: 32,
      paddingTop: 32,
      paddingBottom: 32,
      marginTop: 8,
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center'
    }}
  >
    {children}
  </div>
);

const StyledErrorIcon = () => (
  <ErrorIcon style={{ color: errorIconColor, marginRight: 16 }} />
);

const StyledSuccessIcon = () => (
  <SuccessIcon style={{ color: successIconColor, marginRight: 16 }} />
);

const StyledWarningIcon = () => (
  <WarningIcon style={{ color: warningIconColor, marginRight: 16 }} />
);

const StyledInfoIcon = () => (
  <InfoIcon style={{ color: infoIconColor, marginRight: 16 }} />
);

const MessageBox: React.FC<{
  type: 'Error' | 'Warning' | 'Success' | 'Info';
}> = ({ type, children }) => {
  if (!type) {
    return null;
  }

  return (
    <div>
      {type === 'Error' && (
        <MessageBackgroud background={errorBg}>
          <StyledErrorIcon />
          <div>{children}</div>
        </MessageBackgroud>
      )}
      {type === 'Warning' && (
        <MessageBackgroud background={warningBg}>
          <StyledWarningIcon />
          <div>{children}</div>
        </MessageBackgroud>
      )}
      {type === 'Success' && (
        <MessageBackgroud background={successBg}>
          <StyledSuccessIcon />
          <div>{children}</div>
        </MessageBackgroud>
      )}
      {type === 'Info' && (
        <MessageBackgroud background={infoBg}>
          <StyledInfoIcon />
          <div>{children}</div>
        </MessageBackgroud>
      )}
    </div>
  );
};

export default MessageBox;
