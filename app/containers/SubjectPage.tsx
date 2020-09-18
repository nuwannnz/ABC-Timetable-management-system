/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Subject from '../entity/Subject';
import SubjectDialog from '../components/subject/SubjectDialog';

export default function SubjectPage() {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [subjectToUpdate, setSubjectToUpdate] = useState(null);

  const loadSubjects = () => {
    Subject.findAll()
      .then((result) => setSubjectList([...result]))
      .catch((e) => {
        console.log('Failed to load subjects');
      });
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const subjectDialogSubmitHandler = (subjectDao: any) => {
    if (subjectDao.id) {
      // update
      Subject.update({ ...subjectDao }, { where: { id: subjectDao.id } })
        .then(() => {
          setDisplayDialog(false);
          setSubjectToUpdate(null);
          loadSubjects();
          return true;
        })
        .catch((e) => alert('Failed to update subject'));
    } else {
      // create
      Subject.create({ ...subjectDao })
        .then(() => {
          setDisplayDialog(false);
          loadSubjects();
          return true;
        })
        .catch((e) => alert('Failed to create subject '));
    }
  };

  const deleteSubjectHandler = (subjectId: number) => {
    if (!confirm('Delete this subject permanently?')) {
      return;
    }
    Subject.destroy({
      where: {
        id: subjectId,
      },
    })
      .then(() => loadSubjects())
      .catch((e) => alert('Failed to delete subeject'));
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Subjects</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Add new subject
        </Button>
      </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Lecture hours</th>
              <th>Tutorial hours</th>
              <th>Lab hours</th>
              <th>Evaluation hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjectList.map((s: any) => (
              <tr key={s.id}>
                <td>{s.code}</td>
                <td>{s.name}</td>
                <td>{s.lectureHours}</td>
                <td>{s.tutorialHours}</td>
                <td>{s.labHours}</td>
                <td>{s.evaluationHours}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      className="mr-1"
                      variant="info"
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
                      onClick={() => deleteSubjectHandler(s.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {displayDialog && (
        <SubjectDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setSubjectToUpdate(null);
          }}
          onSubmit={subjectDialogSubmitHandler}
          subject={subjectToUpdate}
        />
      )}
    </div>
  );
}
