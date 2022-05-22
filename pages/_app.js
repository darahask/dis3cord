import { InjectedConnector } from "wagmi/connectors/injected";
import { createClient, Provider } from "wagmi";
import { Provider as StateProvider } from "react-redux";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import store from "../store/store";

const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector()],
});

function MyApp({ Component, pageProps }) {
    return (
        <Provider client={client}>
            <StateProvider store={store}>
                <Navbar />
                <Component {...pageProps} />
            </StateProvider>
        </Provider>
    );
}

export default MyApp;
