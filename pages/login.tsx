import React, { useRef } from "react";
import {
  Grid,
  TextField,
  Button
  //   FormHelperText,
  //   Hidden
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Box from '@material-ui/core/Box';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
// import MuiLink from '../components/MuiLink';
import Link from "next/link";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Login({ error }: { error: any }) {
  const classes = useStyles({});
  const ref: any = useRef(null);

  return (
    <div>
      <Container
        style={{ backgroundColor: "#fff" }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={() =>
            Yup.object({
              email: Yup.string()
                .email()
                .required("Email is required"),
              password: Yup.string().required("Password is required")
            })
          }
          onSubmit={() => {
            if (ref.current) {
              ref.current.submit();
            }
          }}
        >
          {props => {
            return (
              <div className={classes.paper}>
                <Link href="/login">
                  <a>
                    <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                    </Avatar>
                  </a>
                </Link>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form
                  onSubmit={props.handleSubmit}
                  ref={ref}
                  className={classes.form}
                  noValidate
                  action="/auth/login"
                  method="post"
                >
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="email"
                    label="Email Address"
                    placeholder="email"
                    fullWidth
                    name="email"
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={!!props.errors.email}
                    helperText={props.touched.email && props.errors.email}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    label="Password"
                    id="password"
                    placeholder="password"
                    name="password"
                    type="password"
                    fullWidth
                    value={props.values.password}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={!!props.errors.password}
                    helperText={props.touched.password && props.errors.password}
                  />
                  {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
                  {error && error[0] && (
                    <Typography variant="caption" color="error">
                      {error[0]}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      {/* <MuiLink href="/forgot-password" variant="body2">
                        Forgot password?
                      </MuiLink> */}
                    </Grid>
                    <Grid item>
                      {/* <MuiLink href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </MuiLink> */}
                    </Grid>
                  </Grid>
                </form>
              </div>
            );
          }}
        </Formik>
      </Container>
    </div>
  );
}

Login.getInitialProps = ({ req }: any) => {
  if (req) {
    return {
      error: req.flash().error
    };
  }
  return {
    error: null
  };
};
