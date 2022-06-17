import Dis3cord from "../artifacts/contracts/Dis3cord.sol/Dis3cord.json";
import Dis3DAO from "../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";
import { useSigner, useContract, useNetwork } from "wagmi";
import { useState, useEffect, useRef } from "react";
import Search from "../components/Search";
import { ethers } from "ethers";

let { NEXT_PUBLIC_DIS3CORD_ADDRESS } = process.env;

export default function Home() {
    let [daos, setDaos] = useState([]);
    let [chain, setChain] = useState("");
    const { data } = useSigner();
    const { activeChain } = useNetwork();
    const dis3cord = useContract({
        addressOrName: NEXT_PUBLIC_DIS3CORD_ADDRESS,
        contractInterface: Dis3cord.abi,
        signerOrProvider: data,
    });
    let totalDaos = useRef([]);

    async function load() {
        let listOfDaos = await dis3cord.getAllDAOs();
        let funcs = listOfDaos.map(async (addr, _) => {
            let dis3dao = new ethers.Contract(addr, Dis3DAO.abi, data);
            return {
                name: await dis3dao.dname(),
                address: addr,
                price: await dis3dao.nftPrice(),
                description: await dis3dao.description(),
                url: `https://ipfs.infura.io/ipfs/${await dis3dao.imageCID()}`,
            };
        });
        Promise.all(funcs).then((vals) => {
            setDaos(vals);
            totalDaos.current = vals;
        });
    }

    async function handleJoin(index) {
        let dis3dao = new ethers.Contract(
            daos[index].address,
            Dis3DAO.abi,
            data
        );
        let txn = await dis3dao.buyNFT("1", { value: daos[index].price });
        await txn.wait();
    }

    useEffect(() => {
        if (data && chain === 5) {
            load();
        }
    }, [data]);

    useEffect(() => {
        setChain(activeChain ? activeChain.id : "");
    }, [activeChain]);

    return (
        <>
            {chain === 5 ? (
                <div>
                    <Search props={{ totalDaos, daos, setDaos }}></Search>
                    <div className="grid grid-cols-4 gap-4 m-4">
                        {daos.map((val, i) => {
                            return (
                                <div
                                    key={i}
                                    className="border shadow rounded-xl overflow-hidden"
                                >
                                    <div
                                        className="h-48 w-full"
                                        style={{
                                            backgroundImage: `url(${val.url.toString()})`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    />
                                    <div className="p-4">
                                        <p className="text-2xl font-semibold">
                                            {val.name.toString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-black">
                                        <p className="text-2xl font-bold text-white">
                                            NFT:{" "}
                                            {ethers.utils.formatEther(
                                                daos[i].price.toString()
                                            )}{" "}
                                            ETH
                                        </p>
                                        <button
                                            className="mt-4 w-full bg-red-500 text-white font-bold py-2 px-12 rounded"
                                            onClick={() => handleJoin(i)}
                                        >
                                            Join
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="d-height relative">
                    <p className="text-lg absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-red-600 font-medium">
                        Change to goerli network
                    </p>
                </div>
            )}
        </>
    );
}
