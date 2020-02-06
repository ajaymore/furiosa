import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import theme from "../lib/theme";
import "../style.css";
import DateFnsUtils from "@date-io/date-fns";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import MessageBox from "../components/MessageBox";

type AlertType = {
  message: string;
  type: "Error" | "Warning" | "Success" | "Info";
} | null;

type alertOptionsType = { showCancel: boolean } | null;
type AppStateType = {
  alert: AlertType;
  notification: string | null;
  notificationCallback: any;
  alertCallback: any;
  alertOptions: alertOptionsType;
};

export const AppContext = React.createContext({
  showAlert: (
    _alert: AlertType,
    _alertCallback?: any,
    _options?: alertOptionsType
  ) => {}
});

export default class MyApp extends App {
  state = {
    alert: null,
    alertCallback: null,
    alertOptions: null,
    notification: null,
    notificationCallback: null
  };

  syncLogout = (event: any) => {
    console.log("localstorage event received", event);
    if (event.key === "logout") {
      window.location.href = "/auth/logout";
    }
  };

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
    window.addEventListener("storage", this.syncLogout);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.syncLogout);
    window.localStorage.removeItem("logout");
  }

  render() {
    const { Component, pageProps } = this.props;
    const { alert, alertCallback, alertOptions } = // notificationCallback,
      // notification
      this.state as AppStateType;

    return (
      <React.Fragment>
        <Head>
          <title>Furiosa</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <AppContext.Provider
              value={{
                showAlert: (alert, alertCallback, options) => {
                  this.setState({
                    alert,
                    alertCallback,
                    alertOptions: options ? options : null
                  });
                }
              }}
            >
              <Dialog
                open={!!alert}
                onClose={() => this.setState({ alertMessage: "" })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  System Message
                </DialogTitle>
                <DialogContent>
                  {alert && (
                    <MessageBox type={alert.type}>{alert.message}</MessageBox>
                  )}
                </DialogContent>
                <DialogActions>
                  {alertOptions && alertOptions.showCancel && (
                    <Button
                      onClick={() => {
                        this.setState({
                          alert: null,
                          alertCallback: null
                        });
                      }}
                      color="default"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (alertCallback) {
                        (alertCallback as any)();
                      }
                      this.setState({
                        alert: null,
                        alertCallback: null
                      });
                    }}
                    color="primary"
                  >
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
              <Component {...pageProps} />
            </AppContext.Provider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
