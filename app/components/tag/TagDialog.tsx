/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Tag from '../../entity/Tag';

type TagDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  tag?: Tag | null;
  onSubmit: (tag: any) => void;
};

export default function TagDialog({
  closeClickHandler,
  show,
  tag,
  onSubmit,
}: TagDialogProps) {
  const [name, setName] = useState(tag ? (tag as any).name : '');

  const [errorMsg, setErrorMsg] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    if (name.length === 0) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('Tag name is required');
      return;
    }

    const tagDao = {
      id: tag ? (tag as any).id : null,
      name,
    };
    onSubmit(tagDao);
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{tag ? 'Update' : 'Add'} Tag</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="tagName">
                <Form.Label>Tag name</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter tag name here"
                />
              </Form.Group>
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
          {tag ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
