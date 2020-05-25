import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import RoutedButton from "../components/routedButton";

const AccessDenied = (props) => {
  const theme = useTheme();
  const location = useLocation();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  
  return (
    <div>
      You must be an approved vet to access this page. Apply to become an approved vet{' '}

      <Link
        to = {{
          pathname: "/apply",
          state: { background : isNotMobile ? location : null}
        }}
      >
        here.
      </Link>
    </div>
    );
};

export default AccessDenied;