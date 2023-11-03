import { FC } from "react";
import { UserRole } from "../__generated__/graphql";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NotFound from "../pages/404";
import Restaurants from "../pages/client/restaurants";
import { useMe } from "../hooks/useMe";
import Header from "../components/layout/header";
import ConfirmEmail from "../pages/user/confirm-email";
import { gql } from "@apollo/client";
import EditProfile from "../pages/user/edit-profile";
import { path } from "../constants";

interface Props {}

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

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  { path: path.editProfile, component: <EditProfile /> },

  // {
  //   path: "/search",
  //   component: <Search />,
  // },
  // {
  //   path: "/category/:slug",
  //   component: <Category />,
  // },
  // {
  //   path: "/restaurants/:id",
  //   component: <Restaurant />,
  // },
];

// const commonRoutes = [
//   { path: "/confirm", component: <ConfirmEmail /> },
//   { path: "/edit-profile", component: <EditProfile /> },
//   { path: "/orders/:id", component: <Order /> },
// ];

// const restaurantRoutes = [
//   { path: "/", component: <MyRestaurants /> },
//   { path: "/add-restaurant", component: <AddRestaurant /> },
//   { path: "/restaurants/:id", component: <MyRestaurant /> },
//   { path: "/restaurants/:restaurantId/add-dish", component: <AddDish /> },
// ];

const LoggedInRouter: FC<Props> = (props): JSX.Element => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        {data?.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
