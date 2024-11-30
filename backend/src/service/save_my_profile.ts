import { UserProfile, profileStore } from "../user_profiles";
import { Variant, ic, text, update } from "azle/experimental";

import { resolveAddress } from "./auth";

const SaveMyProfileResponse = Variant({
    Ok: UserProfile,
    Err: text,
});

export type SaveMyProfileResponse = typeof SaveMyProfileResponse.tsType;


export const save_my_profile = update(
    [text, text, text, text, text, text, text, text, text, text, text],
    SaveMyProfileResponse,
    async (name, avatar_url, banner_url, typechain, link, bio, facebook, twitter, youtube, linkedin, instagram): Promise<SaveMyProfileResponse> => {
        try {
            // Validasi awal parameter
            if (!name || !avatar_url || !typechain) {
                return { Err: "Missing required parameters: name, avatar_url, typechain, or link." };
            }

            const filteredLink = link.replace(/[^a-z0-9]/g, "").toLowerCase();

            if (filteredLink !== link) {
                return { Err: "The link contains invalid characters. Only lowercase letters and numbers are allowed." };
            }

            let address: string | null = await resolveAddress(typechain);


            const existingProfileWithName = profileStore.values().find(
                (profile) => profile.link === link
            );


            const existingProfileWithNameOrAddress  = profileStore.values().find(
                (profile) => profile.address === address
            );

            if (existingProfileWithNameOrAddress) {
                let address: string | null = await resolveAddress(typechain);
                const profile: UserProfile = {
                    address: address!.toString(),
                    name,
                    avatar_url,
                    banner_url,
                    typechain,
                    link,
                    bio,
                    facebook,
                    twitter,
                    youtube,
                    linkedin,
                    instagram
                };
                profileStore.insert(ic.caller().toString(), profile);
                return { Ok: profile };
            }


            if (existingProfileWithName) {
                return { Err: `The name "${link}" is already in use. Please choose another name.` };
            }


            const profile: UserProfile = {
                address: address!.toString(),
                name,
                avatar_url,
                banner_url,
                typechain,
                link,
                bio,
                facebook,
                twitter,
                youtube,
                linkedin,
                instagram
            };

            profileStore.insert(ic.caller().toString(), profile);

            return { Ok: profile };
        } catch (error) {
            console.error("Error in save_my_profile:", error);
            if (error instanceof Error) return { Err: error.message };
            return { Err: "An unknown error occurred while saving profile." };
        }
    }
);
