import { InjectedConnector } from "wagmi/connectors/injected";
import { createClient, Provider } from "wagmi";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector()],
});

function MyApp({ Component, pageProps }) {
    return (
        <Provider client={client}>
            <Navbar />
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
