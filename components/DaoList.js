import { useState, useEffect } from "react";
import { useContract, useSigner } from "wagmi";
import CreateDaoPopUp from "./CreateDaoPopUp";
import { DIS3CORD_ADDRESS } from "../Addresses";
import Dis3cord from "../artifacts/contracts/Dis3cord.sol/Dis3cord.json";
import Dis3DAO from "../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";
import { ethers } from "ethers";

export default function DaoList() {
    const { data } = useSigner();
    let [daos, setDaos] = useState([]);

    const dis3cord = useContract({
        addressOrName: DIS3CORD_ADDRESS,
        contractInterface: Dis3cord.abi,
        signerOrProvider: data,
    });

    async function load() {
        let listOfDaos = await dis3cord.getUserDAOs();
        let funcs = listOfDaos.map(async (addr, _) => {
            let dis3dao = new ethers.Contract(addr, Dis3DAO.abi, data);
            return {
                name: await dis3dao.dname(),
                url: `https://ipfs.infura.io/ipfs/${await dis3dao.imageCID()}`,
            };
        });
        Promise.all(funcs).then((vals) => {
            setDaos(vals);
        });
    }

    useEffect(() => {
        if (data) {
            load();
        }
    }, [data]);

    return (
        <div className="flex flex-col p-2 border-r-2 overscroll-contain">
            <CreateDaoPopUp />
            {daos.map((val, i) => {
                return (
                    <button title={val.name} className="rounded-full border-2 mb-2 w-12 h-12 truncate" key={i}>
                        <img
                            src={val.url}
                            alt={val.name}
                        />
                    </button>
                );
            })}
        </div>
    );
}
