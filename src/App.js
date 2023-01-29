import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { wait } from '@testing-library/user-event/dist/utils';



function App() {

  //const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectID, setSelectedProject] = useState(0);
  const [inputProjectName, setinputProjectName] = useState("");
  const [inputProjectReadOnly, setinputProjectReadOnly] = useState(false);
  
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [timesheets, setTimesheets] = useState([]);


  function getProjects() {
    fetch('http://127.0.0.1:8080/getProjects', { method: 'GET' })
    .then((data) => data.json())
    .then(json => {
      console.log(json);
      setProjects(json);
    })
  }

  function getTimesheets() {
    fetch('http://127.0.0.1:8080/getTimesheets', { method: 'GET' })
    .then((data) => data.json())
    .then(json => {
      console.log(json);
      setTimesheets(json);
    })
  }

  function ocSelectedProject (event) {
    setSelectedProject(event.target.value);
    setinputProjectName(event.target.value > 0 ? projects[event.target.value - 1].name : "");
    setinputProjectReadOnly(event.target.value > 0 ? true : false);
    console.log(event.target.value);
  }

  function onProjectNameChange (event) {
    setinputProjectName(event.target.value);
  }

  function addProject () {
    if(selectedProjectID < 1) {
      fetch('http://127.0.0.1:8080/addProject', { method: 'POST', headers: { "Content-Type": "text/plain"}, body: inputProjectName })
      .then((data) => data.json())
      .then(json => {
        console.log(json);
        setSelectedProject(json.pid);
        getProjects();
        return json.pid;
      })
    }
  }

  function onChangeDate (event) {
    setDate(event.target.value);
  }
  function onChangeStartTime (event) {
    setStartTime(event.target.value);
  }
  function onChangeEndTime (event) {
    setEndTime(event.target.value);
  }

  function handleDateNow() {
    //setDate(new Date().toLocaleDateString("de-de"));
    setDate(new Date().toLocaleDateString("en-en", {weekday: 'long'}));
  }

  function handleStartTimeNow() {
    setStartTime(new Date().toLocaleTimeString("de-de", {hour: '2-digit', minute:'2-digit'}));    
  }

  function handleEndTimeNow() {
    setEndTime(new Date().toLocaleTimeString("de-de", {hour: '2-digit', minute:'2-digit'}));    
  }

  function addTimesheet () {
    var id = selectedProjectID;
    console.log("Add Timesheet id1: " + id);
    if(id < 1) {
      id = addProject();
    }
    else {  
      console.log("Add Timesheet id2: " + id);
      const timesheet = {
        weekday: date,
        starttime: startTime,
        endtime: endTime,
        workinghours: "1.0",
        pid: id,
        uid: 1
      }
      let jsonString = JSON.stringify(timesheet);
      //console.log(jsonString);
      fetch('http://127.0.0.1:8080/addTimesheet', { method: 'POST', headers: { "Content-Type": "application/json"}, body: jsonString } );
    }
  }

  return (
    <div className="App">
      <header className="App-header">        
        {/*visible &&<MyList numEntries={numEntriesList} />*/}
        <h1>Timesheet</h1>
        <hr width="100%;"></hr>
        Date:
        <input type="text" name="date" value={date} onChange={onChangeDate}></input>
        <MyButton label="Now" handler={handleDateNow}/>
        <hr width="35%;"></hr>

        Start time: 
        <input type="text" name="startime" value={startTime} onChange={onChangeStartTime}></input>        
        <MyButton label="Now" handler={handleStartTimeNow}/>
        <hr width="35%;"></hr>

        End time:
        <input type="text" name="endtime" value={endTime} onChange={onChangeEndTime}></input>
        <MyButton label="Now" handler={handleEndTimeNow}/>
        <hr width="35%;"></hr>
        
        
        <MyButton handler={getProjects} label="Get Projects from backend"/>

        
        <MyDropdown prj={projects} ochandler={ocSelectedProject}/>
        <input type="text" name="ProjectName" onChange={onProjectNameChange} value={inputProjectName} readOnly={inputProjectReadOnly}></input>
        <hr width="35%;"></hr>

        <MyButton handler={addTimesheet} label="Add Timesheet"/>

        <hr width="60%;"></hr>
        <MyButton handler={getTimesheets} label="Get Timesheets"/>
        
        <TimeSheetTable timesheets={timesheets}/>
      </header>
    </div>
  );
}


function MyDropdown(params) {
  var list = [];
  list = params.prj;

  var listList = list.map(function(entry) {
    return <option value={entry.pid}>{entry.name}</option>;
  });

  return (
    <select name="Projects" onChange={params.ochandler}>      
      <option value="0">Neues Projekt</option>
      {listList}
    </select>
  );
}

function MyButton(params) {
  return (
    <button onClick={params.handler}>
      {params.label}
      </button>
  );
}

function TimeSheetTable(params) {
  var list = params.timesheets;
  var ListList = list.map(function(entry) {
    return <tr>
      <th>{entry.weekday}</th>
      <th>{entry.starttime}</th>
      <th>{entry.endtime}</th>
      <th>{entry.project.name}</th>
      <th>{entry.user.username}</th>
      </tr>;
  });

  return (
    <table className='timesheetTable'>
      <tr>
        <th><h2>Weekday</h2></th>
        <th><h2>Start time</h2></th>
        <th><h2>End time</h2></th>
        <th><h2>Project</h2></th>
        <th><h2>Username</h2></th>
      </tr>
      {ListList}
    </table>
  );
}


export default App;
