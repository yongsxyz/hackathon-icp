export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getProfilesByLink' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Record({
                'bio' : IDL.Text,
                'linkedin' : IDL.Text,
                'twitter' : IDL.Text,
                'banner_url' : IDL.Text,
                'instagram' : IDL.Text,
                'avatar_url' : IDL.Text,
                'link' : IDL.Text,
                'name' : IDL.Text,
                'typechain' : IDL.Text,
                'facebook' : IDL.Text,
                'address' : IDL.Text,
                'youtube' : IDL.Text,
              })
            ),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getStatusProvider' : IDL.Func([], [IDL.Text], ['query']),
    'get_my_profile' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'bio' : IDL.Text,
              'linkedin' : IDL.Text,
              'twitter' : IDL.Text,
              'banner_url' : IDL.Text,
              'instagram' : IDL.Text,
              'avatar_url' : IDL.Text,
              'link' : IDL.Text,
              'name' : IDL.Text,
              'typechain' : IDL.Text,
              'facebook' : IDL.Text,
              'address' : IDL.Text,
              'youtube' : IDL.Text,
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'list_profiles' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Tuple(
                IDL.Text,
                IDL.Record({
                  'bio' : IDL.Text,
                  'linkedin' : IDL.Text,
                  'twitter' : IDL.Text,
                  'banner_url' : IDL.Text,
                  'instagram' : IDL.Text,
                  'avatar_url' : IDL.Text,
                  'link' : IDL.Text,
                  'name' : IDL.Text,
                  'typechain' : IDL.Text,
                  'facebook' : IDL.Text,
                  'address' : IDL.Text,
                  'youtube' : IDL.Text,
                }),
              )
            ),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'save_my_profile' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'bio' : IDL.Text,
              'linkedin' : IDL.Text,
              'twitter' : IDL.Text,
              'banner_url' : IDL.Text,
              'instagram' : IDL.Text,
              'avatar_url' : IDL.Text,
              'link' : IDL.Text,
              'name' : IDL.Text,
              'typechain' : IDL.Text,
              'facebook' : IDL.Text,
              'address' : IDL.Text,
              'youtube' : IDL.Text,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
