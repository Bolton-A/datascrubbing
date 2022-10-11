/*
Last updated: 10/10/2022
Description: Sets up content that is taken from ./base.py and is used in website.
TODO:
*/

/* Import necessary libraries. */
import { useState } from 'react'
import axios from "axios";
import './App.css';

/* Run an app that builds values that appear on website. */
function App() {
  const [profileData, setProfileData] = useState(null)
  function getData() {
    axios({
      method: "GET",
      url:"/profile",
    })
    .then((response) => {
      const res = response.data
      setProfileData(({
        profile_name: res.name,
        about_me: res.about}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  /* Set up pre-existing outputs that appear on the website and are not modified
  by the Python code. */
  return (
    <div className = "App">
      <header className = "App-header">
          <h1>Hello!</h1>
          <p>Welcome to my data-scrubbing application.</p>

        <p>Try clicking the button below: </p>
        <button onClick = {getData}>Click me!</button>
        {profileData && <div>
              <p>Profile name: {profileData.profile_name}</p>
              <p>About me: {profileData.about_me}</p>
            </div>
        }
      </header>
    </div>
  );
}

export default App;