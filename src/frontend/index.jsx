import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Textfield } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);
  useEffect(() => {
    invoke('getText2', { example: 'my-invoke-variable' }).then(setData2);
  }, []);

  return (
    <>
      <Text>Current User Email AsApp result!</Text>
      <Text>{data ? data : 'Loading...'}</Text>
      <Text>Current User Email AsUser result!</Text>
      <Text>{data2 ? data2 : 'Loading...'}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
