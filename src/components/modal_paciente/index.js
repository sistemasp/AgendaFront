import React from 'react';
import * as Yup from "yup";
import ModalFormPaciente from './ModalFormPaciente';
import { Formik } from 'formik';

const validationSchema = Yup.object({
  nombres: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos"),
  apellidos: Yup.string("Ingresa los apellidos")
        .required("Los nombres del pacientes son requeridos"),
  fecha_nacimiento: Yup.string("Ingresa la fecha de nacimiento")
        .required("Los nombres del pacientes son requeridos"),
  direccion: Yup.string("Ingresa la direccion")
        .required("Los nombres del pacientes son requeridos"),
  telefono: Yup.string("Ingresa el telefono")
        .required("Los nombres del pacientes son requeridos"),
});

const ModalPaciente = (props) => {
  const {
    open,
    onClose,
    paciente,
    onClickGuardar,
    onClickGuardarAgendar
  } = props;

  const values = {
    _id: paciente._id,
    nombres: paciente.nombres,
    apellidos: paciente.apellidos,
    fecha_nacimiento: paciente.fecha_nacimiento,
    direccion: paciente.direccion,
    telefono: paciente.telefono 
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormPaciente
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        paciente={paciente}
        onClickGuardar={onClickGuardar}
        onClickGuardarAgendar={onClickGuardarAgendar}
        {...props} />
      }
    </Formik>
  );
}

export default ModalPaciente;