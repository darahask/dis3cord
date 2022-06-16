import { InjectedConnector } from "wagmi/connectors/injected";
import { createClient, Provider } from "wagmi";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";

const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector()],
});

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Dis3cord</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <MoralisProvider
            appId={process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID}
            serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
        >
            <Provider client={client}>
                <Navbar />
                <Component {...pageProps} />
            </Provider>
        </MoralisProvider>
        </div>
    );
}

export default MyApp;
