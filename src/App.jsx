import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/index';
import ScrollToTop from './components/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      navy: "#1e3669", 
      navyDark: "#132347",
      gold: "#f2d944",
      goldDark: "#d9c226",
      white: "#ffffff",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : '#f0f4f8',
      }
    })
  },
  components: {
    Button: {
      variants: {
        primary: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.navyDark' : 'brand.navy',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? '#0c1930' : '#182d5a',
          }
        }),
        secondary: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.goldDark' : 'brand.gold',
          color: props.colorMode === 'dark' ? 'white' : 'brand.navy',
          _hover: {
            bg: props.colorMode === 'dark' ? '#c4af22' : '#e9d033',
          }
        }),
      },
    },
  },
});

function App() {
  // Replace with your actual Google Client ID
  const googleClientId = "YOUR_GOOGLE_CLIENT_ID";
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ChakraProvider theme={theme}>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}

export default App;