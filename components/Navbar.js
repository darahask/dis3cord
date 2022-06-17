import Link from "next/link";
import { useEffect, useRef } from "react";
import { useMoralis } from "react-moralis";
import { useAccount, useConnect } from "wagmi";

export default function Navbar() {
    const { isConnected, connect, connectors } = useConnect();
    const { data } = useAccount();
    const { authenticate, isAuthenticated } = useMoralis();
    let oldData = useRef({});

    useEffect(() => {
        if (oldData.current !== data || !isAuthenticated) {
            authenticate({
                signingMessage: "Sign in to Dis3cord chat services",
            })
                .then(function (user) {
                    if (user) oldData.current = data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [data]);

    function truncate(str) {
        let l = str.length - 1;
        return str.substring(0, 5) + "...." + str.substring(l - 3, l);
    }

    return (
        <div className="flex flex-row border-2 border-solid">
            <Link href="/">
                <a className="flex-none font-bold ml-3 mt-1.5 text-2xl">
                    Dis3cord
                </a>
            </Link>
            <div className="grow p-1">
                <div className="flex flex-row justify-end content-center">
                    <Link href="/daos">
                        <a className="mr-3 mt-2">DAOs</a>
                    </Link>
                    <div
                        className="bg-black text-white rounded-lg p-2 cursor-pointer"
                        onClick={() => {
                            if (!isConnected) {
                                connect(connectors[0]);
                            }
                        }}
                    >
                        {isConnected
                            ? truncate(data.address)
                            : "Connect Wallet"}
                    </div>
                </div>
            </div>
        </div>
    );
}
