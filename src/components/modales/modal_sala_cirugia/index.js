import React from 'react';
import * as Yup from "yup";
import ModalFormSalaCirugia from './ModalFormSalaCirugia';
import { Formik } from 'formik';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos")
});

const ModalSalaCirugia = (props) => {
  const {
    open,
    onClose,
    salaCirugia,
    handleClickGuardar,
  } = props;

  const values = {
    _id: salaCirugia._id,
    nombre: salaCirugia.nombre
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormSalaCirugia
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        salaCirugia={salaCirugia}
        onClickGuardar={handleClickGuardar}
        {...props} />
      }
    </Formik>
  );
}

export default ModalSalaCirugia;