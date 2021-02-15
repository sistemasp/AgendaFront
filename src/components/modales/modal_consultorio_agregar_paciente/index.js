import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import ModalFormConsultorioAgregarPaciente from './ModalFormConsultorioAgregarPaciente';
import {
  findConsultById,
  updateConsult,
} from '../../../services/consultas';
import { addZero } from '../../../utils/utils';
import { findSurgeryBySucursalIdAndFree, updateSurgery } from '../../../services/consultorios';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalConsultorioAgregarPaciente = (props) => {
  const {
    open,
    onClose,
    tipo_servicio,
    servicio,
    setOpenAlert,
    setMessage,
    loadAll,
    sucursal,
    cambio,
    paciente,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [consultorios, setConsultorios] = useState([]);

  const [values, setValues] = useState({
  });

  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

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

    const responseServicio = await findConsultById(servicio);
    if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consulta = responseServicio.data;
      if (!cambio) {
        const dateNow = new Date();
        let updateConsulta = consulta;
        updateConsulta.status = enConsultorioStatusId;
        updateConsulta.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
        updateConsulta.dermatologo = values.consultorio.dermatologo;
        await updateConsult(consulta._id, updateConsulta);
      } else {
        const updateConsulta = consulta;
        updateConsulta.dermatologo = values.consultorio.dermatologo;
        await updateConsult(consulta._id, updateConsulta);
      }

      setValues({ consultorio: { paciente: consulta.paciente._id } });
      let consul = values.consultorio;
      consul.consulta = consulta._id;
      consul.paciente = paciente._id;
      consul.tipo_servicio = tipo_servicio;
      consul.servicio = servicio;
      consul.disponible = false;

      const response = await updateSurgery(consul._id, consul);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setOpenAlert(true);
        setMessage('EL PACIENTE ENTRO AL CONSULTORIO');
      }
    }

    onClose();
    await loadAll();
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
        props => <ModalFormConsultorioAgregarPaciente
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