import { createSlice } from "@reduxjs/toolkit";
import Dis3DAO from "../../artifacts/contracts/Dis3DAO.sol/Dis3DAO.json";
import { ethers } from "ethers";


const {actions, reducer} = createSlice({
    name: 'useDaos',
    initialState: [],
    reducers: {
        addUserDaos: (state, action) => {
            return [...state, ...action.payload];
        },
        refreshUserDaos: (_, action) => {
            return action.payload;
        }
    }
})

let refreshUserDaosAsync = (data, dis3cord) => {
    return async (dispatch) => {
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
            dispatch(actions.refreshUserDaos(vals));
        });
    }
}

export default reducer;
export const {addUserDaos, refreshUserDaos} = actions;
export {refreshUserDaosAsync};