/*
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)\
*/

import { writable } from "svelte/store";

export const rootFolder = writable(undefined);
export const signer = writable(null);
export const selectedFiles = writable([]);
export const messenger = writable(null);
