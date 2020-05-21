import React from 'react';
import * as Yup from "yup";
import ModalFormConsultorio from './ModalFormConsultorio';
import { createSurgery } from '../../services';
import { Formik } from 'formik';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos")
});

const ModalConsultorio = (props) => {
  const {
    open,
    onClose,
    consultorio,
    handleClickGuardar,
  } = props;

  const values = {
    _id: consultorio._id,
    nombre: consultorio.nombre
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormConsultorio
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        consultorio={consultorio}
        onClickGuardar={handleClickGuardar}
        {...props} />
      }
    </Formik>
  );
}

export default ModalConsultorio;