import { InjectedConnector } from "wagmi/connectors/injected";
import { createClient, Provider } from "wagmi";
import { Provider as StateProvider } from "react-redux";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import store from "../store/store";
import { MoralisProvider } from "react-moralis";

const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector()],
});

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider
            appId={process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID}
            serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
        >
            <Provider client={client}>
                <StateProvider store={store}>
                    <Navbar />
                    <Component {...pageProps} />
                </StateProvider>
            </Provider>
        </MoralisProvider>
    );
}

export default MyApp;
