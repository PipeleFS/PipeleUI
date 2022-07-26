/*
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)\
*/

import LitJsSdk from 'lit-js-sdk';
import { SHARE_NFT_ADDRESS } from "./constants.js";


const chain = 'goerli';

const accessControlConditions = [{
    contractAddress: SHARE_NFT_ADDRESS,
    standardContractType: 'ERC1155',
    chain,
    method: 'balanceOf',
    parameters: [
        ':userAddress',
        '0'
    ],
    returnValueTest: {
        comparator: '>',
        value: '0'
    }
}];

export async function encryptFile(file, tokenId) {
    let encryptedZip, symmetricKey;

    accessControlConditions[0].parameters = [
        ':userAddress',
        tokenId.toString()
    ]

    if (!window.litNodeClient) {
        const litNodeClient = new LitJsSdk.LitNodeClient();
        await litNodeClient.connect();
        window.litNodeClient = litNodeClient;
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    if (file.size > 20_000_000) {
        const result = await LitJsSdk.encryptFile(file);
        encryptedZip = result.encryptedFile;
        symmetricKey = result.symmetricKey;

        // TODO: Store artifacts
    } else {
        const result = await LitJsSdk.encryptFileAndZipWithMetadata({
            // eslint-disable-next-line no-undef
            authSig, accessControlConditions, chain, file, litNodeClient
        });

        encryptedZip = result.zipBlob;
        symmetricKey = result.symmetricKey;
    }

    await window.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain,
    });

    return new File([encryptedZip], file.name, { type: encryptedZip.type });
}

export async function decrypt(file) {
    if (!window.litNodeClient) {
        const litNodeClient = new LitJsSdk.LitNodeClient();
        await litNodeClient.connect();
        window.litNodeClient = litNodeClient;
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    const result = await LitJsSdk.decryptZipFileWithMetadata({
        // eslint-disable-next-line no-undef
        authSig, file, litNodeClient
    });

    console.log('decrypt', result.decryptedFile, result.metadata);

    return result;
}

export async function downloadBuffer(filename, buffer, mimetype) {
    LitJsSdk.downloadFile({
        filename,
        data: new Uint8Array(buffer),
        mimetype
    });
}


document.addEventListener('lit-ready', function (e) {
    console.log('LIT network is ready', e)
    // replace this line with your own code that tells your app the network is ready
}, { once: true });

