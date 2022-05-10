//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Dis3DAO is ERC721Enumerable {
    struct Proposal {
        string description;
        uint256 deadline;
        uint256 noOfYes;
        uint256 noOfNo;
        bool isExecuted;
        mapping(uint256 => bool) voters;
    }
    string public dname;
    string public description;
    string public imageCID;
    address public owner;
    uint256 public nftPrice = 0.02 ether;
    uint256 public totalProposals;
    mapping(uint256 => Proposal) public proposals;
    uint256 private tokenId;

    modifier onlyOwner() {
        require(msg.sender == owner, "Request Not raised by Owner");
        _;
    }

    modifier hasNFT() {
        require(balanceOf(msg.sender) > 0, "NOT A MEMBER");
        _;
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].isExecuted == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    constructor(
        address daoOwner,
        string memory daoName,
        string memory daoDescription,
        string memory daoImageCID
    ) ERC721(daoName, string(abi.encodePacked(daoName, "NFT"))) {
        owner = daoOwner;
        dname = daoName;
        description = daoDescription;
        imageCID = daoImageCID;
        _safeMint(owner, tokenId);
        tokenId++;
    }

    //NFT handlers
    function buyNFT(uint256 amount) public payable {
        require(msg.value >= nftPrice * amount, "INSUFFICIENT ETHER");
        for (uint256 i = 0; i < amount; i++) {
            _safeMint(msg.sender, tokenId);
            tokenId++;
        }
    }

    function changeNFTPrice(uint256 amount) external onlyOwner {
        nftPrice = amount;
    }

    function createProposal(string memory desc, uint256 deadline)
        public
        hasNFT
    {
        Proposal storage proposal = proposals[totalProposals];
        proposal.description = desc;
        proposal.deadline = block.timestamp + deadline;
        totalProposals++;
    }

    function voteProposal(uint256 id, bool vote)
        public
        hasNFT
        activeProposalOnly(id)
    {
        Proposal storage proposal = proposals[id];

        uint256 balance = balanceOf(msg.sender);
        uint256 totalVotes = 0;

        for (uint256 i = 0; i < balance; i++) {
            uint256 ltokenId = tokenOfOwnerByIndex(msg.sender, i);
            if (proposal.voters[ltokenId] == false) {
                totalVotes++;
                proposal.voters[ltokenId] = true;
            }
        }

        if (vote) {
            proposal.noOfYes += totalVotes;
        } else {
            proposal.noOfNo += totalVotes;
        }
    }

    function executeProposal(uint256 id)
        public
        hasNFT
        inactiveProposalOnly(id)
    {
        Proposal storage proposal = proposals[id];
        if (proposal.noOfYes > proposal.noOfNo) {
            proposal.isExecuted = true;
        }
    }

    function withdrawEther() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
