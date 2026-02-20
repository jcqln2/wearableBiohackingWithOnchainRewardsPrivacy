import { ethers } from "ethers";
import fs from "fs";

// Minimal ABI — only the mint function we need
const VIBE_NFT_ABI = [
    "function mint(address to, uint256 tokenId, string memory tokenURI_) external",
];

// Simple JSON file "database" for token metadata
const DB_PATH = "/tmp/vibenft-metadata.json";

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch {
        return {};
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const handler = async (event) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { chatId, duration, laughs, targetAddress } = JSON.parse(event.body);

        // Validate inputs
        if (!chatId || !targetAddress) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "chatId and targetAddress are required" }),
            };
        }

        if (!ethers.isAddress(targetAddress)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid Ethereum address" }),
            };
        }

        // Setup provider + signer
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            VIBE_NFT_ABI,
            signer
        );

        // Build metadata URI — points to our metadata function
        const siteUrl = process.env.URL || "http://localhost:8888";
        const metadataURI = `${siteUrl}/.netlify/functions/metadata?tokenId=${chatId}`;

        // Store metadata before minting so it's available when queried
        const db = readDB();
        db[String(chatId)] = {
            chatId,
            duration: duration || 0,
            laughs: laughs || 0,
            targetAddress,
            mintedAt: new Date().toISOString(),
        };
        writeDB(db);

        // Mint the NFT
        const tx = await contract.mint(targetAddress, chatId, metadataURI);
        const receipt = await tx.wait();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                txHash: receipt.hash,
                tokenId: chatId,
                etherscanUrl: `https://sepolia.etherscan.io/tx/${receipt.hash}`,
            }),
        };
    } catch (error) {
        console.error("Mint error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Minting failed",
                message: error.message,
            }),
        };
    }
};
