export interface MockCircle {
    id: number;
    name: string;
    pot: string;
    currentMembers: number;
    maxMembers: number;
    contributions: boolean[];
    creator: string;
    contributionAmount: string;
}

export const mockCircles: MockCircle[] = [
    {
        id: 0,
        name: "Chennai Farmers Circle",
        pot: "0.0700",
        currentMembers: 3,
        maxMembers: 10,
        contributions: [true, true, true, false, false, false, false, false, false, false],
        creator: "0x842b580EdA9e4930b4f09B05cB39f92a5cD9fF26",
        contributionAmount: "0.01",
    },
    {
        id: 1,
        name: "Tech Founders Pool",
        pot: "0.1500",
        currentMembers: 5,
        maxMembers: 10,
        contributions: [true, true, true, true, true, false, false, false, false, false],
        creator: "0x8f1Ff851afa75D98753c8aB4352b37D07797f408",
        contributionAmount: "0.03",
    },
    {
        id: 2,
        name: "Community Savings",
        pot: "0.0200",
        currentMembers: 2,
        maxMembers: 10,
        contributions: [true, true, false, false, false, false, false, false, false, false],
        creator: "0x68409ee9d9D9b7DfdEb4b2dd2bddb7f1312cB947",
        contributionAmount: "0.01",
    }
];
