import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SubApp from './SubApp';

function App() {
  return (
    <div>
      {/* <Routes> */}
      {/* <Route path="http://localhost:3000/rtc-js-prebuilt/0.3.10/?meetingId=demo&webcamEnabled=true&micEnabled=true&name=jiku&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2NjEzZjhmMS1iY2Y3LTRkNTEtYTA0Yi1lYmU2NWY5NTJhOGYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY2MTQxMzQzMiwiZXhwIjoxNjYyMDE4MjMyfQ.vccrcMw2Jde_nzDc3ESx3U_GUrneuZBQDCr9_JmXzrY" />
       */}
      {/* <Route
          path="http://localhost:3000/rtc-js-prebuilt/0.3.10/?meetingId=demo&webcamEnabled=true&micEnabled=true&name=jiku&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2NjEzZjhmMS1iY2Y3LTRkNTEtYTA0Yi1lYmU2NWY5NTJhOGYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY2MTQxMzQzMiwiZXhwIjoxNjYyMDE4MjMyfQ.vccrcMw2Jde_nzDc3ESx3U_GUrneuZBQDCr9_JmXzrY"
          element={<BoxApp />}
        /> */}
      {/* </Routes> */}
      <SubApp />
    </div>
  );
}

export default App;
