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
import Search from "../pages/client/search";
import Category from "../pages/client/category";
import Restaurant from "../pages/client/restaurant";
import Categories from "../pages/client/categories";
import MyRestaurants from "../pages/owner/my-restaurants";
import AddRestaurant from "../pages/owner/add-restaurant";
import MyRestaurant from "../pages/owner/my-restaurant";
import AddDish from "../pages/owner/add-dish";
import CheckoutSuccess from "../pages/owner/checkout-success";

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
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/categories",
    component: <Categories />,
  },
  {
    path: "/restaurant/:id",
    component: <Restaurant />,
  },
];

const commonRoutes = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> },
  // { path: "/orders/:id", component: <Order /> },
];

const restaurantRoutes = [
  { path: "/", component: <MyRestaurants /> },
  { path: "/add-restaurant", component: <AddRestaurant /> },
  { path: "/restaurant/:id", component: <MyRestaurant /> },
  { path: "/restaurant/:restaurantId/add-dish", component: <AddDish /> },
  {
    path: "/restaurant/:restaurantId/checkout-success",
    component: <CheckoutSuccess />,
  },
];

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

        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}

        {commonRoutes.map((route) => (
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
