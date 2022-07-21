<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { decrypt, downloadBuffer } from "./encrypt.js";
    import { selectedFiles, selectedShares } from "./stores.js";
    import { downloadFleekFile } from "./storage.js";
    import { SELECTION_TYPES } from "./constants.js";

    export let disabled;
    export let selectionType = SELECTION_TYPES.files;


    async function handleDownload() {
        const selection = selectionType === SELECTION_TYPES.files ? $selectedFiles : $selectedShares;

        for (const key of selection) {
            const downloadResult = await downloadFleekFile(key);

            console.log('download', downloadResult);

            const { decryptedFile, metadata } = await decrypt(downloadResult.data);
            console.log('decrypted', decryptedFile, metadata);

            await downloadBuffer(metadata.name, decryptedFile, metadata.type)
        }
    }
</script>


<button on:click={handleDownload} disabled="{disabled}">Download</button>
