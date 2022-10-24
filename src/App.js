/*
Last updated: 10/22/2022
Description: Sets up content that is taken from ./base.py and is used in website.
TODO:
- Rebuild table using Ant Design features, sorting, and features.
- Make it so that 'Submit Query' automatically sends and updates table.
- Make it so that tables can be uploaded without refreshing.
- Create layout feature where query input is on one side and table is on the other. (Ant Design layouts)
- Add undo/redo feature.
- Allow user to save queries/commands.
*/

// Import necessary libraries.
import { Input, Collapse, Typography, Empty, Divider } from 'antd';
import React from 'react';
import Papa from "papaparse";
import "./App.css";

// Declare constants.
const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;

const App = () => 
{

  // Calls the function to prepare to create a table when csv is loaded. (Described further below.)
  populateToTable()

  /*
  Section: Clear Web Application
  Description: Refreshes window, clearing the table and the query input section.(DOES NOT CLEAR DATABASE/results.csv).
  Provides the user with a prompt informing user of what will happen and asking if they would like to contionue before refreshing.
  */
  function clearWebApp() 
  {
    // If the user confirms then the window will refresh. Displays success message.
    if (window.confirm('Are you sure you want to clear the table and your query?')) 
    {
      window.location.reload()
      console.log('Table and query have been cleared.');
    } 
    // If the user refuses then the window will remain the same.
    else 
    {
      console.log('Table and query have been spared.');
    }
  }

  /*
  Section: Clear Database
  Description: Performs the above function in refreshing the page to clear the table and the query input section. Then sends a query to remove all
  records within the Login table. Like Clear Web Application, it will explain what will happen and asks if the user would like to continue or not.
  */
  function clearDatabase()
  {
    // If the user confirms then the window will refresh.
    if (window.confirm('Are you sure you want to remove everything from the database and your current query?')) 
    {
      window.location.reload()
      console.log('Database has been emptied.');
    } 
    // If the user refuses then the window will remain the same.
    else 
    {
      console.log('Database has been spared.');
    }
    // Sets 'myVar' to a query that removes all entries and sends to Flask to execute. Displays success message.
    myVar = 'DELETE FROM Logins;'
        const request = new XMLHttpRequest();
        request.open('POST', '/profile', false);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function() {};
        request.send('myVar=' + myVar);
        alert("Your database was successfully cleared!");
  }

  /*
  Section: Populate To Table
  Description: Code waits for csv file to be uploaded from index.html side. Then checks to ensure that the uploaded file is a csv before parsing file
  where it detects a set of characters to seperate entries. Then builds the table by its headers and subsequent rows.
  TODO:
  I intend to rebuild this section using Ant Design to make it cleaner and more easily understood.
  */
  function populateToTable()
  {

    // Takes input from index.html and validates it.
    const readSingleFile = () => 
    {
      const fileInput = document.getElementById("fileinput");
      const form = document.getElementById("controls-form");
    
      // Validates file as being of the csv type. Alerts user if they select a file that is incorrect.
      if (fileInput.files[0].type !== "text/csv") 
      {
        alert("Not a CSV file");
        form.reset();
      }
      // If correct, code proceeds to next section.
      else 
      {
        parseCSV(fileInput.files[0]);
      }
    };
    
    // Parses csv file for characters to seperate entries. Sets to rows and headers if valid and begins parse with PapaParse.
    const parseCSV = file => 
    {
      const config = 
      {
        delimiter: "",
        newline: "",
        quoteChar: '"',
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: undefined,
        complete: function(response) 
        {
          console.log('loaded')
          const rows = response.data;
          buildTable(rows);
        },
        error: (error) => alert(error),
        download: false,
        skipEmptyLines: false,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: () => 
        {
          console.log('loading...')
        },
        withCredentials: undefined
      };
      Papa.parse(file, config);
    };
    
    // Builds table using the headers and rows retrieved above.
    const buildTable = (rows) => 
    {
      console.log('rendering started')
    
      // Sets table body.
      let tableBody = document.getElementById("csv-table__body");
      tableBody.innerHTML = "";
    
      // Builds table body. If row has some value, go through each value and append.
      let rowsFragment = document.createDocumentFragment();
      console.log('Rows:', rows.length);
      rows.forEach((row, index) => 
      {
        var tr = document.createElement("tr");
        Object.values(row).forEach(item => {
          let td = document.createElement("td");
          let txt = document.createTextNode(item);
          td.appendChild(txt);
          tr.appendChild(td);
          rowsFragment.appendChild(tr);
        });
        tableBody.appendChild(rowsFragment);
      });

      // Display success message.
      console.log('rendering finished');
    };
    
    // Listens to events from index.html.
    document
      .getElementById("fileinput")
      .addEventListener("change", readSingleFile, false);
  }  

  // Sets up myVar.
  let [myVar, setMyVar] = React.useState('');

  /*
  Section: Send Request
  Description: Creates XMLHttpRequest to send myVar to base.py.
  */
  function sendRequest()
  {
    const request = new XMLHttpRequest();
    request.open('POST', '/profile', false);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function(){};
    request.send('myVar=' + myVar);
  }

  /*
  Section: Post Data
  Description: Calls for Send Request to send myVar to base.py and displays success message.
  */
  function postData()
  {
    sendRequest()
    alert("Your SQL was successfully submitted!");
  }

  /*
  Section: View All
  Description: Calls for Send Request to send myVar as 'SELECT * FROM Logins;' to base.py and displays success message.
  This causes all entries within the Login table to be sent to the csv.
  */
  function viewAll()
  {
    myVar = 'SELECT * FROM Logins;'
    sendRequest()
    alert("Your query was successfully submitted!");
  }

  /*
  Section: Five Sample
  Description: Calls for Send Request to send myVar as an INSERT INTO that generates five sample entries to base.py and displays success message.
  */
  function fiveSample()
  {
    myVar = "INSERT INTO Logins(username, password, useremail, tickettime) VALUES ('LauraSmith', 'laura123', 'laura@gmail.com', 2), ('BobRoss', 'bs456', 'bob@gmail.com', 2), ('HannahSmith', 'hs789', 'hannah@gmail.com', 2), ('SamSamson', 'ss012', 'sam@gmail.com', 2), ('RonRob', 'ron345', 'ron@gmail.com', 2);"
    sendRequest()
    alert("You are ready to query this sample!");
  }

  /*
  Section: Twenty Sample
  Description: Calls for Send Request to send myVar as an INSERT INTO that generates twenty sample entries to base.py and displays success message.
  */
  function twentySample()
  {
    myVar = "INSERT INTO Logins(username, password, useremail, tickettime) VALUES ('LauraSmith', 'ls123', 'laura@gmail.com', 2), ('BobRoss', 'bs456', 'bob@gmail.com', 2), ('HannahSmith', 'hs789', 'hannah@gmail.com', 2), ('SamSamson', 'ss012', 'sam@gmail.com', 2), ('RonRob', 'rr345', 'ron@gmail.com', 2), ('TinaNash', 'tn678', 'tina@gmail.com', 2), ('LutherTodd', 'lt901', 'luther@gmail.com', 2), ('GertrudeRamirez', 'gr234', 'gertrude@gmail.com', 2), ('ErvinPadilla', 'ep567', 'ervin@gmail.com', 2), ('TerrenceClark', 'tc890', 'terraence@gmail.com', 2), ('DaveFreeman', 'df123', 'dave@gmail.com', 2), ('JoseWalt', 'jw456', 'jose@gmail.com', 2), ('KariGutierrez', 'kg789', 'kari@gmail.com', 2), ('LeonardFrank', 'lf012', 'leonard@gmail.com', 2), ('SilviaRoss', 'sr345', 'silvia@gmail.com', 2), ('DarinFletcher', 'df678', 'darin@gmail.com', 2), ('HoraceCarrol', 'hc901', 'horace@gmail.com', 2), ('EarlSwanson', 'es234', 'earl@gmail.com', 2), ('VanessaWoods', 'vw567', 'vanessa@gmail.com', 2), ('RubyEdwards', 're890', 'ruby@gmail.com', 2);"
    sendRequest()
    alert("You are ready to query this sample!");
  }

  // Checks if a change has occurred. (Used for collapsible elements.)
  const onChange = (key) => 
  {
    console.log(key);
  };

  return (
    <>
      {/* Introduction section, displays title of application and creator. */}
      <Divider>Open Avenues Datascrubbing Application</Divider>
      <Text><p>This application was created by Aine Bolton during her Open Avenues Datascrubbing Application micro-internship. For more information, please see the Documentation tab.</p></Text>
      
      {/* Collapsable section. Displays usage and documentation. */}
      <Collapse defaultActiveKey={['0']} onChange={onChange}>
        <Panel header="Documentation" key="1">
          <Text><p>The purpose of this application is to allow a user to create a query into a table named <Text mark>Logins</Text> and then return the result of that query.</p></Text>
          <Text><p>To use this application:</p></Text>
          <Text><p>1. Enter your SQL query in the section above  <Text code>Submit SQL</Text>.</p></Text>
          <Text><p>2. Press <Text code>Submit SQL</Text>.</p></Text>
          <Text><p>3. Click <Text code>Choose File</Text> and browse until you locate <Text code>results.csv</Text>. (Tip: You can find it in the <Text mark>.../datascrubbing/flask</Text> folder.)</p></Text>
          <Text><p>4. View the result from your query below.</p></Text>
          <Text><p>5. Press <Text code>Reset Table & Query Section</Text> and click <Text code>Yes</Text> in the prompt to type and submit a new query.</p></Text>
          <Text><p>Tip: Use the <Text code>Pregenerated Commands</Text> tab for a few basic sample queries and sample tables.</p></Text>
          
          {/* Collapsable section. Displays troubleshooting guide. */}
          <Collapse defaultActiveKey={['0']} onChange={onChange}>
            <Panel header="Troubleshooting" key="1">
              <Text><p>This guide is intended to provide assistance to users in the event that an error occurs with this application.</p></Text>
              <Text><p><Text strong>Problem: "I clicked <Text code>Submit SQL</Text> but I can't see my table."</Text></p></Text>
              <Text><p>Solution: After submitting your query through <Text code>Submit SQL</Text>, you must click <Text code>Choose File</Text> and select <Text code>results.csv</Text>. This will display the table.</p></Text>
              <Text><p><Text strong>Problem: "I tried to select all results in the table but the table came back empty.</Text></p></Text>
              <Text><p>Solution: Your table is probably empty. You can either select <Text code>Pregenerated Commands</Text> and one of the <Text code>Insert Sample Entries</Text> commands or create an INSERT INTO using the SQL query function to make your own table.</p></Text>
              <Text><p><Text strong>Problem: "Why can't I upload the updated table?"</Text></p></Text>
              <Text><p>Solution: To refresh the table, please click <Text code>Reset Table & Query Section</Text>. Either copy and paste your query to the refreshed page or send the query prior to refreshing. If you send it before then it should still work just fine!</p></Text>
            </Panel>
          </Collapse>
        </Panel>
      </Collapse>

      {/* Collapsable section. Displays pregenerated command buttons. */}
      <Collapse defaultActiveKey={['0']} onChange={onChange}>
        <Panel header="Pregenerated Commands" key="1">
          {/* Loads results.csv with all entries from Logins. */}
          <button type="button" class="submit" onClick = {viewAll}>Select All Logins</button>
          {/* Loads five sample entries into Logins. */}
          <button type="button" class="submit" onClick = {fiveSample}>Insert Five Sample Entries</button>
          {/* Loads twenty sample entries into Logins. */}
          <button type="button" class="submit" onClick = {twentySample}>Insert Twenty Sample Entries</button>
          {/* Deletes everything in Logins. */}
          <input type="button" class="submit" id="btnDelete" value="Clear Database" onClick={clearDatabase}/>
        </Panel>
      </Collapse>
    
      {/* Creates querying section. Automatically updates myVar on change. */}
      <TextArea rows={4} 
        placeholder="Hello! Here is where you will enter your SQL queries." 
        maxLength={2000} 
        onChange={(e) => setMyVar(e.target.value)}
      />

      {/* Sends user's SQL query to base.py for evaluation. */}
      <button type="button" class="submit" onClick = {postData}>Submit SQL</button>
      
      {/* Refreshes page, clearing the table and SQL query. */}
      <input type="button" class="submit" id="btnDelete" value="Reset Table & Query Section" onClick={clearWebApp}/>

      {/* Creates table with empty section, instructing the user how to proceed. */}
      <table id="csv-table">
          <tbody id="csv-table__body">
            <Empty class='empty'>
              <Text><p>Enter your query, press <Text code>Submit SQL</Text> then click <Text code>Choose File</Text> to get started!</p></Text>
            </Empty> 
            </tbody>
      </table>
    </>
  );
};
export default App;

/*
REFERENCES: 
https://codepen.io/davewallace/pen/zwwRoN: Used for creating textarea.
https://www.codecademy.com/forum_questions/512d28a06918338f2300e9ea: Used for creating application alerts.
https://codepen.io/manifoldkaizen/pen/jYmbGy: Used for opening results.csv and converting to table.

*/
