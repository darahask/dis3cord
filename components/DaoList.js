import { useState, useEffect } from "react";
import { useContract, useNetwork, useSigner } from "wagmi";
import Dis3cord from "../artifacts/contracts/Dis3cord.sol/Dis3cord.json";
import Dis3DAO from "../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";
import { ethers } from "ethers";
import CreateDaoPopUp from "./CreateDaoPopUp";

let { NEXT_PUBLIC_DIS3CORD_ADDRESS } = process.env;

function DaoList({ props }) {
    const { data } = useSigner();
    let [daos, setDaos] = useState([]);
    let { setAddress, chain } = props;

    let dis3cord = useContract({
        addressOrName: NEXT_PUBLIC_DIS3CORD_ADDRESS,
        contractInterface: Dis3cord.abi,
        signerOrProvider: data,
    });

    async function load() {
        console.log("Loading...")
        let listOfDaos = await dis3cord.getUserDAOs();
        let funcs = listOfDaos.map(async (addr, _) => {
            let dis3dao = new ethers.Contract(addr, Dis3DAO.abi, data);
            return {
                name: await dis3dao.dname(),
                addr: addr,
                url: `https://ipfs.infura.io/ipfs/${await dis3dao.imageCID()}`,
            };
        });
        Promise.all(funcs).then((vals) => {
            setDaos(vals);
        });
    }

    useEffect(() => {
        if (data && chain === 5) {
            load();
        }
    }, [data]);

    return (
        <div className="flex flex-col p-2 border-r-2 overscroll-contain">
            <CreateDaoPopUp props={{ load }} />
            {daos.map((val, i) => {
                return (
                    <button
                        title={val.name}
                        className="rounded-full border-2 mb-2 w-12 h-12 truncate"
                        key={i}
                        onClick={(_) => setAddress(val.addr)}
                    >
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage: `url(${val.url.toString()})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export default DaoList;
