import React, { useState, useEffect, Fragment } from 'react';
import {
  createConsecutivo,
  findScheduleInConsultByDateAndSucursal,
} from "../../../services";
import {
  createConsult,
} from "../../../services/consultas";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormProximaConsulta from './ModalFormProximaConsulta';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalProximaConsulta = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    consulta,
    empleado,
    loadConsultas,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);

  const fecha_cita = new Date(consulta.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const promovendedorSinAsignarId = process.env.REACT_APP_PROMOVENDEDOR_SIN_ASIGNAR_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const citadoMedioId = process.env.REACT_APP_MEDIO_CITADO_ID;

  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: consulta.paciente,
    paciente_nombre: `${consulta.paciente.nombres} ${consulta.paciente.apellidos}`,
    telefono: consulta.paciente.telefono,
    precio: consulta.precio,
    quien_agenda: empleado,
    tipo_cita: tipoCitaDerivadaId,
    promovendedor: promovendedorSinAsignarId,
    status: pendienteStatusId,
    observaciones: consulta.observaciones,
    dermatologo: consulta.dermatologo ? consulta.dermatologo : '',
    frecuencia: reconsultaFrecuenciaId,
    servicio: consulta.servicio,
    sucursal: consulta.sucursal,
    medio: citadoMedioId,
  });

  const loadHorarios = async (date) => {
    const dia = date ? date.getDate() : values.fecha_show.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
    const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
    const response = await findScheduleInConsultByDateAndSucursal(consultaServicioId, dia, mes, anio, sucursal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    await setValues({
      ...values,
      fecha_hora: date,
    });
    await loadHorarios(date);
    setIsLoading(false);
  };

  const handleChangeHora = e => {
    setIsLoading(true);
    const hora = (e.target.value).split(':');
    const date = new Date(values.fecha_hora);
    date.setHours(Number(hora[0]));
    date.setMinutes(hora[1]);
    date.setSeconds(0);
    setValues({
      ...values,
      fecha_hora: date,
      hora: e.target.value,
    });
    setIsLoading(false);
  };

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value });
  }

  const handleOnClickProximarCita = async (data) => {
    setIsLoading(true);
    data.hora_llegada = '--:--';
    data.hora_atencion = '--:--';
    data.hora_salida = '--:--';
    const response = await createConsult(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const consecutivo = {
        consecutivo: response.data.consecutivo,
        tipo_servicio: consultaServicioId,
        servicio: response.data._id,
        sucursal: sucursal._id,
        fecha_hora: new Date(),
        status: response.data.status,
      }
      const responseConsecutivo = await createConsecutivo(consecutivo);
      if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('CONSULTA AGREGADA CORRECTAMENTE');
        const dia = addZero(data.fecha_show.getDate());
        const mes = addZero(data.fecha_show.getMonth() + 1);
        const anio = data.fecha_show.getFullYear();
        setFilterDate({
          fecha_show: data.fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
        loadConsultas(data.fecha_hora);
      }
    }
    onClose();
    setIsLoading(false);
  };

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  useEffect(() => {

    const loadHorarios = async (date) => {
      const dia = date ? date.getDate() : values.fecha_show.getDate();
      const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
      const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
      const response = await findScheduleInConsultByDateAndSucursal(consultaServicioId, dia, mes, anio, sucursal);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setHorarios(response.data);
      }
    }

    setIsLoading(true);
    loadHorarios();
    setIsLoading(false);
  }, [consultaServicioId]);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormProximaConsulta
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            consulta={consulta}
            empleado={empleado}
            onClickProximarCita={handleOnClickProximarCita}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            horarios={horarios}
            onChangeObservaciones={handleChangeObservaciones}
            sucursal={sucursal}
            tipoServicioId={consultaServicioId} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalProximaConsulta;