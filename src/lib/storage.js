/*
    (c) 2022 Pipele
    This code is licensed under GPLv3 license (see LICENSE for details)
*/

import { Web3Storage } from 'web3.storage';


export async function uploadWeb3Json(name, data) {
    const client = new Web3Storage({token: import.meta.env.CLIENT_WEB3_STORAGE_KEY});

    const blob = new Blob([data], {type: 'application/json'});
    const files = [new File([blob], name)];
    const cid = await client.put(files, { wrapWithDirectory: false});

    console.log('stored files with cid:', cid);
    return cid;
}

export async function uploadWeb3File(file, onStoredChunk) {
    const client = new Web3Storage({token: import.meta.env.CLIENT_WEB3_STORAGE_KEY});
    const cid = await client.put([file], { wrapWithDirectory: false, onStoredChunk});

    console.log('stored files with cid:', file, cid);
    return cid;
}
