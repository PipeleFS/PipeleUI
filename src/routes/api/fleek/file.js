/*
    (c) 2022 Pipele
    This code is licensed under GPLv3 license (see LICENSE for details)
*/

import fleekStorage from "@fleekhq/fleek-storage-js";

import { Buffer } from 'node:buffer';


const apiSecret = import.meta.env.CLIENT_FLEEK_STORAGE_SECRET;

export async function GET({url}) {
    const apiKey = url.searchParams.get('apiKey');
    const key = url.searchParams.get('key');
    const fileName = url.searchParams.get('fileName');

    const withData = url.searchParams.get('withData');

    const getOptions = [
        'key',
        'hash',
        'publicUrl'
    ];

    if (withData === 'true') {
        getOptions.append('data');
    }

    const response = await fleekStorage.get({
        apiKey,
        apiSecret,
        key,
        getOptions
    });

    console.log('get', response)

    return {
        body: {
            data: response.data?.toString('hex'),
            publicUrl: response.publicUrl,
            fileName
        }
    }
}

export async function POST({request}) {
    let apiKey, key, contentType, data;

    if(request.headers.get('content-type') === 'application/json') {
        const body = await request.json();

        apiKey = body.apiKey;
        key = body.key;
        contentType = body.ContentType;
        data = body.data;
    } else {
        const formData = await request.formData();
        const file = formData.get("file");

        apiKey = formData.get('apiKey');
        key = formData.get('key');
        contentType = formData.get('type');
        data = Buffer.from(await file.arrayBuffer());
    }

    const uploadedFile = await fleekStorage.upload({
        apiKey: apiKey,
        apiSecret,
        key,
        ContentType: contentType,
        data,
        httpUploadProgressCallback: (event) => {
            console.log(Math.round(event.loaded / event.total * 100) + '% done');
        }
    });

    return {
        body: {
            hash: uploadedFile.hash
        }
    };
}

export async function DELETE({url}) {
    const apiKey = url.searchParams.get('apiKey');
    const key = url.searchParams.get('key');

    await fleekStorage.deleteFile({
        apiKey,
        apiSecret,
        key
    });

    return {
        body: {
            deleted: true
        }
    }
}
