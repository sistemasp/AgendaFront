import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import ModalFormPaciente from './ModalFormPaciente';
import {
  showAllSexos,
} from "../../../services";

import { Formik } from 'formik';

const validationSchema = Yup.object({
  nombres: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  apellidos: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  telefono: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos")
    .min(8)
});

const ModalPaciente = (props) => {
  const {
    open,
    onClose,
    paciente,
    onClickGuardar,
    onClickGuardarAgendar
  } = props;

  const [sexos, setSexos] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const values = {
    _id: paciente._id,
    nombres: paciente.nombres,
    apellidos: paciente.apellidos,
    telefono: paciente.telefono,
    sexo: paciente.sexo,
  }

  const dataComplete = !values.nombres || !values.apellidos
    || !values.sexo || !values.telefono;

  console.log("VALUES", values);
  console.log("dataComplete", dataComplete);

  useEffect(() => {

    const loadSexos = async () => {
      const response = await showAllSexos();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setSexos(response.data);
      }
      setIsLoading(false);
    }

    setIsLoading(true);
    loadSexos();
  }, []);

  const handleChangeSexo = (e) => {
    values.sexo = e.target.value;
  }

  return (
    <Formik
      enableReinitialize
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
          dataComplete={dataComplete}
          onChangeSexo={handleChangeSexo}
          sexos={sexos}
          {...props} />
      }
    </Formik>
  );
}

export default ModalPaciente;