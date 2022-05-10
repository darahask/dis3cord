//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Dis3DAO.sol";

contract Dis3cord {
    Dis3DAO[] public daos;

    function getAllDAOs() public view returns (Dis3DAO[] memory) {
        return daos;
    }

    function getOwnerDAOs() public view returns (address[] memory) {
        uint256 length;
        for (uint256 index = 0; index < daos.length; index++) {
            if (msg.sender == daos[index].owner()) {
                length++;
            }
        }

        address[] memory udaos = new address[](length);
        uint256 uindex = 0;
        for (uint256 index = 0; index < daos.length; index++) {
            if (msg.sender == daos[index].owner()) {
                udaos[uindex] = (address(daos[index]));
                uindex++;
            }
        }
        return udaos;
    }

    function getUserDAOs() public view returns (address[] memory) {
        uint256 length;
        for (uint256 index = 0; index < daos.length; index++) {
            if (daos[index].balanceOf(msg.sender) != 0) {
                length++;
            }
        }

        address[] memory udaos = new address[](length);
        uint256 uindex = 0;
        for (uint256 index = 0; index < daos.length; index++) {
            if (daos[index].balanceOf(msg.sender) != 0) {
                udaos[uindex] = (address(daos[index]));
                uindex++;
            }
        }
        return udaos;
    }

    function createDAO(
        string memory name,
        string memory description,
        string memory imageCID
    ) public {
        Dis3DAO dao = new Dis3DAO(msg.sender, name, description, imageCID);
        daos.push(dao);
    }
}
