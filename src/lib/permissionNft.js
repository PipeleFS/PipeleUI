import { ethers } from "ethers";
import { signer } from "./stores.js";
import { SHARE_NFT_ABI } from "./constants.js";

import { get } from 'svelte/store';


export function mintFileToken() {

}

export async function sendAccessPermission(recipientAddress) {
    let contract = new ethers.Contract(recipientAddress, SHARE_NFT_ABI, get(signer));
    const shareTx = contract.share();
    await shareTx.wait();

    console.log('share token mined');
}
