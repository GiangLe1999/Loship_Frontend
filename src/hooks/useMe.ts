import { gql, useQuery } from "@apollo/client";
import { MyProfileQuery } from "../__generated__/graphql";

export const ME_QUERY = gql`
  query myProfile {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<MyProfileQuery>(ME_QUERY);
};
