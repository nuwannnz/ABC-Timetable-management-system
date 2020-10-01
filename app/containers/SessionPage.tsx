/* eslint-disable no-restricted-globals */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import SessionDialog from '../components/session/SessionDialog';
import Room from '../entity/Room';
import Session from '../entity/Session';
import { formatTime } from '../utils/formatters';

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

  const loadSessions = async () => {
    const s = await Session.findAll({
      include: [{ all: true, nested: true }],
    });
    setSessionList(s);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSessionDelete = (session: any) => {
    if (confirm('Delete this session permanently?')) {
      Session.destroy({ where: { id: session.id } }).then(() => loadSessions());
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
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

      {sessionList.map((s: any) => (
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
