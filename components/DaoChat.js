import { useEffect, useRef, useState } from "react";
import {
    useMoralis,
    useMoralisQuery,
    useNewMoralisObject,
} from "react-moralis";

export default function DaoChat({ props }) {
    let { address } = props;
    const { user, isAuthenticated } = useMoralis();
    const { save } = useNewMoralisObject("DAO_" + address.toString());
    const { fetch } = useMoralisQuery(
        "DAO_" + address.toString(),
        (query) => query,
        [address]
    );
    let [messages, setMessages] = useState([]);
    let messageRef = useRef();

    function truncate(str) {
        let l = str.length - 1;
        return str.substring(0, 5) + "...." + str.substring(l - 3, l);
    }

    useEffect(() => {
        load();
    }, [address]);

    let load = async () => {
        if (isAuthenticated) {
            loadMessages();
        }
    };

    let sendMessage = () => {
        if (isAuthenticated)
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
    };

    let loadMessages = async () => {
        if (isAuthenticated) {
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
                <div></div>
                <div className=" grow overflow-y-scroll ">
                    {messages.map((msg, i) => (
                        <div key={i} className="mb-2 ">
                            <p className="font-semibold">
                                {truncate(msg.user)}
                            </p>
                            <p className="text-lg">{msg.message}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row w-full my-3">
                    <input
                        className="border grow rounded-lg p-2"
                        ref={messageRef}
                        type="text"
                        placeholder="Enter message"
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
