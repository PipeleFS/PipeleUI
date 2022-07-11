<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    export let value = undefined;
    export let max = '1';
</script>


<style>
    :root {
        --progress-width: 390px
    }

    progress {
        width: var(--progress-width);
        height: 12px;
    }
</style>


{#if (value)}
    <progress {value} {max}></progress>
{:else}
    <progress></progress>
{/if}
