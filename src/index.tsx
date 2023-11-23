import ReactDOM from "react-dom/client";
import "./global.css";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { Toaster } from "react-hot-toast";
import App from "./components/app";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <App />
    <Toaster position="bottom-center" reverseOrder={false} />
  </ApolloProvider>
);

reportWebVitals();
