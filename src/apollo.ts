import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
} from "@apollo/client";
import { LOCAL_STRORAGE_TOKEN } from "./constants";
import { setContext } from "@apollo/client/link/context";

const initialToken = localStorage.getItem(LOCAL_STRORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(initialToken));
export const authTokenVar = makeVar(initialToken);

const httpLink = createHttpLink({ uri: "http://localhost:8000/graphql" });
const authLink = setContext((_, { headers }) => {
  return { headers: { ...headers, "x-jwt": authTokenVar() || "" } };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
