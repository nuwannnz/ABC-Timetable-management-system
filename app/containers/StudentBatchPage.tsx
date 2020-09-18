/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, ListGroup } from 'react-bootstrap';
import StudentBatchDialog, {
  GroupType,
} from '../components/student-batch/StudentBatchDialog';
import Programme from '../entity/Programme';
import StudentBatch from '../entity/StudentBatch';

export default function StudentBatchPage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [studentBatchList, setStudentBatchList] = useState<StudentBatch[]>([]);
  const [
    studentBatchToUpdate,
    setStudentBatchToUpdate,
  ] = useState<Programme | null>(null);

  const loadStudents = async () => {
    const s = await StudentBatch.findAll({ include: Programme });
    console.log('loaded students ', s);
    setStudentBatchList([...s]);
  };

  const handleStudentDialogSubmit = (studentBatch: StudentBatch) => {
    if ((studentBatch as any).id) {
      // update
      StudentBatch.update(
        { ...studentBatch },
        { where: { id: (studentBatch as any).id } }
      )
        .then(() => {
          setDisplayDialog(false);
          setStudentBatchToUpdate(null);
          loadStudents();
          return true;
        })
        .catch((e) => console.log(e));
    } else {
      // create
      StudentBatch.create({ ...studentBatch })
        .then(() => {
          loadStudents();
          setDisplayDialog(false);
          return true;
        })
        .catch((e) => console.log(e));
    }
  };

  const handleStudentBatchDeleteClick = (batch: StudentBatch) => {
    if (confirm('Delete this student batch permanently?')) {
      StudentBatch.destroy({ where: { id: (batch as any).id } })
        .then(() => loadStudents())
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);
  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Student Batches</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Add new student batch
        </Button>
      </div>

      {studentBatchList.map((b: any) => (
        <Accordion key={b.id} className="mt-2">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between w-100">
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  {b.Programme.code} : Y{b.year}S{b.semester}
                </Accordion.Toggle>
                <div>
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setStudentBatchToUpdate(b);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      handleStudentBatchDeleteClick(b);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <ListGroup>
                {b.groups.map((g: GroupType) => {
                  return g.subGroups.length > 0 ? (
                    g.subGroups.map((s) => (
                      <ListGroup.Item key={s.id}>
                        {g.groupNumber}.{s.subGroupNumber}
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item key={g.id}>{g.groupNumber}</ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      ))}

      {displayDialog && (
        <StudentBatchDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setStudentBatchToUpdate(null);
          }}
          onSubmit={handleStudentDialogSubmit}
          studentBatch={studentBatchToUpdate}
        />
      )}
    </div>
  );
}
