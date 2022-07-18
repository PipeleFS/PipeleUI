/*
    (c) 2022 Pipele
    This code is licensed under GPLv3 license (see LICENSE for details)
*/

import { Web3Storage } from 'web3.storage';
import fleekStorage from '@fleekhq/fleek-storage-js';


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

export async function uploadFleekText(fileName, data, mimeType) {
    const uploadedFile  = await fleekStorage.upload({
        apiKey: import.meta.env.CLIENT_FLEEK_STORAGE_KEY,
        apiSecret: import.meta.env.CLIENT_FLEEK_STORAGE_SECRET,
        key: fileName,
        ContentType: mimeType,
        data: data,
        httpUploadProgressCallback: (event) => {
            console.log(Math.round(event.loaded / event.total * 100) + '% done');
        }
    });

    return uploadedFile.hash;
}

export async function uploadFleekFile(file) {
    const uploadedFile  = await fleekStorage.upload({
        apiKey: import.meta.env.CLIENT_FLEEK_STORAGE_KEY,
        apiSecret: import.meta.env.CLIENT_FLEEK_STORAGE_SECRET,
        key: file.name,
        ContentType: file.type,
        data: file,
        httpUploadProgressCallback: (event) => {
            console.log(Math.round(event.loaded / event.total * 100) + '% done');
        }
    });

    return uploadedFile.hash;
}

/*
    Path without closing slash '/', fileName without slash
 */
export async function createFleekFolder(path, fileName, data, mimeType) {
    const filePath = `${path}/${fileName}`;
    return uploadFleekText(filePath, data, mimeType);
}

export async function listFleekFiles(listPrefix) {
    console.log('prefix', listPrefix);

    if (listPrefix) {
        return await fleekStorage.listFiles({
            apiKey: import.meta.env.CLIENT_FLEEK_STORAGE_KEY,
            apiSecret: import.meta.env.CLIENT_FLEEK_STORAGE_SECRET,
            prefix: listPrefix,
            getOptions: [
                'key',
                //'hash',
                'publicUrl'
            ],
        });
    } else {
        return []
    }
}

export async function deleteFleekFile() {

}
