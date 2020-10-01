/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-key */
/* eslint-disable eqeqeq */
/* eslint-disable import/order */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component, useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';
import Lecture from '../../entity/Lecture';
import { v4 as uuidv4 } from 'uuid';
import Session from '../../entity/Session';
import { NotAvailableTimeType,deafultNotAvailbleTimeState,getNotAvailbleTimeState, saveNotAvailbleTimeState } from '../../utils/NotAvailableTime';
import StudentBatch from '../../entity/StudentBatch';
import { getWorkingDaysState } from '../../utils/workingDaysDB';
import { SubGroupType } from '../student-batch/StudentBatchDialog';


type NotAvailableDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  // consectiveSession?: Session | null;
  onSubmit: () => void;
};

type GroupDropdownItemType={
 batch:StudentBatch;
 groupId:string;
}

type TimeSlotType =  {
  id: string;
  startTime: {
    hour: number;
    minute: number;
  };
  endTime: {
    hour: number;
    minute: number;
  };
  AM: boolean;
};


export default function NotAvailableDialog({closeClickHandler, show, onSubmit}: NotAvailableDialogProps) {

  const [type, setType] = useState("");

  const [sessions, setSessions] = useState(false);
  const [lecturers, setLecturers] = useState(false);

  const [groups, setGroups] = useState(false);
  const [subGroups, setSubGroups] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(String);
  const [selectedGroup, setSelectedGroup] = useState(String);
  const [selectedSession, setSelectedSession] = useState(String);
  const [selectedSubGroup, setselectedSubGroup] = useState(String);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(String);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [dropdown, setDropdown] = useState<Session[] | Lecture[] | GroupDropdownItemType[]>([]);
  const [sessionDropdown, setSessionDropdown] = useState<Session[]>([]);
  const [lectureDropdown, setLectureDropdown] = useState<Lecture[]>([]);
  const [groupDropdown, setGroupDropdown] = useState<GroupDropdownItemType[]>([]);
  const [subGroupDropdown, setSubGroupDropdown] = useState<GroupDropdownItemType[]>([]);

const [currentState, setCurrentState] = useState<NotAvailableTimeType>(deafultNotAvailbleTimeState);
const [timeSlots, settimeSlots] = useState<TimeSlotType[]>([]);

useEffect(()=>{
  const state = getNotAvailbleTimeState();

  setCurrentState(state);

  const workingDaysState = getWorkingDaysState();
  settimeSlots([...workingDaysState.timeSlots]);
},[])

  const loadSessions = async () => {
    setLecturers(false);
    setGroups(false);
    setSubGroups(false);
    const s = await Session.findAll({
      include: [{ all: true, nested: true }],
    });
    setSessionDropdown([...s]);
  };

  const loadLecturers = async () => {
    setSessions(false);
    setGroups(false);
    setSubGroups(false);
    const s = await Lecture.findAll({
      include: [{ all: true, nested: true }],
    });
    setLectureDropdown([...s]);
  };

  const loadGroups = async () => {
    setSessions(false);
    setLecturers(false);
    setSubGroups(false);
    const batches = await StudentBatch.findAll();
    const groups: GroupDropdownItemType[] = [];
    batches.forEach(b =>{
        b.get().groups.map((g:any) => groups.push({batch:b, groupId:g.id}))
    })
    setGroupDropdown([...groups]);
  };

  const loadSubGroups = async () => {
    setSessions(false);
    setGroups(false);
    setLecturers(false);
    const batches = await StudentBatch.findAll({
      include: [{ all: true, nested: true }],
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const subGroups: GroupDropdownItemType[] = [];
    batches.forEach(b =>{
        b.get().groups.map((g:any) => g.subGroups.map((sg:any) => subGroups.push({batch:b,groupId:sg.id})))
    })
    setSubGroupDropdown([...subGroups]);
  };



  useEffect(() => {
    if (type.length === 0) {
      return;
    }

    if(type === 'session') {


      loadSessions();
      setSessions(true);

    } else if(type === 'lecturers') {


      loadLecturers();
      setLecturers(true)

    } else if(type === 'groups') {
      loadGroups();
      setGroups(true);

    } else if(type === 'subGroups') {
      loadSubGroups();
      setSubGroups(true);
    } else {
      console.log("");
    }
  },[type] );


  const saveBtnClickHandler = () => {
    // if (!validate()) {
    //   setErrorMsg('Subject code and subject name are required');
    //   return;
    // }

    /**
     *
     * selectedSession
     * selectedLecture
     * selectedGroup
     *
     *
     */



     const state = currentState;

    if(selectedSession) {
      state.sessions.push({
        id: uuidv4(),
        sessionId:  selectedSession,
        timeslotId: selectedTimeSlot

      })
    } else if(selectedLecture){
        state.lecturers.push({
          id:uuidv4(),
          lectureId: selectedLecture,
          timeslotId: selectedTimeSlot
        })
      } else if(selectedGroup) {
        state.groups.push({
          id:uuidv4(),
          groupId: selectedGroup,
          timeslotId: selectedTimeSlot
        })
      } else if(selectedSubGroup) {
        state.subGroups.push({
          id:uuidv4(),
          subGroupId: selectedSubGroup,
          timeslotId: selectedTimeSlot
        })
      }




      //

      saveNotAvailbleTimeState(state);
      onSubmit();

  };


    return (
      <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title> Allocate not available time</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
        <Row>
          <Col>
          <Form.Group controlId="session">
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

          </Col>
          <Col>
          {sessions ?
            <Form.Group>
            <Form.Label>Select Sessions</Form.Label>
            <InputGroup>
          <Form.Control
                  as="select"
                  onChange={(e) => setSelectedSession(e.target.value)}
                  value={selectedSession}

                >

                <option value={-1}>Select</option>
                {sessionDropdown.map((s:any) => (
                    <option key={s.id} value={s.id}>
                    {s && (s as any).Subject.name}
                  </option>
                ))}


                </Form.Control>
                </InputGroup>
                </Form.Group>
          :''}
          {lecturers ?
            <Form.Group>
            <Form.Label>Select Lectures</Form.Label>
            <InputGroup>
          <Form.Control
                  as="select"
                  onChange={(e) => setSelectedLecture(e.target.value)}
                  value={selectedLecture}

                >

                <option value={-1}>Select</option>
                {lectureDropdown.map((s: any) =>(
                      <option key={s.id} value={s.id}>
                      {s.fName}
                    </option>
                ))}


                </Form.Control>
                </InputGroup>
                </Form.Group>
          :''}
          {groups ?
            <Form.Group>
            <Form.Label>Select</Form.Label>
            <InputGroup>
          <Form.Control
                  as="select"
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  value={selectedGroup}

                >

                <option value={-1}>Select</option>
                {groupDropdown.map((s: any) => (
                  <option key={s.id} value={s.id}>
                  {s.groupId}
                </option>
                ))}


                </Form.Control>
                </InputGroup>
                </Form.Group>
          :''}
          {subGroups ?
            <Form.Group>
            <Form.Label>Select</Form.Label>
            <InputGroup>
          <Form.Control
                  as="select"
                  onChange={(e) => setselectedSubGroup(e.target.value)}
                  value={selectedSubGroup}

                >

                <option value={-1}>Select</option>
                {subGroupDropdown.map((s: any) => (
                  <option key={s.id} value={s.id}>
                  {s.id}

                </option>
                ))}


                </Form.Control>
                </InputGroup>
                </Form.Group>
          :''}

          </Col>
          </Row>
          <Col>
          <Row>
          <Form.Group>
            <Form.Label>Select TimeSlot</Form.Label>
            <InputGroup>
          <Form.Control
                  as="select"
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  value={selectedTimeSlot}

                >
                  <option value={-1}>Select TimeSlot</option>
                {timeSlots.map((t:any) => (

                <option key={t.id} value={t.id}>
                      {t.startTime.hour}.{t.startTime.minute} - {t.endTime.hour}.{t.endTime.minute}
                    </option>
                ))}


                </Form.Control>
                </InputGroup>
                </Form.Group>
          </Row>

          </Col>


        </>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeClickHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={() => saveBtnClickHandler()}>
         Create
        </Button>
      </Modal.Footer>
      </Modal>
    )

}
