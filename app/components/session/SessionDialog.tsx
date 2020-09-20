/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Lecture from '../../entity/Lecture';
import Programme from '../../entity/Programme';
import Session from '../../entity/Session';
import StudentBatch from '../../entity/StudentBatch';
import Subject from '../../entity/Subject';
import Tag from '../../entity/Tag';
import { GroupType, SubGroupType } from '../student-batch/StudentBatchDialog';

type SessionDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  session?: Session | null;
  onSubmit: () => void;
};

type GroupListItemType = {
  batchId: number;
  year: number;
  semester: number;
  groupId: string;
  programmeCode: string;
  groupNumber: number;
  subgroups: SubGroupType[];
};

type ChipPropType = {
  id: number;
  text: string;
  removeClickHandler: (id: number) => void;
};
const Chip = ({ id, removeClickHandler, text }: ChipPropType) => (
  <Button variant="info" size="sm" className="m-2">
    {text}
    <Badge
      variant="light"
      className="ml-2"
      onClick={() => removeClickHandler(id)}
    >
      X
    </Badge>
  </Button>
);

export default function SessionDialog({
  closeClickHandler,
  show,
  session,
  onSubmit,
}: SessionDialogProps) {
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [batchList, setBatchList] = useState<StudentBatch[]>([]);
  const [groupList, setGroupList] = useState<GroupListItemType[]>([]);

  const [selectedLectures, setSelectedLectures] = useState<Lecture[]>(
    session ? (session as any).profiles : []
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    session ? (session as any).tags : []
  );
  const [selectedSubject, setSelectedSubject] = useState(
    session ? (session as any).SubjectId : -1
  );

  const [selectedBatch, setSelectedBatch] = useState<StudentBatch | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);

  const [selectedSubGroup, setSelectedSubGroup] = useState<SubGroupType | null>(
    null
  );

  const [hours, setHours] = useState(
    session ? (session as any).durationHours : 0
  );

  const [minutes, setMinutes] = useState(
    session ? (session as any).durationMinutes : 0
  );

  const [studentCount, setStudentCount] = useState(
    session ? (session as any).studentCount : 0
  );

  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLectureList(await Lecture.findAll());
    setSubjectList(await Subject.findAll());
    setTagList(await Tag.findAll());

    StudentBatch.findAll({ include: [Programme] })
      .then((batches) => {
        setBatchList(batches);
        return true;
      })
      .catch((e) => console.log('Failed to load student batches'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const validate = (): boolean => {
    let isValid = true;
    if (
      selectedLectures.length === 0 ||
      selectedTags.length === 0 ||
      selectedSubject === -1 ||
      hours === 0 ||
      selectedBatch === null ||
      selectedGroup === null ||
      studentCount === 0
    ) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('All the fields are required');
      return;
    }

    const sessionDao = {
      id: session ? (session as any).id : null,
      studentCount,
      durationHours: hours,
      durationMinutes: minutes,
      groupId: selectedSubGroup ? selectedSubGroup.id : selectedGroup?.id,
      SubjectId: selectedSubject,
      StudentBatchId: (selectedBatch as any).id,
    };

    if (sessionDao.id) {
      // update
      Session.update({ ...sessionDao }, { where: { id: sessionDao.id } })
        .then(() => {
          Session.findOne({
            where: { id: sessionDao.id },
            include: [Lecture, Tag],
          })
            .then((updatedSession) => {
              (updatedSession as any).lectures.forEach((l: any) =>
                (updatedSession as any).removeLecture(l)
              );
              (updatedSession as any).tags.forEach((t: any) =>
                (updatedSession as any).removeTag(t)
              );

              (updatedSession as any).addLectures(selectedLectures);
              (updatedSession as any).addTags(selectedTags);
              return true;
            })
            .catch((e) => {});
          return true;
        })
        .catch((e) => {});
    } else {
      // create
      Session.create({ ...sessionDao })
        .then((createdSession) => {
          (createdSession as any).addLectures(selectedLectures);
          (createdSession as any).addTags(selectedTags);
        })
        .catch((e) => console.log(e));
    }

    onSubmit();
  };

  const handleLectureSelected = (lectureId: number) => {
    const lecture = lectureList.find((l: any) => l.id === lectureId) as Lecture;
    setSelectedLectures([...selectedLectures, lecture]);
  };

  const handleTagSelected = (tagId: number) => {
    const tag = tagList.find((t: any) => t.id === tagId) as Tag;
    setSelectedTags([...selectedTags, tag]);
  };

  const handleLectureDeSelected = (lectureId: number) => {
    setSelectedLectures([
      ...selectedLectures.filter((l: any) => l.id !== lectureId),
    ]);
  };

  const handleTagDeSelected = (tagId: number) => {
    setSelectedTags([...selectedTags.filter((t: any) => t.id !== tagId)]);
  };

  const handleStudentBatchSelected = (batchId: number) => {
    setSelectedBatch(
      batchList.find((b: any) => b.id === batchId) as StudentBatch
    );
    setSelectedGroup(null);
  };

  const handleGroupSelected = (groupId: string) => {
    const group = (selectedBatch as any).groups.find(
      (g: any) => g.id === groupId
    );
    setSelectedGroup({ ...group });
  };

  const handleSubGroupSelected = (subGroupId: string) => {
    const subGroup = selectedGroup?.subGroups.find(
      (s) => s.id === subGroupId
    ) as SubGroupType;
    setSelectedSubGroup(subGroup);
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{session ? 'Update' : 'Add'} Session</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Select Lectures</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    handleLectureSelected(parseInt(e.target.value, 10));
                  }}
                >
                  <option value={-1}>Select lectures</option>
                  {lectureList
                    .filter(
                      (l: any) =>
                        !selectedLectures.map((sl: any) => sl.id).includes(l.id)
                    )
                    .map((l: any) => (
                      <option key={l.id} value={l.id}>
                        {l.fName} {l.lName}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              {selectedLectures.map((l: any) => (
                <Chip
                  key={l.id}
                  id={l.id}
                  removeClickHandler={handleLectureDeSelected}
                  text={`${l.fName} ${l.lName}`}
                />
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Select Tags</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    handleTagSelected(parseInt(e.target.value, 10));
                  }}
                >
                  <option value={-1}>Select tags</option>
                  {tagList
                    .filter(
                      (t: any) =>
                        !selectedTags.map((st: any) => st.id).includes(t.id)
                    )
                    .map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              {selectedTags.map((t: any) => (
                <Chip
                  key={t.id}
                  id={t.id}
                  removeClickHandler={handleTagDeSelected}
                  text={t.name}
                />
              ))}
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Select Batch</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    handleStudentBatchSelected(parseInt(e.target.value, 10));
                  }}
                >
                  <option value={-1}>Select a batch</option>
                  {batchList.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      Y{b.year}.S{b.semester}.{b.Programme.code}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Select Group</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    handleGroupSelected(e.target.value);
                  }}
                >
                  <option value={-1}>
                    {selectedBatch ? 'Select a group' : 'Select a batch first'}
                  </option>
                  {selectedBatch &&
                    (selectedBatch as any).groups.map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.groupNumber}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Select a sub group</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    handleSubGroupSelected(e.target.value);
                  }}
                >
                  <option value={-1}>
                    {selectedGroup
                      ? 'Select a group first'
                      : 'Select Sub Group'}
                  </option>
                  {selectedGroup &&
                    selectedGroup.subGroups.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.subGroupNumber}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Select Subject</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    setSelectedSubject(parseInt(e.target.value, 10));
                  }}
                >
                  <option value={-1}>Select a subject</option>
                  {subjectList.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Form.Label>Select time duration</Form.Label>
                    </Col>
                  </Row>
                  <Form.Group controlId="tagName">
                    <Form.Label>Hours</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={(e) => {
                        setHours(parseInt(e.target.value, 10));
                      }}
                    >
                      {[...Array(5).keys()].map((h: any) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Row>
                    <></>
                  </Row>
                  <Form.Group controlId="tagName">
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={(e) => {
                        setMinutes(parseInt(e.target.value, 10));
                      }}
                    >
                      {[...Array(59).keys()].map((m: any) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Number of students</Form.Label>
                <Form.Control
                  type="number"
                  value={studentCount}
                  onChange={(e) => {
                    setStudentCount(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <></>
            </Col>
          </Row>
          <Row>
            <Col>
              {errorMsg.length > 0 && (
                <Alert variant="danger">{errorMsg}</Alert>
              )}
            </Col>
          </Row>
        </>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeClickHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={() => saveBtnClickHandler()}>
          {session ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
