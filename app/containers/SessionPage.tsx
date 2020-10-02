/* eslint-disable no-restricted-globals */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Row,
  ToggleButton,
} from 'react-bootstrap';
import SessionDialog from '../components/session/SessionDialog';
import Room from '../entity/Room';
import Lecture from '../entity/Lecture';
import Session from '../entity/Session';
import { formatTime } from '../utils/formatters';
import Subject from '../entity/Subject';
import Tag from '../entity/Tag';

type SessionCardPropType = {
  session: Session;
  onEditClick: (session: Session) => void;
  onDeleteClick: (session: Session) => void;
};
const SessionCard = ({
  session,
  onEditClick,
  onDeleteClick,
}: SessionCardPropType) => {
  const getGroup = () => {
    let group = null;
    let subGroup = null;

    const idToMatch = (session as any).groupId;
    // group must be sub group
    const groups = (session as any).StudentBatch.groups;

    for (let i = 0; i < groups.length; i++) {
      const mainGroup = groups[i];
      if (mainGroup.id === idToMatch) {
        group = mainGroup;
        break;
      }
      for (let k = 0; k < mainGroup.subGroups.length; k++) {
        const subGroupElement = mainGroup.subGroups[k];
        if (subGroupElement.id === idToMatch) {
          subGroup = subGroupElement;
          break;
        }
      }
    }

    const s = session as any;
    const batch = s.StudentBatch;
    if (group) {
      return `Y${batch.year}.S${batch.semester}.${
        batch.Programme.code
      }.${formatTime(group.groupNumber)}`;
    } else if (subGroup) {
      return `Y${batch.year}.S${batch.semester}.${
        batch.Programme.code
      }.${formatTime(subGroup.groupNumber)}.${formatTime(
        subGroup.subGroupNumber
      )}`;
    } else {
      return '';
    }
  };

  const getLectureString = () => {
    let str = '';
    const s = session as any;
    for (let i = 0; i < s.Lectures.length; i++) {
      const l = s.Lectures[i];
      str = `${str} ${l.fName} ${l.lName}`;
      if (i + 1 < s.Lectures.length) {
        str = `${str},`;
      }
    }
    return str;
  };

  const getTags = () => {
    const s = session as any;
    return s.Tags.map((t: any) => (
      <Badge key={t.id} className="mr-1" variant="warning">
        {t.name}
      </Badge>
    ));
  };

  return (
    <Card className="mt-2">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            {(session as any).Subject.name} ({(session as any).Subject.code})
          </span>
          <div className="d-flex align-items-center">
            <Button
              className="mr-1"
              size="sm"
              variant="info"
              onClick={() => onEditClick(session)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDeleteClick(session)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{getLectureString()}</Card.Title>
        <Card.Text className="text-muted">
          {getTags()}
          <br />
          <span className="mt-2 d-block">{getGroup()}</span>
          {(session as any).studentCount}({(session as any).durationHours})
          <div>
            {(session as any).Rooms.map((r: any, i: number) => (
              <span key={r.get().id}>
                {r.get().name}
                {i < (session as any).Rooms.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default function SessionPage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [sessionToUpdate, setSessionToUpdate] = useState<Session | null>(null);
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [displayFilters, setDisplayFilters] = useState(false);

  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);

  const [filterLectureId, setFilterLectureId] = useState<number>(-1);
  const [filterSubjectId, setFilterSubjectId] = useState<number>(-1);
  const [filterTagId, setFilterTagId] = useState<number>(-1);

  const loadSessions = async () => {
    const s = await Session.findAll({
      include: [{ all: true, nested: true }],
    });
    setSessionList(s);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    (async () => {
      setLectureList(await Lecture.findAll());
      setSubjectList(await Subject.findAll());
      setTagList(await Tag.findAll());
    })();
  }, []);

  const handleSessionDelete = (session: any) => {
    if (confirm('Delete this session permanently?')) {
      Session.destroy({ where: { id: session.id } }).then(() => loadSessions());
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <h2>Sessions</h2>

            <Button
              onClick={() => setDisplayDialog(!displayDialog)}
              className="ml-3"
              size="sm"
              variant="primary"
            >
              Add new session
            </Button>
          </div>
          <ButtonGroup toggle>
            <ToggleButton
              type="checkbox"
              size="sm"
              variant="outline-secondary"
              checked={displayFilters}
              value="1"
              onChange={(e) => setDisplayFilters(e.currentTarget.checked)}
            >
              <i className="fas fa-filter">
                <></>
              </i>
              <span className="ml-2">Filter sessions</span>
            </ToggleButton>
          </ButtonGroup>
        </div>
      </div>
      {displayFilters && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <Form.Group>
              <Form.Label>Lectures</Form.Label>
              <Form.Control
                as="select"
                value={filterLectureId}
                onChange={(e) => {
                  setFilterLectureId(parseInt(e.target.value, 10));
                }}
              >
                <option value={-1}>Select a lecture</option>
                {lectureList.map((l) => (
                  <option key={l.get().id} value={l.get().id}>
                    {l.get().fName} {l.get().lName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="ml-4">
              <Form.Label>Subjects</Form.Label>
              <Form.Control
                as="select"
                value={filterSubjectId}
                onChange={(e) => {
                  setFilterSubjectId(parseInt(e.target.value, 10));
                }}
              >
                <option value={-1}>Select a subject</option>
                {subjectList.map((s) => (
                  <option key={s.get().id} value={s.get().id}>
                    {s.get().name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="ml-4">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                as="select"
                value={filterTagId}
                onChange={(e) => {
                  setFilterTagId(parseInt(e.target.value, 10));
                }}
              >
                <option value={-1}>Select a tag</option>
                {tagList.map((t) => (
                  <option key={t.get().id} value={t.get().id}>
                    {t.get().name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>

          <Button
            variant="light"
            size="sm"
            onClick={() => {
              setFilterLectureId(-1);
              setFilterTagId(-1);
              setFilterSubjectId(-1);
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {sessionList
        .filter((s) => {
          if (filterLectureId !== -1) {
            return s
              .get()
              .Lectures.map((l: any) => l.get().id)
              .includes(filterLectureId);
          }
          return true;
        })
        .filter((s) => {
          if (filterTagId !== -1) {
            return s
              .get()
              .Tags.map((t: any) => t.get().id)
              .includes(filterTagId);
          }
          return true;
        })
        .filter((s) => {
          if (filterSubjectId !== -1) {
            return s.get().Subject.get().id === filterSubjectId;
          }
          return true;
        })
        .map((s: any) => (
          <SessionCard
            key={s.id}
            session={s}
            onDeleteClick={(ses: any) => {
              handleSessionDelete(ses);
            }}
            onEditClick={(ses: any) => {
              setSessionToUpdate(ses);
              setDisplayDialog(true);
            }}
          />
        ))}
      {displayDialog && (
        <SessionDialog
          session={sessionToUpdate}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setSessionToUpdate(null);
          }}
          show={displayDialog}
          onSubmit={() => {
            loadSessions();
            setDisplayDialog(false);
          }}
        />
      )}
    </div>
  );
}
