import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import ModalFormConsultorioAgregarMedico from './ModalFormConsultorioAgregarMedico';
import { findEmployeesByRolIdAvailable, updateSurgery, updateEmployee } from '../../../services';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalConsultorioAgregarMedico = (props) => {
  const {
    open,
    onClose,
    consultorio,
    setOpenAlert,
    setMessage,
    loadConsultorios,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [medicos, setMedicos] = useState([]);

  const [values, setValues] = useState({
    _id: consultorio._id,
    nombre: consultorio.nombre
  });

  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;

  useEffect(() => {
    const loadMedicos = async () => {
      const response = await findEmployeesByRolIdAvailable(medicoRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMedicos(response.data);
      }
      setIsLoading(false);
    }

    loadMedicos();
  }, [medicoRolId]);

  const handleClickGuardar = async (event, rowData) => {
    values.medico.disponible = false;
    await updateEmployee(values.medico._id, values.medico);
    values.disponible = true;
    const response = await updateSurgery(values._id, values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOpenAlert(true);
      setMessage('El medico se agrego al consultorio correctamente');
      onClose();
      await loadConsultorios();
    }

  }

  const handleChangeMedicos = (event) => {
    setValues({ ...values, medico: event.target.value });
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormConsultorioAgregarMedico
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClickCancel={onClose}
          consultorio={consultorio}
          onClickGuardar={handleClickGuardar}
          isLoading={isLoading}
          medicos={medicos}
          onChangeMedicos={(e) => handleChangeMedicos(e)}
          {...props} />
      }
    </Formik>
  );
}

export default ModalConsultorioAgregarMedico;