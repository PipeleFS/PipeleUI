/*
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)\
*/

import { ethers } from "ethers";
import { signer } from "./stores.js";
import { SHARE_NFT_ABI, SHARE_NFT_ADDRESS } from "./constants.js";

import { get } from 'svelte/store';


export async function mintFileToken(fileId) {

    console.log('mint', fileId);

    const contract = new ethers.Contract(SHARE_NFT_ADDRESS, SHARE_NFT_ABI, get(signer));
    const shareTx = await contract.mint(fileId);
    await shareTx.wait();
}

export async function getTokenId(fileId) {

    console.log('gettokenid', fileId);

    const contract = new ethers.Contract(SHARE_NFT_ADDRESS, SHARE_NFT_ABI, get(signer));
    return await contract.getIdofFileId(fileId)
}

export async function sendAccessPermission(recipientAddress, tokenId) {
    const contract = new ethers.Contract(SHARE_NFT_ADDRESS, SHARE_NFT_ABI, get(signer));
    const shareTx = await contract.share(recipientAddress, tokenId);
    await shareTx.wait();

    console.log('share token mined');
}
