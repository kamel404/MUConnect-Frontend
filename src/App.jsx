import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AppRoutes />
      </Router>
    </ChakraProvider>
  );
}

export default App;