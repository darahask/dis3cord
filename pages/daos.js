import { useState } from "react";
import DaoList from "../components/DaoList";
import { DaoProposals } from "../components/DaoProposals";

export default function Daos() {
    let [address, setAddress] = useState("");

    return (
        <div className="flex flex-row d-height">
            <DaoList props={{ address, setAddress }} />
            {address && address != "" ? (
                <DaoProposals props={{ address, setAddress }} />
            ) : (
                <></>
            )}
        </div>
    );
}
