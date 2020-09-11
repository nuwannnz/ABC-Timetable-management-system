import React, { useState, useEffect } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import Faculty from '../../entity/Faculty';

type FacultySelectPropType = {
  selectedFacultyId?: number;
  onFacultySelected: (facultyId: number) => void;
};

export default function FacultySelect({
  onFacultySelected,
  selectedFacultyId,
}: FacultySelectPropType) {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState(selectedFacultyId);
  const [newFacultyText, setNewFacultyText] = useState('');

  const loadData = () => {
    Faculty.findAll()
      .then((result) => setFacultyList(result))
      .catch(() => console.log('failed to load faculties'));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    onFacultySelected(selectedFacultyId as number);
  }, [selectedFacultyId]);

  const addNewFacultyClickHandler = () => {
    Faculty.create({ name: newFacultyText })
      .then(() => {
        loadData();
        setNewFacultyText('');
        return true;
      })
      .catch(() => console.log('Failed to add faculty'));
  };

  return (
    <>
      <Form.Group controlId="faculty">
        <Form.Label>Faculty</Form.Label>
        <Form.Control
          as="select"
          onChange={(e) => setSelectedFaculty(parseInt(e.target.value, 10))}
          value={selectedFaculty}
        >
          {facultyList.map((f: any) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Form.Control>
        <Form.Text muted className="mt-2">
          Add new faculty
        </Form.Text>
        <InputGroup className="mt-1">
          <FormControl
            placeholder="New Faculty name"
            size="sm"
            value={newFacultyText}
            onChange={(e) => setNewFacultyText(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              size="sm"
              onClick={addNewFacultyClickHandler}
              variant="outline-secondary"
              disabled={newFacultyText.length === 0}
            >
              +
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </>
  );
}
