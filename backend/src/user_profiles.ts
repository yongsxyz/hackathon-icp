import { Record, StableBTreeMap, text } from "azle/experimental";

const UserKey = text;

type UserKey = typeof UserKey.tsType;

export const UserProfile = Record({
  address: text,
  name: text,
  avatar_url: text,
  banner_url: text,
  typechain: text,
  link: text,
  bio: text,
  facebook: text,
  twitter: text,
  youtube: text,
  linkedin: text,
  instagram: text,

});

export type UserProfile = typeof UserProfile.tsType;

export let profileStore = StableBTreeMap<UserKey, UserProfile>(0);
