import { BigNumber, ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import Dis3DAO from "../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";

export function DaoProposals({ props }) {
    let { address, _ } = props;
    let { data } = useSigner();
    let userData = useAccount().data;
    let dis3dao = useContract({
        addressOrName: address.toString(),
        signerOrProvider: data,
        contractInterface: Dis3DAO.abi,
    });
    let [nftInfo, setNftInfo] = useState({});
    let [proposals, setProposals] = useState([]);
    let nftRef = useRef();
    let descriptionRef = useRef();
    let timeRef = useRef();

    useEffect(() => {
        if (data) {
            load();
        }
    }, [data, address]);

    async function submitProposal() {
        let time = timeRef.current.value.toString().trim();
        let [days, hours, mins] = time.split(":");
        let timeSeconds =
            Number(days) * 86400 + Number(hours) * 3600 + Number(mins) * 60;
        let txn = await dis3dao.createProposal(
            descriptionRef.current.value.toString(),
            timeSeconds
        );
        await txn.wait();
        descriptionRef.current.value = "";
        timeRef.current.value = "";
        load();
    }

    async function load() {
        let info = {
            nftPrice: await dis3dao.nftPrice(),
            balance: await dis3dao.balanceOf(userData.address),
        };
        let proposalsLength = await dis3dao.totalProposals();
        let promproposals = [];
        for (let index = 0; index < proposalsLength; index++) {
            promproposals.push(dis3dao.proposals(index));
        }
        Promise.all(promproposals).then((result) => {
            setNftInfo(info);
            let fmr = result.map((val, i) => {
                return {
                    description: val["description"].toString(),
                    deadline: val["deadline"].toString(),
                    yes: val["noOfYes"].toString(),
                    no: val["noOfNo"].toString(),
                    isExecuted: val["isExecuted"].toString(),
                };
            });
            setProposals(fmr);
        });
    }

    let vote = async (val, ind) => {
        let txn = await dis3dao.voteProposal(ind, val);
        await txn.wait();
        load();
    };

    let execute = async (ind) => {
        let txn = await dis3dao.executeProposal(ind);
        await txn.wait();
        load();
    };

    return (
        <div className="w-80 mx-2">
            <div className="flex flex-col justify-between d-height">
                <div className="mt-2 flex-none border-2 z-2 p-2">
                    <div className="font-medium inline-block">
                        NFT Price:{" "}
                        {nftInfo.nftPrice
                            ? ethers.utils.formatEther(
                                  nftInfo.nftPrice.toString()
                              )
                            : ""}
                    </div>
                    <div className="font-medium ml-2 inline-block">
                        NFT Balance:{" "}
                        {nftInfo.balance ? nftInfo.balance.toString() : ""}
                    </div>
                    <input
                        className="my-2 border rounded-lg p-1 w-full"
                        placeholder="Enter the no of nfts"
                        type="number"
                        ref={nftRef}
                    ></input>
                    <br></br>
                    <button
                        className="p-1 rounded-md text-white bg-black w-full"
                        onClick={async () => {
                            let txn = await dis3dao.buyNFT(
                                nftRef.current.value.toString(),
                                {
                                    value: BigNumber.from(
                                        nftInfo.nftPrice.toString()
                                    ).mul(BigNumber.from(nftRef.current.value)),
                                }
                            );
                            await txn.wait();
                            load();
                        }}
                    >
                        Buy nfts
                    </button>
                </div>
                <div className=" grow my-2 p-2 overflow-y-scroll border-2 z-2">
                    <p className="font-bold border-b mb-1">Proposals</p>
                    {proposals.map((val, i) => (
                        <div key={i} className="mb-2">
                            <p className="font-semibold">{val.description}</p>
                            <p>
                                Deadline:{"  "}
                                {new Date(
                                    Number(val.deadline) * 1000
                                ).toString()}
                            </p>
                            <p>{"Yes Votes: " + val.yes}</p>
                            <p>{"No Votes: " + val.no}</p>
                            <p className="mb-2">
                                {"Executed: " + val.isExecuted}
                            </p>
                            <button
                                style={{ width: "31%" }}
                                className="bg-black text-white rounded-lg p-1 "
                                onClick={() => {
                                    vote(true, i);
                                }}
                            >
                                Yes Vote
                            </button>
                            <button
                                style={{ width: "31%" }}
                                className="bg-black text-white rounded-lg p-1 mx-2"
                                onClick={() => {
                                    vote(false, i);
                                }}
                            >
                                No Vote
                            </button>
                            <button
                                style={{ width: "31%" }}
                                className="bg-black text-white rounded-lg p-1 "
                                onClick={() => {
                                    execute(i);
                                }}
                            >
                                Execute
                            </button>
                        </div>
                    ))}
                </div>
                <div className="border-2 flex-none p-2 mb-2 flex flex-col">
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Description of Proposal
                    </label>
                    <textarea
                        rows="2"
                        id="description"
                        placeholder="Enter description"
                        className="border rounded-md p-2"
                        ref={descriptionRef}
                    ></textarea>
                    <label
                        htmlFor="time"
                        className="block my-2 text-sm font-medium text-gray-900 mb-2"
                    >
                        Proposal Deadline
                    </label>
                    <input
                        type="text"
                        id="time"
                        className="border rounded-md p-2"
                        placeholder="In days:hr:min format"
                        ref={timeRef}
                    ></input>
                    <button
                        className="bg-black text-white rounded-lg p-1 mt-2 w-full"
                        onClick={submitProposal}
                    >
                        Create Proposal
                    </button>
                </div>
            </div>
        </div>
    );
}
