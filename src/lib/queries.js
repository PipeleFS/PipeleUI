import axios from 'axios';


let URL = "https://api.thegraph.com/subgraphs/name/darahask/pipe";

export const getIdofFileQuery = (cid) => `{
    pipeleEntities(
      where: {cid: "${cid}"}
    ) {
      id,
      owner
    }
  }`;

export const getSharedofOwnerQuery = (owner) => `{
    pipeleEntities(where: {owner: "${owner}"}) {
      shared,
      id
      cid,
    }
  }`;

export const getAccessibleFiles = (addr) => `{
    pipeleEntities(where: {shared_contains: ["${addr}"]}) {
      id,
      cid,
      owner
    }
  }`;

export async function getData(func, val) {
    let query = func(val);
    return await axios.post(URL, {query});
}

/* uncomment to test */

// getData(
//   getSharedofOwnerQuery,
//   "0xdd372842cb80c1892243d20ee4ad0979c293cad5"
// ).catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// getData(
//   getIdofFileQuery,
//   "bafybeibhirdk3junquvmanfrfknedqqx5uwkdbmuo24fssxpuviicjpm4u"
// ).catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// getData(
//     getAccessibleFiles,
//     "0xdd372842cb80c1892243d20ee4ad0979c293cad5"
// ).catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });
