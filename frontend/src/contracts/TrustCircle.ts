// TrustCircle Smart Contract ABI (Simplified to match live contracts)
export const TRUSTCIRCLE_ABI = [
    {
        "type": "function",
        "name": "nextCircleId",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "circles",
        "inputs": [
            { "name": "circleId", "type": "uint256" },
            { "name": "index", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "pots",
        "inputs": [{ "name": "circleId", "type": "uint256" }],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "currentMember",
        "inputs": [{ "name": "circleId", "type": "uint256" }],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "createCircle",
        "inputs": [{ "name": "members", "type": "address[10]" }],
        "outputs": [{ "name": "circleId", "type": "uint256" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "contribute",
        "inputs": [{ "name": "circleId", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "claim",
        "inputs": [{ "name": "circleId", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "view"
    }
] as const;
