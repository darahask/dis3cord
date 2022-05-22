// import { InjectedConnector } from "@wagmi/core";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";


export default function Navbar() {
    const { isConnected } = useConnect();
    const { data } = useAccount();

    function truncate(str) {
        let l = str.length - 1;
        return str.substring(0,5) + "...." + str.substring(l-3, l)
    }

    return (
        <div className="flex flex-row border-2 border-solid">
            <Link href="/">
                <a className="flex-none font-bold ml-4 mt-1.5 text-2xl">
                    Dis3cord
                </a>
            </Link>
            <div className="grow p-1">
                <div className="flex flex-row justify-end content-center">
                    <Link href="/daos">
                        <a className="mr-3 mt-2">DAOs</a>
                    </Link>
                    <div className="bg-black text-white rounded-lg p-2">
                        {isConnected? truncate(data.address) : "Connect Wallet"}
                    </div>
                </div>
            </div>
        </div>
    );
}
