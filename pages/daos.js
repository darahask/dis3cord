import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import DaoChat from "../components/DaoChat";
import DaoList from "../components/DaoList";
import { DaoProposals } from "../components/DaoProposals";

export default function Daos() {
    let [address, setAddress] = useState("");
    let { activeChain } = useNetwork();

    return (
        <div className="flex flex-row d-height">
            <DaoList
                props={{
                    address,
                    setAddress,
                    chain: activeChain ? activeChain.id : null,
                }}
            />
            {address && address != "" ? (
                <>
                    <DaoChat props={{ address }} />
                    <DaoProposals props={{ address, setAddress }} />
                </>
            ) : activeChain && activeChain.id === 5 ? (
                <div className="grow relative">
                    <p className="text-lg absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-red-600 font-medium">
                        Select a DAO
                    </p>
                </div>
            ) : (
                <div className="grow relative">
                    <p className="text-lg absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-red-600 font-medium">
                        Change to goerli network
                    </p>
                </div>
            )}
        </div>
    );
}
