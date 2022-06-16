import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { useRef } from "react";
import { useContract, useSigner } from "wagmi";
import { DIS3CORD_ADDRESS } from "../Addresses";
import Dis3cord from "../artifacts/contracts/Dis3cord.sol/Dis3cord.json";

const client = create("https://ipfs.infura.io:5001/api/v0");

export default function CreateDaoPopUp({props}) {
    const formRef = useRef(0);
    const nameRef = useRef(0);
    const descRef = useRef(0);
    const fileRef = useRef(0);
    const priceRef = useRef(0);
    let {daos, setDaos} = props;

    let { data } = useSigner();
    let dis3cord = useContract({
        addressOrName: DIS3CORD_ADDRESS,
        contractInterface: Dis3cord["abi"],
        signerOrProvider: data,
    });

    let handleCreateDAO = (e) => {
        let curr = formRef.current;
        if (curr.style.display === "none" || curr.style.display === "") {
            curr.style.display = "block";
        } else {
            curr.style.display = "none";
        }
    };

    let handleFormSubmit = async (e) => {
        e.preventDefault();
        let fileCID = await client.add(fileRef.current.files[0]);
        let txn = await dis3cord.createDAO(
            nameRef.current.value,
            ethers.utils.parseEther(priceRef.current.value),
            descRef.current.value,
            fileCID.path
        );
        await txn.wait();
        nameRef.current.value = "";
        descRef.current.value = "";
        formRef.current.style.display = "none";
        setDaos([...daos, {
            name: nameRef.current.value,
            addr: txn.toString(),
            url: `https://ipfs.infura.io/ipfs/${fileCID.path}`,
        }])
    };

    return (
        <div className="mb-3">
            <button
                className="text-white bg-black p-3 rounded-full"
                onClick={handleCreateDAO}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </button>

            <div
                ref={formRef}
                className="fixed bg-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-1 border rounded-lg b-3 p-3 hidden drop-shadow-lg"
            >
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            DAO Name
                        </label>
                        <input
                            ref={nameRef}
                            type="text"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required=""
                            placeholder="Name"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="price"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            NFT Price in eth
                        </label>
                        <input
                            ref={priceRef}
                            type="number"
                            step="any"
                            id="price"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required=""
                            placeholder="Price"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="message"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            DAO Description
                        </label>
                        <textarea
                            ref={descRef}
                            id="message"
                            rows="2"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Description..."
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="Image"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Image
                        </label>
                        <input
                            ref={fileRef}
                            type="file"
                            id="Image"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required=""
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
