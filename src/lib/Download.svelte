<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { decrypt, downloadBuffer } from "./encrypt.js";
    import { selectedFiles } from "./stores.js";
    import { downloadFleekFile } from "./storage.js";

    export let disabled;


    async function handleDownload() {
        for (const key of $selectedFiles) {
            const downloadResult = await downloadFleekFile(key);

            console.log('download', downloadResult);

            const { decryptedFile, metadata } = await decrypt(downloadResult.data);
            console.log('decrypted', decryptedFile, metadata);

            await downloadBuffer(metadata.name, decryptedFile, metadata.type)
        }
    }
</script>


<button on:click={handleDownload} disabled="{disabled}">Download</button>
