export const ZK_VERIFIED_ESCROW_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_prover", type: "address", internalType: "address" },
      { name: "_usdcToken", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "username", type: "string", internalType: "string" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "escrow",
    inputs: [{ name: "", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "list",
    inputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "username", type: "string", internalType: "string" },
      { name: "account", type: "address", internalType: "address" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "listUsernames",
    inputs: [],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "listings",
    inputs: [{ name: "", type: "string", internalType: "string" }],
    outputs: [
      { name: "username", type: "string", internalType: "string" },
      { name: "price", type: "uint256", internalType: "uint256" },
      { name: "seller", type: "address", internalType: "address" },
      {
        name: "status",
        type: "uint8",
        internalType: "enum ZkVerifiedEscrow.ListingStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "prover",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "shiftOffset",
    inputs: [
      { name: "data", type: "bytes", internalType: "bytes" },
      { name: "shiftBy", type: "uint256", internalType: "uint256" },
      {
        name: "offsetPosition",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "usdcToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifier",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IProofVerifier",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "username", type: "string", internalType: "string" },
      { name: "account", type: "address", internalType: "address" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Deposited",
    inputs: [
      {
        name: "username",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "buyer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Listed",
    inputs: [
      {
        name: "username",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "seller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      {
        name: "username",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "seller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "InvalidChainId", inputs: [] },
] as const;
