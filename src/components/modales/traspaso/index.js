import React, { useState, useEffect, Fragment } from 'react';
import { createConsecutivo, deletePago, findPagosByTipoServicioAndServicio, showAllOffices } from '../../../services';
import { addZero, toFormatterCurrency } from '../../../utils/utils';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EditIcon from '@material-ui/icons/Edit';
import ModalFormTraspaso from './ModalFormTraspaso';
import { createConsult, updateConsult } from '../../../services/consultas';
import { showAllStatus } from '../../../services/status';
import { deleteIngreso } from '../../../services/ingresos';

const ModalTraspaso = (props) => {
  const {
    open,
    onClose,
    sucursal,
    servicio,
    setServicio,
    empleado,
    loadConsultas,
    tipoServicioId,
    setOpenAlert,
    setMessage,
  } = props;

  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const canceladoSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [statements, setStatements] = useState([]);
  const [estadoAsistio, setEstadoAsistio] = useState();
  const [values, setValues] = useState({
    sucursal: sucursal
  });

  const confirmacion = () => {
    setMessage('CONSULTA TRASPASADA CORRECTAMENTE');
    setOpenAlert(true);
  }

  const handleChangeSucursal = e => {
    setIsLoading(true);
    setValues({ ...values, sucursal: e.target.value });
    setIsLoading(false);
  };

  const handleClickTraspasar = async (rowData) => {
    setIsLoading(true);
    servicio.status = canceladoSPStatusId;
    const dateNow = new Date();
    servicio.pagos.forEach(async (pago) => {
      await deleteIngreso(pago.ingreso);
      await deletePago(pago._id);
    });
    servicio.pagado = false;
    const consul = await updateConsult(servicio._id, servicio);
    if (`${consul.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      servicio._id = undefined;
      servicio.consecutivo = undefined;
      servicio.quien_agenda = empleado;
      servicio.sucursal = rowData.sucursal;
      servicio.status = estadoAsistio;
      servicio.hora_llegada = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      servicio.hora_aplicacion = dateNow.toString();
      servicio.hora_atencion = '--:--';
      servicio.hora_salida = '--:--';
      servicio.observaciones = `CONSULTA TRASPASADA`;
      servicio.fecha_hora = dateNow.toString();
      const response = await createConsult(servicio);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {

        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: consultaServicioId,
          servicio: response.data._id,
          sucursal: rowData.sucursal,
          fecha_hora: dateNow,
          status: response.data.status,
        }

        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          confirmacion();
        }
      }
    }
    loadConsultas(dateNow);
    setIsLoading(false);
    onClose();
  }

  const loadSucursales = async () => {
    const response = await showAllOffices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSucursales(response.data);
    }
  }

  const loadStaus = async () => {
    const response = await showAllStatus();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEstadoAsistio(response.data.find(item => item._id === asistioStatusId));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    loadSucursales();
    loadStaus();
    setIsLoading(false);
  }, []);

  return (
    <Fragment>
      <ModalFormTraspaso
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        values={values}
        open={open}
        onClickCancel={onClose}
        onChangeSucursal={(e) => handleChangeSucursal(e)}
        isLoading={isLoading}
        servicio={servicio}
        empleado={empleado}
        sucursal={sucursal}
        sucursales={sucursales}
        onClickTraspasar={(e) => handleClickTraspasar(e)}
        tipoServicioId={tipoServicioId} />
    </Fragment>


  );
}

export default ModalTraspaso;