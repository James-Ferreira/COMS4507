import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export function useAlert() {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const show = (message = "Undefined Alert", severity = SEVERITY.INFO) => {
    setAlert({ open: true, message, severity });
  };

  const hide = () => {
    setAlert({ ...alert, open: false });
  };

  const component = (
    <Snackbar open={alert.open} autoHideDuration={5000} onClose={hide}>
      <Alert onClose={hide} severity={alert.severity}>
        {alert.message}
      </Alert>
    </Snackbar>
  );

  return { ...alert, component, show };
}

export const SEVERITY = {
  SUCCESS: "success",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};
