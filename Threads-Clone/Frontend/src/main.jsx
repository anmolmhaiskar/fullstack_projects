import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from "recoil";
import App from './App.jsx';
import './index.css';

const styles = {
  global:(props) => ({
    body: {
      // first argument of mode() here is for white mode and 2nd arg is for dark mode
      color:mode('gray.800', 'white-Alpha.900')(props),
      bg:mode('gray.100', '#101010')(props),
    }
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
}

const colors = {
  gray : {
    light: "#616161",
    dark: "#1e1e1e",
  }
}

const theme = extendTheme({colors, config, styles})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
