import fs from "fs";

const DB_PATH = "/tmp/vibenft-metadata.json";

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch {
        return {};
    }
}

export const handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    };

    const tokenId = event.queryStringParameters?.tokenId;

    if (!tokenId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "tokenId query parameter is required" }),
        };
    }

    const db = readDB();
    const meta = db[String(tokenId)];

    if (!meta) {
        // Return minimal metadata even if we don't have stored data
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                name: `Vibe Chat #${tokenId}`,
                description: "A social interaction captured by Vibe Tracker.",
                image: "",
                attributes: [],
            }),
        };
    }

    // Format duration for display
    const totalSec = Math.floor((meta.duration || 0) / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const durationStr = `${mins}:${String(secs).padStart(2, "0")}`;

    const imageUrl = "https://tan-selective-tiger-256.mypinata.cloud/ipfs/bafybeihbvrxhocnir23iyjhifof7jx57qhwxj4mfgrvj4qxgexbpppxhcy";

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            name: `Vibe Chat #${tokenId}`,
            description: `A ${durationStr} conversation with ${meta.laughs || 0} laugh${meta.laughs !== 1 ? "s" : ""}, captured by Vibe Tracker.`,
            image: imageUrl,
            attributes: [
                { trait_type: "Duration", value: durationStr },
                { trait_type: "Duration (seconds)", value: totalSec },
                { trait_type: "Laughs", value: meta.laughs || 0 },
                { trait_type: "Minted At", value: meta.mintedAt || "" },
            ],
        }),
    };
};
