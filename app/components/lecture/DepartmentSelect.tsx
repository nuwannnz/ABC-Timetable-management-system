import React, { useState, useEffect } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import Department from '../../entity/Department';

type DepartmentSelectPropType = {
  selectedDepartmentId?: number;
  onDepartmentSelected: (facultyId: number) => void;
};

export default function DepartmentSelect({
  onDepartmentSelected,
  selectedDepartmentId,
}: DepartmentSelectPropType) {
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    selectedDepartmentId
  );
  const [newDepartmentText, setNewDepartmentText] = useState('');

  const loadData = () => {
    Department.findAll()
      .then((result) => setDepartmentList(result))
      .catch(() => console.log('failed to load faculties'));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    onDepartmentSelected(selectedDepartmentId as number);
  }, [selectedDepartmentId]);

  const addNewFacultyClickHandler = () => {
    Department.create({ name: newDepartmentText })
      .then(() => {
        loadData();
        setNewDepartmentText('');
        return true;
      })
      .catch(() => console.log('Failed to add department'));
  };

  return (
    <>
      <Form.Group controlId="faculty">
        <Form.Label>Department</Form.Label>
        <Form.Control
          as="select"
          onChange={(e) => setSelectedDepartment(parseInt(e.target.value, 10))}
          value={selectedDepartment}
        >
          {departmentList.map((f: any) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Form.Control>
        <Form.Text muted className="mt-2">
          Add new department
        </Form.Text>
        <InputGroup className="mt-1">
          <FormControl
            placeholder="New department name"
            size="sm"
            value={newDepartmentText}
            onChange={(e) => setNewDepartmentText(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              size="sm"
              onClick={addNewFacultyClickHandler}
              variant="outline-secondary"
              disabled={newDepartmentText.length === 0}
            >
              +
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </>
  );
}
