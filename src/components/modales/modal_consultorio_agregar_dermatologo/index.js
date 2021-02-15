import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import ModalFormConsultorioAgregarDermatologo from './ModalFormConsultorioAgregarDermatologo';
import { updateSurgery } from '../../../services/consultorios';
import { findEmployeesByRolIdAvailable, updateEmployee } from '../../../services';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalConsultorioAgregarDermatologo = (props) => {
  const {
    open,
    onClose,
    consultorio,
    setOpenAlert,
    setMessage,
    loadConsultorios,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [dermatologos, setDermatologos] = useState([]);

  const [values, setValues] = useState({
    _id: consultorio._id,
    nombre: consultorio.nombre
  });

  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;

  useEffect(() => {
    const loadDermatologos = async () => {
      const response = await findEmployeesByRolIdAvailable(dermatologoRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setDermatologos(response.data);
      }
      setIsLoading(false);
    }

    loadDermatologos();
  }, [dermatologoRolId]);

  const handleClickGuardar = async (event, rowData) => {
    values.dermatologo.disponible = false;
    await updateEmployee(values.dermatologo._id, values.dermatologo);
    values.disponible = true;
    const response = await updateSurgery(values._id, values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOpenAlert(true);
      setMessage('El dermatologo se agrego al consultorio correctamente');
      onClose();
      await loadConsultorios();
    }

  }

  const handleChangeDermatologos = (event) => {
    setValues({ ...values, dermatologo: event.target.value });
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormConsultorioAgregarDermatologo
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClickCancel={onClose}
          consultorio={consultorio}
          onClickGuardar={handleClickGuardar}
          isLoading={isLoading}
          dermatologos={dermatologos}
          onChangeDermatologos={(e) => handleChangeDermatologos(e)}
          {...props} />
      }
    </Formik>
  );
}

export default ModalConsultorioAgregarDermatologo;