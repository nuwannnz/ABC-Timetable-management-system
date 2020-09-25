import React, { useState, useEffect } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import Center from '../../entity/Center';

type CenterSelectPropType = {
  selectedCenterId?: number;
  onCenterSelected: (facultyId: number) => void;
};

export default function CenterSelect({
  onCenterSelected,
  selectedCenterId,
}: CenterSelectPropType) {
  const [CenterList, setCenterList] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState(selectedCenterId);
  const [newCenterText, setNewCenterText] = useState('');

  const loadData = () => {
    Center.findAll()
      .then((result) => setCenterList(result))
      .catch(() => console.log('failed to load centers'));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    onCenterSelected(selectedCenter as number);
  }, [selectedCenter]);

  const addNewCenterClickHandler = () => {
    Center.create({ name: newCenterText })
      .then(() => {
        loadData();
        setNewCenterText('');
        return true;
      })
      .catch(() => console.log('Failed to add Center'));
  };

  return (
    <>
      <Form.Group controlId="faculty">
        <Form.Label>Center</Form.Label>
        <Form.Control
          as="select"
          onChange={(e) => setSelectedCenter(parseInt(e.target.value, 10))}
          value={selectedCenter}
        >
          <option value={-1}>Select a center</option>

          {CenterList.map((f: any) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Form.Control>
        <Form.Text muted className="mt-2">
          Add new Center
        </Form.Text>
        <InputGroup className="mt-1">
          <FormControl
            placeholder="New Center name"
            size="sm"
            value={newCenterText}
            onChange={(e) => setNewCenterText(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              size="sm"
              onClick={addNewCenterClickHandler}
              variant="outline-secondary"
              disabled={newCenterText.length === 0}
            >
              +
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </>
  );
}
