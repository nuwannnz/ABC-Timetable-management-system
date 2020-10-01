/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component, useEffect, useState } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import NotAvailableDialog from '../components/NotAvailableTime/NotAvailableDialog';
import { deafultNotAvailbleTimeState, getNotAvailbleTimeState, NotAvailableTimeType, saveNotAvailbleTimeState } from '../utils/NotAvailableTime';

export default function NotAvailableTime() {

  const [displayDialog, setDisplayDialog] = useState(false);
  const [currentState, setCurrentState] = useState<NotAvailableTimeType>(deafultNotAvailbleTimeState);
  const [type, setType] = useState("");

  const [sessions, setSessions] = useState(false);
  const [lecturers, setLecturers] = useState(false);

  const [groups, setGroups] = useState(false);
  const [subGroups, setSubGroups] = useState(false);

  useEffect(()=>{
    const state = getNotAvailbleTimeState("");

    setCurrentState(state);


  },[])

  useEffect(() => {
    if (type.length === 0) {
      return;
    }

    if(type === 'session') {

      setGroups(false);
      setSubGroups(false);
      setLecturers(false);

      setSessions(true);

    } else if(type === 'lecturers') {

      setSessions(false);
      setGroups(false);
      setSubGroups(false);
      setLecturers(true);

    } else if(type === 'groups') {
      setSessions(false);
      setSubGroups(false);
      setLecturers(false);
      setGroups(true);

    } else if(type === 'subGroups') {
      setGroups(false);
      setSessions(false);

      setLecturers(false);
      setSubGroups(true);
    } else {
      console.log("");
    }
  },[type] );

  const handleSession = (id:string) => {

  }

  const handleDeleteNotTime = (id: string) => {
    if (!confirm('Delete this timeslot permanantly?')) {
      return;
    }

    const newState = Object.fromEntries(
      Object.entries(currentState)
    ) as NotAvailableTimeType;
    if(sessions) {
    newState.sessions = newState.sessions.filter((s) => s.id !== id);
    setCurrentState({ ...newState });
    saveNotAvailbleTimeState(newState);
    } else if(lecturers) {
      newState.lecturers = newState.lecturers.filter((s) => s.id !== id);
      setCurrentState({ ...newState });
      saveNotAvailbleTimeState(newState);
    } else if(groups) {
      newState.groups = newState.groups.filter((s) => s.id !== id);
      setCurrentState({ ...newState });
      saveNotAvailbleTimeState(newState);
    } else if(subGroups) {
      newState.subGroups = newState.subGroups.filter((s) => s.id !== id);
      setCurrentState({ ...newState });
      saveNotAvailbleTimeState(newState);
    }
  };

    return (
      <div>
         <div className="d-flex align-items-center mb-3">
        <h2>not available time sessions</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
        Allocate not available time
        </Button>
      </div>
      <div>
      <Form.Group>
            <Form.Label>Select type</Form.Label>
            <InputGroup>
          <Form.Control
                     as="select"
                     onChange={(e) => setType(e.target.value)}
                     value={type}

                   >
                     <option value={-1}>Select a type</option>

                       <option value="session">Sessions </option>
                       <option value="lecturers">Lecturers </option>
                       <option value="groups">Groups </option>
                       <option value="subGroups">Sub Groups </option>



                </Form.Control>
                </InputGroup>
                </Form.Group>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Id</th>
            {sessions ? <th >Sessions</th> : ''}
            {lecturers ? <th >Lectures</th> : ''}
            {groups ? <th >Groups</th> : ''}
            {subGroups ? <th >subGroups</th> : ''}

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions ? currentState.sessions.map((c: any) =>(
            <tr key={c.id}>
              <td>{c.id}</td>
            <td>{c.timeslotId}</td>

            <td>
              <div className="d-flex justify-content-center align-items-center">

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNotTime(c.id)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
          )): ''}

{lecturers ? currentState.lecturers.map((c: any) =>(
            <tr key={c.id}>
              <td>{c.id}</td>
            <td>{c.timeslotId}</td>

            <td>
              <div className="d-flex justify-content-center align-items-center">

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNotTime(c.id)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
          )): ''}

{groups ? currentState.groups.map((c: any) =>(
            <tr key={c.id}>
              <td>{c.id}</td>
            <td>{c.timeslotId}</td>

            <td>
              <div className="d-flex justify-content-center align-items-center">

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNotTime(c.id)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
          )): ''}

{subGroups ? currentState.subGroups.map((c: any) =>(
            <tr key={c.id}>
              <td>{c.id}</td>
            <td>{c.timeslotId}</td>

            <td>
              <div className="d-flex justify-content-center align-items-center">

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNotTime(c.id)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
          )): ''}




        </tbody>
      </Table>

      {displayDialog && (
        <NotAvailableDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);

          }}
          onSubmit={()=>setDisplayDialog(false)}

        />
      )}

      </div>
    )

}
