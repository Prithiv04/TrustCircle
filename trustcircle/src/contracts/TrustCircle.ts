// TrustCircle Smart Contract ABI
// Extracted from Remix deployment

export const TRUSTCIRCLE_ABI = [
    // Events
    {
        "type": "event",
        "name": "CircleCreated",
        "inputs": [
            { "name": "circleId", "type": "uint256", "indexed": true },
            { "name": "creator", "type": "address", "indexed": true },
            { "name": "name", "type": "string", "indexed": false },
            { "name": "contributionAmount", "type": "uint256", "indexed": false },
            { "name": "memberCount", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "MemberJoined",
        "inputs": [
            { "name": "circleId", "type": "uint256", "indexed": true },
            { "name": "member", "type": "address", "indexed": true }
        ]
    },
    {
        "type": "event",
        "name": "ContributionMade",
        "inputs": [
            { "name": "circleId", "type": "uint256", "indexed": true },
            { "name": "member", "type": "address", "indexed": true },
            { "name": "amount", "type": "uint256", "indexed": false },
            { "name": "round", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "PayoutDistributed",
        "inputs": [
            { "name": "circleId", "type": "uint256", "indexed": true },
            { "name": "recipient", "type": "address", "indexed": true },
            { "name": "amount", "type": "uint256", "indexed": false },
            { "name": "round", "type": "uint256", "indexed": false }
        ]
    },
    // Functions
    {
        "type": "function",
        "name": "createCircle",
        "inputs": [
            { "name": "_name", "type": "string" },
            { "name": "_contributionAmount", "type": "uint256" },
            { "name": "_maxMembers", "type": "uint256" },
            { "name": "_roundDuration", "type": "uint256" }
        ],
        "outputs": [{ "name": "circleId", "type": "uint256" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "joinCircle",
        "inputs": [{ "name": "_circleId", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "contribute",
        "inputs": [{ "name": "_circleId", "type": "uint256" }],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "getCircle",
        "inputs": [{ "name": "_circleId", "type": "uint256" }],
        "outputs": [
            { "name": "name", "type": "string" },
            { "name": "creator", "type": "address" },
            { "name": "contributionAmount", "type": "uint256" },
            { "name": "maxMembers", "type": "uint256" },
            { "name": "currentMembers", "type": "uint256" },
            { "name": "currentRound", "type": "uint256" },
            { "name": "totalRounds", "type": "uint256" },
            { "name": "nextPayoutTime", "type": "uint256" },
            { "name": "isActive", "type": "bool" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getCircleCount",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getMembers",
        "inputs": [{ "name": "_circleId", "type": "uint256" }],
        "outputs": [{ "name": "", "type": "address[]" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "hasContributed",
        "inputs": [
            { "name": "_circleId", "type": "uint256" },
            { "name": "_member", "type": "address" },
            { "name": "_round", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "view"
    }
] as const;
