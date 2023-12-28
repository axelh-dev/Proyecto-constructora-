import React from 'react';
import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DialogModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}
    style={{ zIndex: 9999,
            color: "darkblue"
    }}
    className='modal-dialog modal-dialog-centered'
    >
      <Modal.Header closeButton>
        <Modal.Title>Éxito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Archivo eliminado exitosamente.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DialogModal;
