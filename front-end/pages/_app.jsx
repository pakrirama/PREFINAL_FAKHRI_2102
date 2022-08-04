import "../styles/globals.css";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

import { Provider } from "react-redux";
import store from "../redux/store";
import AuthProvider from "../components/Authentication/AuthProvider";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  return (
    // <ChakraProvider theme={theme}>
    <Provider store={store}>
      <AuthProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
