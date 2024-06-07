import React from "react";
import { ApolloProvider, client } from "./apolloClient";
import Games from "./components/games.js";

const App = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <h1>GraphQL Client</h1>
      <Games />
    </div>
  </ApolloProvider>
);

export default App;
