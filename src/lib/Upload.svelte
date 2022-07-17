<!--
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { uploadFleekFile } from "./storage.js";
    import {encryptFile } from "./encrypt.js";
    import Progress from './Progress.svelte';

    export let preFileCallback = () => {};
    export let postFileCallback = () => {};
    export let accepts = "";
    export let header = ""
    export let message = '';
    export let buttonLabel = '';
    export let defaultImage = '';
    export let fileName = '';
    export let imageUrl ='';
    export let showButton = false;
    export let helpText = '';
    export let id = '';
    export let encrypt = false;

    export let uploadButton ='', uploadImage = '';

    let renderFileNames = '';
    let dropEnabled = true, isUploading = false, uploaded;
    let uploadElement;

    $: {
        if (!imageUrl) fileName = '';
    }


    function handleDropOver() {
    }

    function handleDrop(event) {
        if (event.dataTransfer.items) {
            dropEnabled = false;
            for (const file of event.dataTransfer.files) {
                uploadFile(file);
            }
        }
        dropEnabled = true;
    }

    function handleFileInput(event) {
        if (event.target.files) {
            dropEnabled = false;
            for (const file of event.target.files) {
                uploadFile(file);
            }
        }
        dropEnabled = true;
    }



    async function uploadFile(file) {
        preFileCallback();
        isUploading = true;

        fileName = file.name;
        uploaded = 0;

        const totalSize = file.size;
        const onStoredChunk = size => {
            uploaded += size;
            const pct = uploaded / totalSize;
            console.log(`Uploading... ${pct.toFixed(2)}% complete`);
        }

        if (encrypt) {
            file = await encryptFile(file);
        }

        const cid = await uploadFleekFile(file, onStoredChunk);
        const url = `https://ipfs.io/ipfs/${cid}`;

        if (!showButton) {
            imageUrl = url;
        }

        uploadElement.value = '';

        isUploading = false;
        postFileCallback(url, file.name, file.type, cid);
    }
</script>


<style>
    h2 {
        margin: 0;
    }

    .dropzone {
        /*height: 4rem;*/
        /*display: flex;*/
        /*flex-direction: column;*/
        /*align-items: center;*/
        /* margin: 2rem; */
    }

    .dropzone.disabled {
        border-color: lightgray;
        color: lightgray;
    }

    .dropzone button {
        position: relative;
        /*border: 0;*/
        /*padding: 0;*/
    }

    label[for=fileinput] {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        display: inline-block;
    }

    input[type=file] {
        display: none;
    }

    /* eslint-disable-next-line css-unused-selector */
    #search {
        margin-block-start: 2rem;
    }

    .button1 {
        width: 169px;
        height: 64px;

        cursor: pointer;
    }

    #desc1 {
        color: var(--secondary-color);
    }

    .button2 {
        width: 288px;
        height: 360px;

        background-color: transparent;
    }

    img {
        width: 288px;
        height: 288px;
        object-fit: cover;
    }

    .buttonLabel {
        font-size: 21px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--accent-color);

        cursor: pointer;
    }

    .buttonLabel.linkLabel {
        color: var(--heading-color);
    }
</style>


<h2>{header}</h2>

<slot name="intro"/>

<slot name="search"/>

<div class:disabled={!dropEnabled} class="dropzone" class:button2={!showButton}
     on:dragover|preventDefault={handleDropOver}
     on:drop|preventDefault={handleDrop}>
    <span>{message}</span>

    <button class:button1={showButton} class:button2={!showButton} disabled={!dropEnabled} {uploadButton} data-testid='{$$props["data-testid"]}'>
        {#if ((imageUrl || defaultImage) && !showButton)}<img src="{imageUrl || defaultImage}" alt="uploaded" {uploadImage} />{/if}
        {#if ((!fileName && !imageUrl) || showButton)}
            <label class="buttonLabel" class:linkLabel={showButton} for={`fileinput-${id}`} >
                {buttonLabel}
            </label>
        {/if}
        <input type="file"
               id={`fileinput-${id}`}
               bind:this={uploadElement}
               accept={accepts}
               disabled={!dropEnabled}
               on:change={handleFileInput} />
    </button>
    <p id="desc1">{fileName || imageUrl ? fileName : helpText}</p>

    {#if (isUploading)}
        <Progress value="{uploaded}" />
    {/if}

    <ul>
        {@html renderFileNames}
    </ul>
    <slot name="alternative"/>
</div>
