import { InjectedConnector } from "wagmi/connectors/injected";
import { createClient, Provider } from "wagmi";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
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
                <Navbar />
                <Component {...pageProps} />
            </Provider>
        </MoralisProvider>
    );
}

export default MyApp;
