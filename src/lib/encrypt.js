import LitJsSdk from 'lit-js-sdk';


const accessControlConditions = [{
        contractAddress: '',
        standardContractType: '',
        chain: 'goerli',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
            comparator: '>=',
            value: '1000000000000',  // 0.000001 ETH
        },
}]

export async function encryptFile(file) {
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    window.litNodeClient = client;

    const chain = 'goerli';
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    // < 20MB  -- encryptFile()
    // < 20MB  -- zipAndEncryptFiles()
    // const { encryptedString, symmetricKey } = await LitJsSdk.encryptString("this is a secret message");
    // const { encryptedString, symmetricKey } = await LitJsSdk.encryptFile({file});
    const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptFiles([file]);

    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain,
    });

    return new File([encryptedZip], file.name, { type: encryptedZip.type });
}


document.addEventListener('lit-ready', function (e) {
    console.log('LIT network is ready', e)
    // replace this line with your own code that tells your app the network is ready
}, { once: true });

