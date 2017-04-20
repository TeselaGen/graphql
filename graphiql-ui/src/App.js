import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';


function graphQLFetcher(graphQLParams) {
  return fetch('http://localhost:3000' + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <GraphiQL fetcher={graphQLFetcher} />
      </div>
    );
  }
}

export default App;
