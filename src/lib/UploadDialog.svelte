<!--
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import Upload from "./Upload.svelte";
    import { rootFolder, signer } from "./stores.js";
    import { getTokenId, mintFileToken, sendAccessPermission } from "./permissionNft.js";

    let dialog;


    async function handleUloadStarted() {

    }

    async function handleUploadComplete(url, fileName, fileType, cid) {
        console.log('complete', cid, url);

        // TODO: Update file list

        const fileId = `/${$rootFolder}/${fileName}`;
        await mintFileToken(fileId);

        const tokenId = await getTokenId(fileId);
        console.log('tokenid', tokenId.toNumber())

        // Allow uploader to download the file
        await sendAccessPermission(await $signer.getAddress(), tokenId);
    }

    async function handleUploadDialog() {
        dialog.showModal();
    }
</script>

<style>
    dialog {
        width: 80vw;
        height: 550px;

        padding: 0;
    }

    dialog header {
        display: flex;
        justify-content: space-between;

        height: 63px;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

        padding-inline: 25px;
    }

    #mainAction {
        width: 244px;
        height: 77px;

        color: #fff;
        background: #6C63FF;

        font-size: 36px;

        border: 0;
        border-radius: 15px;
    }

    #mainAction img {
        width: 20px;
    }

    #content {
        height: 450px;
        background: url("/uploadbg.svg") no-repeat center 20px;
    }

    #info {
        margin-top: -215px
    }

    #info p {
        text-align: center;
    }

    #info p:first-child {
        margin: 0;
        font-size: 36px;
    }

    .icon {
        width: 20px;
        cursor: pointer;
    }
</style>


<button id="mainAction" on:click={handleUploadDialog}>
    <img src="/upload-icon.svg" alt="" />
    <span>Upload</span>
</button>

<dialog bind:this={dialog}>
    <header>
        <p>Upload file</p>
        <img class="icon" on:click={() => dialog.close()} src="/close.svg" alt="close dialog" />
    </header>
    <section id="content">
        <Upload showButton="false" encrypt="true"
                postFileCallback="{handleUploadComplete}" rootFolder="{$rootFolder}"/>
        <div id="info">
            <p>Drag & drop to upload</p>
            <p>or click for the open dialog</p>
        </div>
    </section>
</dialog>

