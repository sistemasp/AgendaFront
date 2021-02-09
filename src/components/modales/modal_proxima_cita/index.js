import React, { useState, useEffect, Fragment } from 'react';
import {
  createConsecutivo,
  findEmployeesByRolId,
  findScheduleByDateAndSucursalAndService,
} from "../../../services";
import {
  findAreasByTreatmentServicio,
} from "../../../services/areas";
import { createAparatologia } from '../../../services/aparatolgia';
import { createFacial } from '../../../services/faciales';
import { createLaser } from '../../../services/laser';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormProximaCita from './ModalFormProximaCita';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalProximaCita = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cita,
    empleado,
    loadConsultas,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    loadAparatologias,
    loadFaciales,
    loadLaser,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);

  const fecha_cita = new Date(cita.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const promovendedorSinAsignarId = process.env.REACT_APP_PROMOVENDEDOR_SIN_ASIGNAR_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const citadoMedioId = process.env.REACT_APP_MEDIO_CITADO_ID;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;

  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: 0,
    fecha_actual: fecha,
    hora_actual: 0,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    precio: cita.precio,
    cosmetologa: cita.cosmetologa ? cita.cosmetologa._id : '',
    quien_agenda: empleado,
    tipo_cita: tipoCitaDerivadaId,
    promovendedor: promovendedorSinAsignarId,
    status: pendienteStatusId,
    observaciones: '',
    dermatologo: cita.dermatologo ? cita.dermatologo : '',
    frecuencia: reconsultaFrecuenciaId,
    servicio: cita.servicio,
    sucursal: cita.sucursal,
    medio: citadoMedioId,
    tratamientos: cita.tratamientos,
    areas: cita.areas,
    tiempo: cita.tiempo,
  });

  const loadHorarios = async (date) => {
    const dia = date ? date.getDate() : values.fecha_show.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
    const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
    const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const loadAreas = async (tratamiento) => {
    const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setAreas(response.data);
    }
  }

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolId(cosmetologaRolId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
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
    let response;
    switch (cita.servicio._id) {
      case servicioAparatologiaId:
        response = await createAparatologia(data);
        break;
      case servicioFacialId:
        response = await createFacial(data);
        break;
      case servicioLaserId:
        response = await createLaser(data);
        break;
    }
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const consecutivo = {
        consecutivo: response.data.consecutivo,
        tipo_servicio: cita.servicio._id,
        servicio: response.data._id,
        sucursal: sucursal._id,
        fecha_hora: new Date(),
        status: response.data.status,
      }
      const responseConsecutivo = await createConsecutivo(consecutivo);
      if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('CITA AGREGADA CORRECTAMENTE');
        const dia = addZero(data.fecha_show.getDate());
        const mes = addZero(data.fecha_show.getMonth() + 1);
        const anio = data.fecha_show.getFullYear();
        setFilterDate({
          fecha_show: data.fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
      }
    }

    switch (cita.servicio._id) {
      case servicioAparatologiaId:
        await loadAparatologias(data.fecha_hora);
        break;
      case servicioFacialId:
        await loadFaciales(data.fecha_hora);
        break;
      case servicioLaserId:
        await loadLaser(data.fecha_hora);
        break;
    }
    onClose();
  };

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const handleChangeCosmetologa = e => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeAreas = async (items) => {
    setIsLoading(true);
    let precio = 0;
    items.map((item) => {
      const itemPrecio =
        sucursal === sucursalManuelAcunaId ? item.precio_ma // Precio Manuel Acuña
          : (sucursal === sucursalOcciId ? item.precio_oc // Precio Occidental
            : (sucursal === sucursalFedeId ? item.precio_fe // Precio Federalismo
              : 0)); // Error
      precio = Number(precio) + Number(itemPrecio);
    });
    setValues({
      ...values,
      precio: precio,
      areas: items
    });
    setIsLoading(false);
  }

  useEffect(() => {

    const loadHorarios = async (date) => {
      const dia = date ? date.getDate() : values.fecha_show.getDate();
      const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
      const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
      const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setHorarios(response.data);
      }
    }

    setIsLoading(true);
    loadHorarios();
    loadAreas(cita.tratamientos[0]);
    loadCosmetologas();
    setIsLoading(false);
  }, [consultaServicioId]);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormProximaCita
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            cita={cita}
            empleado={empleado}
            onClickProximarCita={handleOnClickProximarCita}
            onChangeAreas={(e) => handleChangeAreas(e)}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
            horarios={horarios}
            onChangeObservaciones={handleChangeObservaciones}
            sucursal={sucursal}
            tipoServicioId={consultaServicioId}
            tratamientos={tratamientos}
            areas={areas}
            cosmetologas={cosmetologas} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalProximaCita;