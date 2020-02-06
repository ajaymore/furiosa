import { createMuiTheme } from "@material-ui/core/styles";
import { red, indigo } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[500]
    },
    secondary: {
      main: red[500]
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#fff"
    }
  }
});

export default theme;
