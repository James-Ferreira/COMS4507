import React from "react";
import {
  makeStyles,
  Button,
  TextField,
  Link,
} from "@material-ui/core";

const Login = (props) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <TextField
        autoFocus
        margin="dense"
        label="Email Address"
        type="email"
        fullWidth
      />
      <TextField margin="dense" label="Password" type="password" fullWidth />
      Don't have an account? <Link href="/register">Sign Up</Link>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 20px',
  },
}));

export default Login;
