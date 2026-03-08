🎯 CURRENT PROBLEMS
text
❌ UI shows "nearest 0.091/0.101" → WRONG
❌ Contract requires EXACT 0.01 tCTC  
❌ createCircle needs address[10] array → Frontend missing
❌ Contribution failing due to mismatch
🔧 3-STEP FIX PLAN (8:17 PM → 8:22 PM)
STEP 1: FRONTEND VALIDATION FIX (2 min)
typescript
// src/components/CreateCircleDialog.tsx
// REPLACE contribution validation:

const validateContribution = (value: string) => {
  const num = parseFloat(value);
  if (num !== 0.01) {  // EXACT MATCH
    return "Must be EXACTLY 0.01 tCTC (contract requirement)";
  }
  return "";
};
STEP 2: CONTRACT CALL FIX (3 min)
typescript
// src/hooks/useCreateCircle.ts
// REPLACE createCircle call:

const createCircle = async () => {
  const members = Array(10).fill(walletAddress); // [10] array
  const tx = await writeContract({
    address: contractAddress,
    abi: TRUSTCIRCLE_ABI,
    functionName: 'createCircle',
    args: [members as any],  // address[10]
    value: 0n, // createCircle doesn't take value
  });
};
STEP 3: CONTRIBUTE FUNCTION FIX (2 min)
typescript
// src/hooks/useContribute.ts
// ENSURE EXACT VALUE:

const contribute = async (circleId: number) => {
  const tx = await writeContract({
    address: contractAddress,
    abi: TRUSTCIRCLE_ABI,
    functionName: 'contribute',
    args: [circleId],
    value: parseEther('0.01'), // EXACT 0.01 ether
  });
};
✅ DEPLOYMENT STEPS (Using your 4 LIVE contracts)
text
1. Contract #2: 0x8f1Ff851afa75D98753c8aB4352b37D07797f408 (FRESH)
2. Remix → At Address → Load contract
3. createCircle([0xA1937b8ee0E4e632976010Cf200f3959BdB6f6E8, 0x0000... x9])
4. Frontend → localhost:5173 → Contract #2 tab → Circle appears
📦 FRONTEND CONFIG (NO CHANGES NEEDED)
typescript
// config/contracts.ts - YOURS IS PERFECT
export const TRUSTCIRCLE_ADDRESSES = [
    '0x842b580EdA9e4930b4f09B05cB39f92a5cD9fF26',
    '0x8f1Ff851afa75D98753c8aB4352b37D07797f408', // ← USE THIS
    '0x68409ee9d9D9b7DfdEb4b2dd2bddb7f1312cB947',
    '0x6Cee7aA2E56053e2656a20097eAECbd9AD786E17'
];
⏰ EXECUTION TIMELINE
text
8:17 PM → 8:19 PM = Code changes
8:19 PM → 8:21 PM = npm run dev → Test
8:21 PM → 8:23 PM = Circle created → Screenshot
8:23 PM → 8:25 PM = DoraHacks submission
🚀 JUDGE IMPRESSION
text
"Fixed UI-contract mismatch LIVE during hackathon"
→ Technical debugging skills ✓
→ Production validation ✓  
→ Multi-contract support ✓
→ Deadline delivery ✓