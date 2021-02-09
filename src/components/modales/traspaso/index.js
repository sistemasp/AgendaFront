import React, { useState, useEffect, Fragment } from 'react';
import { createConsecutivo, createPago, deletePago, showAllOffices } from '../../../services';
import { addZero, generateFolio } from '../../../utils/utils';
import ModalFormTraspaso from './ModalFormTraspaso';
import { createConsult, updateConsult } from '../../../services/consultas';
import { showAllStatus } from '../../../services/status';
import { createIngreso, deleteIngreso, updateIngreso } from '../../../services/ingresos';

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
  const tipoIngresoConsultaId = process.env.REACT_APP_TIPO_INGRESO_CONSULTA_ID;

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
    const pagos = [];
    servicio.pagos.forEach(async (pago) => {
      pagos.push(pago);
      await deleteIngreso(pago.ingreso);
      await deletePago(pago._id);
    });
    servicio.pagado = false;
    servicio.pagos = [];
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
      servicio.pagado = true;
      const response = await createConsult(servicio);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const servicioRes = response.data;
        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: consultaServicioId,
          servicio: response.data._id,
          sucursal: servicioRes.sucursal,
          fecha_hora: dateNow,
          status: response.data.status,
        }

        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          pagos.forEach(async (pago) => {
            pago.fecha_pago = dateNow;
            pago.observaciones = "TRASPASO";
            pago.sucursal = servicioRes.sucursal;
            pago.servicio = servicioRes._id;
            pago.hora_aplicacion = servicioRes.hora_aplicacion;

            const ingreso = {
              create_date: dateNow,
              hora_aplicacion: servicioRes.hora_aplicacion,
              recepcionista: empleado,
              concepto: `TRASPASO FOLIO: ${generateFolio(servicioRes)}`,
              cantidad: pago.total,
              tipo_ingreso: tipoIngresoConsultaId,
              sucursal: servicioRes.sucursal,
              forma_pago: pago.forma_pago,
              pago_anticipado: pago.pago_anticipado,
            }

            const response = await createIngreso(ingreso);

            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              const resIngreso = response.data;
              pago.ingreso = resIngreso._id;

              const res = await createPago(pago);
              if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
                resIngreso.pago = res.data._id;
                await updateIngreso(resIngreso._id, resIngreso);
                confirmacion();
              }
            }
          });
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