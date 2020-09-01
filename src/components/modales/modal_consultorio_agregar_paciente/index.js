import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import ModalFormConsultorioAgregarMedico from './ModalFormConsultorioAgregarMedico';
import { findEmployeesByRolId, updateSurgery, findSurgeryBySucursalIdAndFree, updateConsult } from '../../../services';
import { addZero } from '../../../utils/utils';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalConsultorioAgregarPaciente = (props) => {
  const {
    open,
    onClose,
    consulta,
    setOpenAlert,
    setMessage,
    loadListaEspera,
    loadConsultorios,
    sucursal,
    cambio,
    paciente,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [consultorios, setConsultorios] = useState([]);

  const [values, setValues] = useState({
  });

  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  useEffect(() => {
    const loadConsultoriosDisponibles = async () => {
      const response = await findSurgeryBySucursalIdAndFree(sucursal);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setConsultorios(response.data);
      }
    }

    loadConsultoriosDisponibles();
    setIsLoading(false);

  }, [sucursal]);

  const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);

    if (!cambio) {
      const dateNow = new Date();
      let updateConsulta = consulta;
      updateConsulta.status = enConsultorioStatusId;
      updateConsulta.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      updateConsulta.medico = values.consultorio.medico;
      await updateConsult(consulta._id, updateConsulta);
    }

    setValues({ consultorio: { paciente: consulta.paciente._id } });
    let consul = values.consultorio;
    consul.consulta = consulta._id;
    consul.paciente = paciente._id;
    consul.disponible = false;

    const response = await updateSurgery(consul._id, consul);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOpenAlert(true);
      setMessage('El paciente se agrego al consultorio correctamente');
    }
    onClose();
    await loadListaEspera();
    await loadConsultorios();
    setIsLoading(false);
  }

  const handleChangeConsultorio = (event) => {
    setValues({ consultorio: event.target.value });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormConsultorioAgregarMedico
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClickCancel={onClose}
          onClickGuardar={handleClickGuardar}
          isLoading={isLoading}
          consultorios={consultorios}
          onChangeConsultorio={(e) => handleChangeConsultorio(e)}
          cambio={cambio}
          paciente={paciente}
          {...props} />
      }
    </Formik>
  );
}

export default ModalConsultorioAgregarPaciente;