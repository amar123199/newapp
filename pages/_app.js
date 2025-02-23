import { Provider } from "../components/ui/provider"
import "@chakra-ui/react/dist/chakra.css";
export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}
