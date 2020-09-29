import React from 'react';
import * as Yup from "yup";
import ModalFormCabina from './ModalFormCabina';
import { Formik } from 'formik';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos")
});

const ModalCabina = (props) => {
  const {
    open,
    onClose,
    cabina,
    handleClickGuardar,
  } = props;

  const values = {
    _id: cabina._id,
    nombre: cabina.nombre
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormCabina
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        cabina={cabina}
        onClickGuardar={handleClickGuardar}
        {...props} />
      }
    </Formik>
  );
}

export default ModalCabina;