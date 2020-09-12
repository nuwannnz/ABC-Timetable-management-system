/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';

export default function ToastMsg() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">Location Error</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Process is failed!</Toast.Body>
      </Toast>
    </div>
  );
}
