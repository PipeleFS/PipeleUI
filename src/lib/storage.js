/*
    (c) 2022 Pipele
    This code is licensed under GPLv3 license (see LICENSE for details)
*/

import { get } from 'svelte/store';
import { selectedFiles } from "./stores.js";


const apiKey = import.meta.env.CLIENT_FLEEK_STORAGE_KEY;


export async function uploadFleekText(fileName, data, mimeType) {
    const response = await fetch('/api/fleek/file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiKey,
            key: fileName,
            ContentType: mimeType,
            data,
        })
    });

    return await response.json();
}

export async function uploadFleekFile(prefix, file) {
    const formData = new FormData();
    formData.append('apiKey', apiKey);
    formData.append('key', `/${prefix}/${file.name}`);
    formData.append('file', file);
    formData.append('fileType', file.type);

    const response = await fetch('/api/fleek/file', {
        method: 'POST',
        body: formData
    });

    const hash = await response.json();
    console.log('upload', hash);

    return hash;
}

/*
    Path without closing slash '/', fileName without slash
 */
export async function createFleekFolder(path, fileName, data, mimeType) {
    const filePath = `${path}/${fileName}`;
    const response = await fetch('/api/fleek/folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiKey,
            key: filePath,
            ContentType: mimeType,
            data,
        })
    });

    return uploadFleekText(await response.json(), data, mimeType);
}

export async function listFleekFiles(listPrefix) {
    const response = await fetch(`api/fleek/folder?apiKey=${apiKey}&prefix=${listPrefix}`)
    return await response.json();
}

export async function downloadFleekFile(key) {
    const fileName = key.split('/').at(-1);
    const response = await fetch(`api/fleek/file?apiKey=${apiKey}&key=${key}&fileName=${fileName}`);
    return await response.json();
}

export async function deleteFleekFile() {
    console.log(get(selectedFiles));

    for (const item of get(selectedFiles)) {
        await fetch(`api/fleek/file?apiKey=${apiKey}&key=${item.key}`, {
            method: 'DELETE'
        });
    }

    // TODO: clear item from selectedFiles
    // TODO: delete access NFT of item

    console.log('cleared');
}
