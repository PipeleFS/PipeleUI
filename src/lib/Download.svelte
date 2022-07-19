<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { decrypt } from "./encrypt.js";
    import { selectedFiles } from "./stores.js";

    export let disabled;


    function handleDownload() {
        $selectedFiles.forEach(file => {
            decrypt(file);
        })
    }
</script>


<button on:click={handleDownload} disabled="{disabled}">Download</button>
