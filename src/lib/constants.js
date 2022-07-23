/*
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)\
*/

export const USER_TABLE_NAME = 'pip_user';

export const SELECTION_TYPES = {
    files: 'files',
    received: 'received'
}

// export const SHARE_NFT_ADDRESS = '0xBB99FCaafCa56E36cBA706F70258bE6e453Fb028';  // previous contract
export const SHARE_NFT_ADDRESS = '0x219a8393d8a04B59C701895DdcC94e852EBD964B';      // recent contract
export const SHARE_NFT_ABI = [{
    "inputs": [{"internalType": "string", "name": "pipeleUri", "type": "string"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "account", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
    }, {"indexed": false, "internalType": "bool", "name": "approved", "type": "bool"}],
    "name": "ApprovalForAll",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "indexed": false,
        "internalType": "string",
        "name": "fileId",
        "type": "string"
    }],
    "name": "AttachData",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "to", "type": "address"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "ownershipType", "type": "uint256"}],
    "name": "Attest",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "to", "type": "address"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
    }],
    "name": "Revoke",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "operator", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
    }, {"indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]"}],
    "name": "TransferBatch",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "operator", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "TransferSingle",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "string", "name": "value", "type": "string"}, {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }],
    "name": "URI",
    "type": "event"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
    }], "name": "attachMetaData", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address[]", "name": "accounts", "type": "address[]"}, {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
    }],
    "name": "balanceOfBatch",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "string", "name": "fileId", "type": "string"}],
    "name": "getIdofCid",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "idtoinfo",
    "outputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
        "internalType": "address",
        "name": "operator",
        "type": "address"
    }],
    "name": "isApprovedForAll",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }], "name": "revoke", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"internalType": "uint256[]", "name": "ids", "type": "uint256[]"}, {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }, {"internalType": "bytes", "name": "data", "type": "bytes"}],
    "name": "safeBatchTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"internalType": "uint256", "name": "id", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }, {"internalType": "bytes", "name": "data", "type": "bytes"}],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "operator", "type": "address"}, {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
    }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }], "name": "share", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}],
    "name": "supportsInterface",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "tokenIssued",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "uri",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}];
