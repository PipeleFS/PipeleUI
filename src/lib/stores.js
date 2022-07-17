import { writable } from "svelte/store";


export const rootFolder = writable(undefined);
export const signer = writable(null);
export const selectedFiles = writable([]);
export const messenger = writable(null);
