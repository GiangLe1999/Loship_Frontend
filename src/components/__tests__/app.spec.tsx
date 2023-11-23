import { render } from "@testing-library/react";
import React from "react";
import App from "../app";

jest.mock("../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

describe("<App/>", () => {
  it("renders OK", () => {
    render(<App />);
  });
});
