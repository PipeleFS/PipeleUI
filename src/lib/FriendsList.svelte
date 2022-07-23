<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { getData, getFriends } from "./queries.js";
    import { onMount } from "svelte";
    import { signer } from "./stores.js";


    let signerAddress;


    $: listItems = getData(getFriends, signerAddress);


    onMount(async () => {
        signerAddress = await $signer.getAddress();
    });

    function handleCardClick() {

    }
</script>

<style>
    #friendsList {
        display: flex;
        flex-wrap: wrap;
        gap: 40px;

        margin-inline-start: 60px;
    }

    #friendsList li {
        width: 100%;

        margin-inline-end: 20px;

        background: #F0F0F3;

        border: 1px solid #464646;
        border-radius: 40px;
    }

    #actions {
        display: flex;
        gap: 30px;
        align-items: center;

        margin-inline-start: 35px;
        margin-block: 35px;
    }

    #title {
        font-size: 36px;
    }

    #loadState {
        margin: 35px;
    }

    .card {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 30px;

        height: 50px;

        margin-block-end: 10px;
        padding: 10px;

        border: 1px solid #ddd;
        border-radius: 10px;
    }

    .card .star {
        width: 40px;
    }

    .card .address {
        flex-grow: 1;

        font-size: 36px;

        word-break: keep-all;
        pointer-events: none;
    }

</style>

<div>
    <div id="actions">
        <h2 id="title">Friends List</h2>
    </div>

    {#await listItems}
        <span id="loadState">loading...</span>
    {:then list}
        <ul id="friendsList">
            {#each list.data.data.pipeleShares as item, index}
                <li>
                    <div class="card" on:click={() => handleCardClick(`#item-${index}`)}>
                        <img class="star" src="/star.svg" alt="star icon" />
                        <p class="address">{item.to}</p>
                    </div>
                </li>
            {:else}
                <p>No items yet</p>
            {/each}
        </ul>
    {/await}
</div>

