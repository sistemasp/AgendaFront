import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  updateSalaCirugia,
  findSalaCirugiaBySucursalIdAndFree,
} from '../../../services';
import {
  findCirugiaById,
  updateCirugia,
} from '../../../services/cirugias';
import {
  findEsteticaById,
  updateEstetica,
} from '../../../services/esteticas';
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
    loadAll,
    sucursal,
    cambio,
    paciente,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [salaCirugias, setSalaCirugias] = useState([]);
  const [currentService, setCurrentService] = useState({});
  //const [consulta, setConsulta] = useState();
  //const [cita, setCita] = useState();

  const [values, setValues] = useState({
  });

  const enSalaCirugiaStatusId = process.env.REACT_APP_EN_SALA_CIRUGIA_STATUS_ID;
  const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;

  const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);

    if (!cambio) {
      const dateNow = new Date();
      let updateData = currentService;
      updateData.status = enSalaCirugiaStatusId;
      updateData.hora_atencion = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      tipo_servicio === cirugiaServicioId ? await updateCirugia(currentService._id, updateData) : updateEstetica(currentService._id, updateData);
    }

    setValues({ sala_cirugia: { paciente: currentService.paciente._id } });
    let salaCirugia = values.sala_cirugia;
    salaCirugia.cirugia = currentService._id;
    salaCirugia.dermatologo = currentService.dermatologo;
    salaCirugia.paciente = paciente._id;
    salaCirugia.tipo_servicio = tipo_servicio;
    salaCirugia.servicio = servicio;
    salaCirugia.disponible = false;

    const response = await updateSalaCirugia(salaCirugia._id, salaCirugia);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setOpenAlert(true);
      setMessage('EL PACIENTE ENTRO A LA SALA DE CIRUGIA');
    }

    onClose();
    await loadAll();
    setIsLoading(false);
  }

  const handleChangeSalaCirugia = (event) => {
    setValues({ sala_cirugia: event.target.value });
  }

  useEffect(() => {
    const loadCabinasDisponibles = async () => {
      const response = await findSalaCirugiaBySucursalIdAndFree(sucursal);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setSalaCirugias(response.data);
      }
    }

    const getCurrentService = async () => {
      const responseServicio = tipo_servicio === cirugiaServicioId ? await findCirugiaById(servicio) : await findEsteticaById(servicio);
      if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const currentService = responseServicio.data;
        setCurrentService(currentService);
      }
    }

    loadCabinasDisponibles();
    getCurrentService();
    setIsLoading(false);

  }, [sucursal]);

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