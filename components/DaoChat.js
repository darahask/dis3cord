import { useEffect, useRef, useState } from "react";
import {
    useMoralis,
    useMoralisQuery,
    useNewMoralisObject,
} from "react-moralis";
import { useAccount, useContract, useSigner } from "wagmi";
import Dis3DAO from "../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";

export default function DaoChat({ props }) {
    let { address } = props;
    let { user, isAuthenticated } = useMoralis();
    const { save } = useNewMoralisObject("DAO_" + address.toString());
    const { fetch } = useMoralisQuery(
        "DAO_" + address.toString(),
        (query) => query,
        [address]
    );
    let [messages, setMessages] = useState([]);
    let messageRef = useRef();
    let chatRef = useRef();
    let titleRef = useRef();
    let descRef = useRef();

    let { data } = useSigner();
    let dis3dao = useContract({
        addressOrName: address.toString(),
        signerOrProvider: data,
        contractInterface: Dis3DAO.abi,
    });

    function truncate(str) {
        let l = str.length - 1;
        return str.substring(0, 5) + "...." + str.substring(l - 3, l);
    }

    useEffect(() => {
        loadMessages();
    }, [address]);

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages]);

    let sendMessage = () => {
        if (isAuthenticated) {
            save(
                {
                    message: messageRef.current.value.toString(),
                    user: user.get("ethAddress").toString(),
                },
                {
                    onSuccess: (msg) => {
                        setMessages([
                            ...messages,
                            {
                                message: msg.get("message"),
                                user: msg.get("user"),
                                id: msg.id,
                            },
                        ]);
                        messageRef.current.value = "";
                    },
                    onError: (err) => {
                        alert("Error:", err.message);
                    },
                }
            );
        }
    };

    let loadMessages = async () => {
        if (isAuthenticated) {
            titleRef.current.innerText =
                (await dis3dao.dname()).toString() + " DAO";
            descRef.current.innerText = (
                await dis3dao.description()
            ).toString();
            let res = await fetch();
            setMessages(
                res.map((msg, _) => ({
                    message: msg.get("message"),
                    user: msg.get("user"),
                    id: msg.id,
                }))
            );
        }
    };

    return (
        <div className="grow ml-3">
            <div className="flex flex-col d-height pt-2">
                <div className="mb-3 pl-2 drop-shadow border rounded-md bg-white">
                    <p ref={titleRef} className="text-xl font-semibold "></p>
                    <p ref={descRef}></p>
                </div>
                <div
                    ref={chatRef}
                    className=" grow overflow-y-scroll drop-shadow bg-white border rounded-md p-2"
                >
                    {messages.map((msg, i) => (
                        <div key={i} className="mb-2 border-b">
                            <p className="font-semibold text-red-600">
                                {truncate(msg.user)}
                            </p>
                            <p className="text-lg">{msg.message}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row w-full my-3 drop-shadow">
                    <input
                        className="border grow rounded-lg p-2"
                        ref={messageRef}
                        type="text"
                        placeholder="Enter message"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                    ></input>
                    <button
                        className="p-2 bg-black text-white rounded-lg ml-3"
                        onClick={sendMessage}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
