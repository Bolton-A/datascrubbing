/*
Last updated: 10/26/2022
Description: Sets up content that is taken from ./base.py and is used in website.
TODO:
- Make it so that 'Submit Query' automatically sends and updates table.
- Make it so that tables can be uploaded without refreshing.
- Allow user to save queries/commands.
*/

// Import necessary libraries.
import { Table, BackTop, Button, Collapse, Divider, Empty, Input, Menu, Typography } from 'antd';
import { CodeOutlined, ClearOutlined, ConsoleSqlOutlined, CopyOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import Papa from "papaparse";
import React, { useEffect, useState } from 'react';
import "./App.css";
import axios from 'axios';

// Declare constants.
const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;

function App (props)
{
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
        title: 'Greeting',
        dataIndex: 'greeting',
        key: 'greeting',
    },
  ]);
  useEffect(() => {
    
        fetch('/hello', { method:'GET'})
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
          //data = JSON.stringify(json, null, 1);
          //var myResult = JSON.stringify(json, null, 1)

          //let myResult = JSON.stringify(json, null, 1);
          //data.push(myResult)

          setData(JSON.parse(JSON.stringify(json, null, 1)));
          //document.write(dataSource);
      });
  }, []);

  useEffect(() => {
    setColumns(columns);
  }, [data]);

  // Calls the function to prepare to create a table when csv is loaded. (Described further below.)
  populateToTable()

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
        complete: function(response) 
        {
          const rows = response.data;
          buildTable(rows);
        },
      };
      Papa.parse(file, config);
    };
    
    // Builds table using the headers and rows retrieved above.
    const buildTable = (rows) => 
    {
      // Sets table body.
      let tableBody = document.getElementById("csv-table__body");
      tableBody.innerHTML = "";
    
      // Builds table body. If row has some value, go through each value and append.
      let rowsFragment = document.createDocumentFragment();
      rows.forEach((row) => 
      {
        var tr = document.createElement("tr");
        Object.values(row).forEach(item => 
        {
          let td = document.createElement("td");
          let txt = document.createTextNode(item);
          td.appendChild(txt);
          tr.appendChild(td);
          rowsFragment.appendChild(tr);
        });
        tableBody.appendChild(rowsFragment);
      });
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
  Section: View All
  Description: Calls for Send Request to send myVar as 'SELECT * FROM Logins;' to base.py and displays success message.
  This causes all entries within the Login table to be sent to the csv.
  */
  function viewAll()
  {
    myVar = 'SELECT * FROM Logins;'
    sendRequest()
  }

  /*
  Section: Five Sample
  Description: Calls for Send Request to send myVar as an INSERT INTO that generates five sample entries to base.py and displays success message.
  */
  function fiveSample()
  {
    // Sets 'myVar' to a query that removes all entries and sends to Flask to execute. Displays success message.
    myVar = 'DELETE FROM Logins;'
    sendRequest()
    myVar = "INSERT INTO Logins(username, password, useremail, tickettime) VALUES ('LauraSmith', 'laura123', 'laura@gmail.com', 2), ('BobRoss', 'bs456', 'bob@gmail.com', 2), ('HannahSmith', 'hs789', 'hannah@gmail.com', 2), ('SamSamson', 'ss012', 'sam@gmail.com', 2), ('RonRob', 'ron345', 'ron@gmail.com', 2);"
    sendRequest()
    viewAll()
    alert("You are ready to open the file for this sample!");
  }

  /*
  Section: Twenty Sample
  Description: Calls for Send Request to send myVar as an INSERT INTO that generates twenty sample entries to base.py and displays success message.
  */
  function twentySample()
  {
    // Sets 'myVar' to a query that removes all entries and sends to Flask to execute. Displays success message.
    myVar = 'DELETE FROM Logins;'
    sendRequest()
    myVar = "INSERT INTO Logins(username, password, useremail, tickettime) VALUES ('LauraSmith', 'ls123', 'laura@gmail.com', 2), ('BobRoss', 'bs456', 'bob@gmail.com', 2), ('HannahSmith', 'hs789', 'hannah@gmail.com', 2), ('SamSamson', 'ss012', 'sam@gmail.com', 2), ('RonRob', 'rr345', 'ron@gmail.com', 2), ('TinaNash', 'tn678', 'tina@gmail.com', 2), ('LutherTodd', 'lt901', 'luther@gmail.com', 2), ('GertrudeRamirez', 'gr234', 'gertrude@gmail.com', 2), ('ErvinPadilla', 'ep567', 'ervin@gmail.com', 2), ('TerrenceClark', 'tc890', 'terraence@gmail.com', 2), ('DaveFreeman', 'df123', 'dave@gmail.com', 2), ('JoseWalt', 'jw456', 'jose@gmail.com', 2), ('KariGutierrez', 'kg789', 'kari@gmail.com', 2), ('LeonardFrank', 'lf012', 'leonard@gmail.com', 2), ('SilviaRoss', 'sr345', 'silvia@gmail.com', 2), ('DarinFletcher', 'df678', 'darin@gmail.com', 2), ('HoraceCarrol', 'hc901', 'horace@gmail.com', 2), ('EarlSwanson', 'es234', 'earl@gmail.com', 2), ('VanessaWoods', 'vw567', 'vanessa@gmail.com', 2), ('RubyEdwards', 're890', 'ruby@gmail.com', 2);"
    sendRequest()
    viewAll()
    alert("You are ready to open the file for this sample!");
  }

  /*
  Section: Select All
  Description: Executes query selecting all items from table.
  */
  function selectAll()
  {
    viewAll()
    alert("Your query was successfully submitted!");
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
  Section: Copy Text
  Description: Copies the text from textarea to clipboard.
  */
  function copyText() 
  {
    let textarea = document.getElementById("textarea");
    textarea.select();
    document.execCommand("copy");
  }

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
      // Sets 'myVar' to a query that removes all entries and sends to Flask to execute. Displays success message.
      myVar = 'DELETE FROM Logins;'
      sendRequest()
      viewAll()
      window.location.reload()
      console.log('Database has been emptied.');
    } 
    // If the user refuses then the window will remain the same.
    else 
    {
      console.log('Database has been spared.');
    }
  }

  /*
  Section: SQL Help
  Description: Send user to CodeAcademy SQL cheat sheet.
  */
  function sqlHelp() 
  {
    window.open("https://www.codecademy.com/learn/learn-sql/modules/learn-sql-queries/cheatsheet", "_blank");
  }

  // Checks if a change has occurred. (Used for collapsible elements.)
  const onChange = (key) => 
  {
    console.log(key);
  };

  return (
    <>
      {console.log("Columns: ", columns)}
      <Text>{JSON.stringify(data)}</Text>
      <Table data={JSON.parse(JSON.stringify(data))} columns={columns} />

      {/* Introduction section, displays title of application and creator. */}
      <Divider>Open Avenues Datascrubbing Application</Divider>
      <Text><p>This application was created by Aine Bolton with mentorship from Rishabh Gupta during her Open Avenues Datascrubbing Application micro-internship. For more information, please see the Documentation tab.</p></Text>

      {/* Collapsable section. Displays usage and documentation. */}
      <Collapse defaultActiveKey={['0']} onChange={onChange}>
        <Panel header="Documentation" key="1">
          <Text><p>The purpose of this application is to allow a user to create a query into a table named <Text mark>Logins</Text> and then return the result of that query.</p></Text>
          <Text><p>To use this application:</p></Text>
          <Text><p>1. Enter your SQL query in the textarea below the toolbar.</p></Text>
          <Text><p>2. Press <Text code>Execute Query</Text>.</p></Text>
          <Text><p>3. Click <Text code>Choose File</Text> and browse until you locate <Text code>results.csv</Text>. (Tip: You can find it in the <Text mark>.../datascrubbing/flask</Text> folder.)</p></Text>
          <Text><p>4. View the result from your query below.</p></Text>
          <Text><p>5. Press <Text code>Clear Query</Text> and click <Text code>Yes</Text> in the prompt to remove your current view of the table and your query.</p></Text>
          <Text><p>Tip: If you would like to clear the database containing your table and all your work, click <Text code>Remove All Data Entries</Text>.</p></Text>
          <Text><p>Tip: Use the <Text code>Generated Sample Entries</Text> tab for a few basic sample queries and sample tables.</p></Text>
          
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
        <Panel header="Generate Sample Entries" key="1">
          {/* Loads five sample entries into Logins. */}
          <button type="button" class="submit" onClick = {fiveSample}>Insert Five Sample Entries</button>
          {/* Loads twenty sample entries into Logins. */}
          <button type="button" class="submit" onClick = {twentySample}>Insert Twenty Sample Entries</button>
        </Panel>
      </Collapse>

      {/* Displays a menu of buttons. */}
      <Menu class="menu" mode="horizontal">
        {/* Selects all results from table. */}
        <Button type="default" onClick={selectAll} icon={<CodeOutlined />}>Select All</Button>
        {/* Updates results.csv with results. */}
        <Button type="default" onClick = {postData} icon={<ConsoleSqlOutlined />}>Execute Query</Button>
        {/* Copies textarea to clipboard. */}
        <Button type="default" onClick={copyText} icon={<CopyOutlined />}>Copy to Clipboard</Button>
        {/* Clears clears query section and table. (DOES NOT CLEAR DATABASE.) */}
        <Button type="default" onClick={clearWebApp} icon={<ClearOutlined />}>Clear Query</Button>
        {/* Clears query section, table, and database. */}
        <Button type="default" onClick={clearDatabase} icon={<WarningOutlined />}>Remove All Data Entries</Button>
        {/* Sends user to CodeAcademy SQL cheatsheet. */}
        <Button type="default" onClick={sqlHelp} icon={<InfoCircleOutlined />}>SQL Help</Button>
      </Menu>

      {/* Creates querying section. Automatically updates myVar on change. */}
      <TextArea 
        id="textarea"
        rows={4} 
        placeholder="Hello! Here is where you will enter your SQL queries." 
        maxLength={2000} 
        onChange={(e) => setMyVar(e.target.value)}
      />

      {/* Creates table with empty section, instructing the user how to proceed. */}
      <table id="csv-table">
          <tbody id="csv-table__body">
            <Empty class='empty'>
              <Text><p>Enter your query, press <Text code>Submit SQL</Text> then click <Text code>Choose File</Text> to get started!</p></Text>
            </Empty> 
            </tbody>
      </table>

      <BackTop/>
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
