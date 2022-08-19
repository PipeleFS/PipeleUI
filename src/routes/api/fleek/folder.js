/*
    (c) 2022 Pipele
    This code is licensed under GPLv3 license (see LICENSE for details)
*/

import fleekStorage from "@fleekhq/fleek-storage-js";


const apiSecret = import.meta.env.CLIENT_FLEEK_STORAGE_SECRET;

export async function GET({url}) {
    const apiKey = url.searchParams.get('apiKey');
    const listPrefix = url.searchParams.get('prefix') === 'undefined' ? '' : url.searchParams.get('prefix');
    console.log('prefix', listPrefix, apiKey, apiSecret);

    let result = [];

    if (listPrefix) {
        result = await fleekStorage.listFiles({
            apiKey,
            apiSecret,
            prefix: listPrefix,
            getOptions: [
                'key',
                'hash',
                'publicUrl'
            ],
        });
    }

    return {
        body: result
    }
}

export async function POST({request}) {
    const body = await request.json();

    console.log('folder', body);

    const uploadedFolder = await fleekStorage.upload({
        apiKey: body.apiKey,
        apiSecret,
        key: body.key,
        ContentType: body.mimeType,
        data: body.data,
        httpUploadProgressCallback: (event) => {
            console.log(Math.round(event.loaded / event.total * 100) + '% done');
        }
    });

    console.log('uploaded', uploadedFolder);

    return {
        body: {
            hash: uploadedFolder.hash
        }
    };
}
