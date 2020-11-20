import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  findCabinaBySucursalIdAndFree,
  updateCabina,
} from '../../../services';
import { findFacialById, updateFacial } from '../../../services/faciales';
import { findLaserById, updateLaser } from '../../../services/laser';
import { findAparatologiaById, updateAparatologia } from '../../../services/aparatolgia';
import { addZero } from '../../../utils/utils';
import ModalFormCabinaAgregarPaciente from './ModalFormCabinaAgregarPaciente';
import { findDermapenById, updateDermapen } from '../../../services/dermapens';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalCabinaAgregarPaciente = (props) => {
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
  const [cabinas, setCabinas] = useState([]);
  //const [consulta, setConsulta] = useState();
  //const [cita, setCita] = useState();

  const [values, setValues] = useState({
  });

  const enCabinaStatusId = process.env.REACT_APP_EN_CABINA_STATUS_ID;
  const facialServicioId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const laserServicioId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const aparatologiaServicioId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const dermapenServicioId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;

  useEffect(() => {
    const loadCabinasDisponibles = async () => {
      const response = await findCabinaBySucursalIdAndFree(sucursal);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setCabinas(response.data);
      }
    }

    loadCabinasDisponibles();
    setIsLoading(false);

  }, [sucursal]);

  const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);
    let responseCita;
    switch (tipo_servicio) {
      case facialServicioId:
        responseCita = await findFacialById(servicio);
        break;
      case dermapenServicioId:
        responseCita = await findDermapenById(servicio);
        break;
      case laserServicioId:
        responseCita = await findLaserById(servicio);
        break;
      case aparatologiaServicioId:
        responseCita = await findAparatologiaById(servicio);
        break;
    }

    if (`${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const cita = responseCita.data;
      if (!cambio) {
        const dateNow = new Date();
        let updateCita = cita;
        updateCita.status = enCabinaStatusId;
        updateCita.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
        updateCita.cosmetologa = values.cabina.cosmetologa;
        switch (tipo_servicio) {
          case facialServicioId:
            responseCita = await updateFacial(cita._id, updateCita);
            break;
          case dermapenServicioId:
            responseCita = await updateDermapen(cita._id, updateCita);
            break;
          case laserServicioId:
            responseCita = await updateLaser(cita._id, updateCita);
            break;
          case aparatologiaServicioId:
            responseCita = await updateAparatologia(cita._id, updateCita);
            break;
        }
      }

      setValues({ cabina: { paciente: cita.paciente._id } });
      let cabina = values.cabina;
      cabina.cita = cita._id;
      cabina.dermatologo = cita.dermatologo;
      cabina.cosmetologa = cita.cosmetologa;
      cabina.paciente = paciente._id;
      cabina.tipo_servicio = tipo_servicio;
      cabina.servicio = servicio;
      cabina.disponible = false;

      const response = await updateCabina(cabina._id, cabina);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setOpenAlert(true);
        setMessage('EL PACIENTE INGRESO.');
      }
    }

    onClose();
    await loadAll();
    setIsLoading(false);
  }

  const handleChangeCabina = (event) => {
    setValues({ cabina: event.target.value });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormCabinaAgregarPaciente
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClickCancel={onClose}
          onClickGuardar={handleClickGuardar}
          isLoading={isLoading}
          cabinas={cabinas}
          onChangeCabina={(e) => handleChangeCabina(e)}
          cambio={cambio}
          paciente={paciente}
          {...props} />
      }
    </Formik>
  );
}

export default ModalCabinaAgregarPaciente;