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
  updateSalaCirugia,
  findSalaCirugiaBySucursalIdAndFree,
  findCirugiaById,
  updateCirugia,
} from '../../../services';
import { addZero } from '../../../utils/utils';
import ModalFormCirugiaAgregarPaciente from './ModalFormCirugiaAgregarPaciente';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalCirugiaAgregarPaciente = (props) => {
  const {
    open,
    onClose,
    tipo_servicio,
    servicio,
    setOpenAlert,
    setMessage,
    loadSalaCirugias,
    loadListaEsperaCirugias,
    loadCabinas,
    sucursal,
    cambio,
    paciente,
    cirugia,
  } = props;

  console.log("CIcIADASD", cirugia);

  const [isLoading, setIsLoading] = useState(true);
  const [salaCirugias, setSalaCirugias] = useState([]);
  //const [consulta, setConsulta] = useState();
  //const [cita, setCita] = useState();

  const [values, setValues] = useState({
  });

  const enSalaCirugiaStatusId = process.env.REACT_APP_EN_SALA_CIRUGIA_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

  useEffect(() => {
    const loadCabinasDisponibles = async () => {
      const response = await findSalaCirugiaBySucursalIdAndFree(sucursal);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setSalaCirugias(response.data);
      }
    }

    loadCabinasDisponibles();
    setIsLoading(false);

  }, [sucursal]);

  const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);

    const responseServicio = await findCirugiaById(servicio);
    if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const cirugia = responseServicio.data;
      if (!cambio) {
        const dateNow = new Date();
        let updateCirugiaData = cirugia;
        updateCirugiaData.status = enSalaCirugiaStatusId;
        updateCirugiaData.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
        updateCirugiaData.medico = values.sala_cirugia.medico;
        await updateCirugia(cirugia._id, updateCirugiaData);
      }

      setValues({ sala_cirugia: { paciente: cirugia.paciente._id } });
      let salaCirugia = values.sala_cirugia;
      salaCirugia.cirugia = cirugia._id;
      salaCirugia.paciente = paciente._id;
      salaCirugia.tipo_servicio = tipo_servicio;
      salaCirugia.servicio = servicio;
      salaCirugia.disponible = false;

      const response = await updateSalaCirugia(salaCirugia._id, salaCirugia);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setOpenAlert(true);
        setMessage('El paciente se agrego a la sala de cirugia correctamente');
      }
    }

    await loadSalaCirugias();
    await loadListaEsperaCirugias();
    onClose();
    setIsLoading(false);
  }

  const handleChangeSalaCirugia = (event) => {
    setValues({ sala_cirugia: event.target.value });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormCirugiaAgregarPaciente
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClickCancel={onClose}
          onClickGuardar={handleClickGuardar}
          isLoading={isLoading}
          salaCirugias={salaCirugias}
          onChangeSalaCirugia={(e) => handleChangeSalaCirugia(e)}
          cambio={cambio}
          paciente={paciente}
          {...props} />
      }
    </Formik>
  );
}

export default ModalCirugiaAgregarPaciente;