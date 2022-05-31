import { useState, useEffect } from "react";
import { useContract, useSigner } from "wagmi";
import CreateDaoPopUp from "./CreateDaoPopUp";
import { DIS3CORD_ADDRESS } from "../Addresses";
import Dis3cord from "../artifacts/contracts/Dis3cord.sol/Dis3cord.json";
import { useDispatch, useSelector } from "react-redux";
import { refreshUserDaosAsync } from "../store/reducers/userdaoreducer";

function DaoList({props}) {
    const { data } = useSigner();
    let dispatch = useDispatch();
    let daos = useSelector((state) => state.userDaos);
    let { setAddress } = props;

    const dis3cord = useContract({
        addressOrName: DIS3CORD_ADDRESS,
        contractInterface: Dis3cord.abi,
        signerOrProvider: data,
    });

    useEffect(() => {
        if (data) {
            dispatch(refreshUserDaosAsync(data, dis3cord));
        }
    }, [data]);

    return (
        <div className="flex flex-col p-2 border-r-2 overscroll-contain">
            <CreateDaoPopUp />
            {daos.map((val, i) => {
                return (
                    <button
                        title={val.name}
                        className="rounded-full border-2 mb-2 w-12 h-12 truncate"
                        key={i}
                        onClick={(_) => setAddress(val.addr)}
                    >
                        <img src={val.url} alt={val.name} />
                    </button>
                );
            })}
        </div>
    );
}

export default DaoList;
