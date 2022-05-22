import { useState, useEffect } from "react";
import Dis3cord from "../artifacts/contracts/Dis3cord.sol/Dis3cord.json";
import Dis3DAO from "../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";
import { DIS3CORD_ADDRESS } from "../Addresses";
import { ethers } from "ethers";
import { useSigner, useContract } from "wagmi";

export default function Home() {
    let [daos, setDaos] = useState([]);
    const { data } = useSigner();
    const dis3cord = useContract({
        addressOrName: DIS3CORD_ADDRESS,
        contractInterface: Dis3cord.abi,
        signerOrProvider: data,
    });

    async function load() {
        let listOfDaos = await dis3cord.getAllDAOs();
        let funcs = listOfDaos.map(async (addr, _) => {
            let dis3dao = new ethers.Contract(addr, Dis3DAO.abi, data);
            return {
                name: await dis3dao.dname(),
                address: addr,
                price: await dis3dao.nftPrice(),
                url: `https://ipfs.infura.io/ipfs/${await dis3dao.imageCID()}`,
            };
        });
        Promise.all(funcs).then((vals) => {
            setDaos(vals);
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
        if (data) {
            load();
        }
    }, [data]);

    return (
        <div className="grid grid-cols-4 gap-4 m-4">
            {daos.map((val, i) => {
                return (
                    <div
                        key={i}
                        className="border shadow rounded-xl overflow-hidden"
                    >
                        <div
                            className="image-fill h-48"
                            style={{
                                backgroundImage: `url(${val.url.toString()})`,
                            }}
                        />
                        <div className="p-4">
                            <p
                                className="text-2xl font-semibold"
                            >
                                {val.name.toString()}
                            </p>
                        </div>
                        <div className="p-4 bg-black">
                            <p className="text-2xl font-bold text-white">
                                NFT: {ethers.utils.formatEther(daos[i].price.toString())} ETH
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
    );
}
