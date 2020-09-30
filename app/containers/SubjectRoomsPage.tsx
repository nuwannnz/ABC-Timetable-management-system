/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import SubjectRoomsDialog from '../components/subject/SubjectRoomsDialog';
import Room from '../entity/Room';
import Subject from '../entity/Subject';

export default function SubjectRoomsPage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [subjectToUpdate, setSubjectToUpdate] = useState<Subject | null>(null);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);

  const loadSubjects = async () => {
    const subjects = await Subject.findAll({ include: Room });
    setSubjectList([...subjects]);
  };

  const handleSubjectDeleteClick = (subject: Subject) => {
    if (confirm('Remove all rooms related  to this subject?')) {
      (async () => {
        await (subject as any).removeRooms(subject.get().Rooms);
        loadSubjects();
      })();
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Prefered Subject Rooms</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Add Prefered Subject Rooms
        </Button>
      </div>

      <div className="d-flex">
        {subjectList
          .filter((s) => s.get().Rooms.length > 0)
          .map((s) => (
            <Card key={s.get().id} className="mr-3">
              <Card.Header>
                <h3>
                  <Badge variant="warning">{s.get().name}</Badge>
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="d-flex mt-2">
                  {s.get().Rooms.map((r: any) => (
                    <h6 key={r.get().id}>
                      <Badge className="mr-2" variant="info">
                        {r.get().name}
                      </Badge>
                    </h6>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex float-right">
                  <Button
                    className="mr-1"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSubjectToUpdate(s);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleSubjectDeleteClick(s)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          ))}
      </div>

      {displayDialog && (
        <SubjectRoomsDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setSubjectToUpdate(null);
          }}
          onSubmit={() => {
            setDisplayDialog(false);
            loadSubjects();
          }}
          subject={subjectToUpdate}
        />
      )}
    </div>
  );
}
