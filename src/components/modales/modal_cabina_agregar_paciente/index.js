import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  findConsultById,
  findEmployeesByRolId,
  updateSurgery,
  findCabinaBySucursalIdAndFree,
  updateConsult,
  findDateById,
  updateDate,
  updateCabina,
} from '../../../services';
import { addZero } from '../../../utils/utils';
import ModalFormCabinaAgregarPaciente from './ModalFormCabinaAgregarPaciente';

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
    loadListaEsperaConsultas,
    loadListaEsperaTratamientos,
    loadCabinas,
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
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

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

    if (tipo_servicio === consultaServicioId) { // SI ES CONSULTA
      const responseServicio = await findConsultById(servicio);
      if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const consulta = responseServicio.data;
        if (!cambio) {
          const dateNow = new Date();
          let updateConsulta = consulta;
          updateConsulta.status = enCabinaStatusId;
          updateConsulta.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
          updateConsulta.medico = values.cabina.medico;
          await updateConsult(consulta._id, updateConsulta);
        }

        setValues({ cabina: { paciente: consulta.paciente._id } });
        let consul = values.cabina;
        consul.consulta = consulta._id;
        consul.paciente = paciente._id;
        consul.tipo_servicio = tipo_servicio;
        consul.servicio = servicio;
        consul.disponible = false;

        const response = await updateSurgery(consul._id, consul);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          setOpenAlert(true);
          setMessage('El paciente se agrego a la cabina correctamente');
        }
      }
    } else { // SI ES TRATAMIENTO
      const responseCita = await findDateById(servicio);
      if (`${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const cita = responseCita.data;
        console.log("CITTAAAA", cita);
        if (!cambio) {
          const dateNow = new Date();
          let updateCita = cita;
          updateCita.status = enCabinaStatusId;
          updateCita.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
          updateCita.cosmetologa = values.cabina.cosmetologa;
          await updateDate(cita._id, updateCita);
        }

        setValues({ cabina: { paciente: cita.paciente._id } });
        let cabina = values.cabina;
        cabina.cita = cita._id;
        cabina.paciente = paciente._id;
        cabina.tipo_servicio = tipo_servicio;
        cabina.servicio = servicio;
        cabina.disponible = false;

        const response = await updateCabina(cabina._id, cabina);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          setOpenAlert(true);
          setMessage('El paciente se agrego a la cabina correctamente');
        }
      }
    }

    onClose();
    await loadListaEsperaConsultas();
    await loadListaEsperaTratamientos();
    await loadCabinas();
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