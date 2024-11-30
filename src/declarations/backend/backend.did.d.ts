import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getProfilesByLink' : ActorMethod<
    [string],
    {
        'Ok' : Array<
          {
            'bio' : string,
            'linkedin' : string,
            'twitter' : string,
            'banner_url' : string,
            'instagram' : string,
            'avatar_url' : string,
            'link' : string,
            'name' : string,
            'typechain' : string,
            'facebook' : string,
            'address' : string,
            'youtube' : string,
          }
        >
      } |
      { 'Err' : string }
  >,
  'getStatusProvider' : ActorMethod<[], string>,
  'get_my_profile' : ActorMethod<
    [],
    {
        'Ok' : {
          'bio' : string,
          'linkedin' : string,
          'twitter' : string,
          'banner_url' : string,
          'instagram' : string,
          'avatar_url' : string,
          'link' : string,
          'name' : string,
          'typechain' : string,
          'facebook' : string,
          'address' : string,
          'youtube' : string,
        }
      } |
      { 'Err' : string }
  >,
  'list_profiles' : ActorMethod<
    [],
    {
        'Ok' : Array<
          [
            string,
            {
              'bio' : string,
              'linkedin' : string,
              'twitter' : string,
              'banner_url' : string,
              'instagram' : string,
              'avatar_url' : string,
              'link' : string,
              'name' : string,
              'typechain' : string,
              'facebook' : string,
              'address' : string,
              'youtube' : string,
            },
          ]
        >
      } |
      { 'Err' : string }
  >,
  'save_my_profile' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ],
    {
        'Ok' : {
          'bio' : string,
          'linkedin' : string,
          'twitter' : string,
          'banner_url' : string,
          'instagram' : string,
          'avatar_url' : string,
          'link' : string,
          'name' : string,
          'typechain' : string,
          'facebook' : string,
          'address' : string,
          'youtube' : string,
        }
      } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
