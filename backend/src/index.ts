import { Canister, Variant, Vec, Principal, query, text, nat8, ic } from "azle/experimental";
import { SIWE_PROVIDER_CANISTER, SIWS_PROVIDER_CANISTER } from "./provider";

// Definisikan tipe Address
const Address = text;

// Response untuk get_address dari SIWE
const GetAddressResponseSiwe = Variant({
  Ok: Address,
  Err: text,
});

// Response untuk get_address dari SIWS
const GetAddressResponseSiws = Variant({
  Ok: Address,
  Err: text,
});


import { get_my_profile, getProfilesByLink } from "./service/get_my_profile";
import { list_profiles } from "./service/list_profiles";
import { save_my_profile } from "./service/save_my_profile";


async function getStatusProvider() {
  if (!SIWE_PROVIDER_CANISTER || !SIWS_PROVIDER_CANISTER) {
    return "One or more provider canisters are not initialized!";
  }

  return "Both provider canisters are initialized and ready!";
}


export default Canister({
  // Query untuk mengecek status kedua Canister
  getStatusProvider: query([], text, async () => {
    try {
      const status = await getStatusProvider(); // Menunggu hasil dari get_address_siws
      return status; // Mengembalikan hasil status
    } catch (error) {
      return `Error`; // Menangani error jika terjadi
    }
  }),

  // // Query untuk memanggil get_address dari SIWE
  // fetchAddressFromSiwe: query([Vec(nat8)], GetAddressResponseSiwe, async (inputBytes) => {
  //   try {
  //     const response = await SIWE_PROVIDER_CANISTER.get_address(inputBytes);
  //     return response;
  //   } catch (error) {
  //     return { Err: `Error fetching address from SIWE: ${error.message}` };
  //   }
  // }),

  // // Query untuk memanggil get_address dari SIWS
  // fetchAddressFromSiws: query([Vec(nat8)], GetAddressResponseSiws, async (inputBytes) => {
  //   try {
  //     const response = await SIWS_PROVIDER_CANISTER.get_address(inputBytes);
  //     return response;
  //   } catch (error) {
  //     return { Err: `Error fetching address from SIWS: ${error.message}` };
  //   }
  // }),

  get_my_profile,
  getProfilesByLink,
  save_my_profile,
  list_profiles,
});