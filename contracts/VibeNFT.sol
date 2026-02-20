// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VibeNFT
 * @notice ERC721 NFT minted when a chat session ends on the Vibe Tracker.
 *         Only the contract owner (backend wallet) can mint.
 */
contract VibeNFT is ERC721URIStorage, Ownable {
    constructor() ERC721("VibeChat", "VIBE") Ownable(msg.sender) {}

    /**
     * @notice Mint a new NFT for a completed chat session.
     * @param to        Recipient address (user-specified target wallet)
     * @param tokenId   Unique token ID (matches chat session ID)
     * @param tokenURI_ Metadata URI (points to Netlify metadata function)
     */
    function mint(address to, uint256 tokenId, string memory tokenURI_) external onlyOwner {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }
}
