import React, { useState, useEffect, Fragment } from 'react';
import {
  getAllSchedules,
  findScheduleByDateAndSucursalAndService,
  findEmployeesByRolId,
  showAllTipoCitas,
  updatePago,
  deletePago,
  createConsecutivo,
} from "../../../services";
import {
  updateIngreso,
  deleteIngreso,
  findIngresoById,
} from "../../../services/ingresos";
import {
  findAreasByTreatmentServicio,
} from "../../../services/areas";
import * as Yup from "yup";
import ModalFormCita from './ModalFormCita';
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import { createAparatologia, updateAparatologia } from '../../../services/aparatolgia';
import { createFacial, updateFacial } from '../../../services/faciales';
import { createLaser, updateLaser } from '../../../services/laser';
import { showAllStatus } from '../../../services/status';

const validationSchema = Yup.object({
  fecha: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  hora: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  paciente: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  servicio: Yup.string("Ingresa la direccion")
    .required("Los nombres del pacientes son requeridos"),
  tratamiento: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
  numero_sesion: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  recepcionista: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  confirmo: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  quien_confirma: Yup.string("Ingresa la direccion")
    .required("Los nombres del pacientes son requeridos"),
  asistio: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
  precio: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
});

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalCita = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cita,
    empleado,
    loadCitas,
    loadAparatologias,
    loadFaciales,
    loadLaser,
    sucursal,
    setOpenAlert,
    setMessage,
    setSeverity,
    setFilterDate,
    tratamientos,
  } = props;

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const canceloCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
  const canceloSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);
  const [previousState, setPreviousState] = useState();

  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const fecha_cita = new Date(cita.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth()) + 1)}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_hora: cita.fecha_hora,
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    servicio: cita.servicio,
    tratamientos: cita.tratamientos,
    areas: cita.areas,
    numero_sesion: cita.numero_sesion,
    quien_agenda: cita.quien_agenda,
    tipo_cita: cita.tipo_cita ? cita.tipo_cita._id : '',
    confirmo: cita.confirmo,
    quien_confirma: cita.quien_confirma,
    promovendedor: cita.promovendedor ? cita.promovendedor._id : '',
    cosmetologa: cita.cosmetologa ? cita.cosmetologa._id : '',
    status: cita.status ? cita.status._id : '',
    precio: cita.precio,
    total: cita.total,
    motivos: cita.motivos,
    observaciones: cita.observaciones,
    dermatologo: cita.dermatologo ? cita.dermatologo._id : '',
    tiempo: cita.tiempo,
    pagado: cita.pagado,
    pagos: cita.pagos,
    hora_llegada: cita.hora_llegada,
    hora_aplicacion: cita.hora_aplicacion,
    tratamientos: cita.tratamientos,
    areas: cita.areas,
  });

  const loadHorarios = async () => {
    const response = await getAllSchedules();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const loadAreas = () => {
    cita.tratamientos.map(async (tratamiento) => {
      setIsLoading(true);
      const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        tratamiento.areas = response.data;
        setIsLoading(false);
      }
    });

  }

  const handleChangeTratamientos = (e) => {
    e.map(async (tratamiento) => {
      setIsLoading(true);
      const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        tratamiento.areas = response.data;
        setIsLoading(false);
        setValues({
          ...values,
          precio: 0,
          tratamientos: e,
        });
      }
    });
  };

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora} hrs`;
    await setValues({
      ...values,
      nueva_fecha_hora: date,
      observaciones: fechaObservaciones,
    });
    await loadHorarios(date);
    setIsLoading(false);
  };

  const handleChangeHora = e => {
    setIsLoading(true);
    const hora = (e.target.value).split(':');
    const date = new Date(values.nueva_fecha_hora);
    date.setHours(Number(hora[0])); // -5 por zona horaria
    date.setMinutes(hora[1]);
    date.setSeconds(0);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${e.target.value} hrs`;
    setValues({
      ...values,
      nueva_fecha_hora: date,
      hora: e.target.value,
      observaciones: fechaObservaciones,
    });
    setIsLoading(false);
  };

  const handleChangeTipoCita = e => {
    setValues({ ...values, tipo_cita: e.target.value });
  }

  const handleChangePromovendedor = e => {
    setValues({ ...values, promovendedor: e.target.value });
  }

  const handleChangeCosmetologa = e => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeStatus = e => {
    setPreviousState(values.status);
    const estado = statements.find(statement => {
      return statement._id === e.target.value;
    });
    setOpenModalConfirmacion(estado.confirmacion);
    setValues({ ...values, status: e.target.value });
  }

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value });
  }

  const getTimeToTratamiento = (tratamientos) => {
    tratamientos.sort((a, b) => {
      if (a.tiempo < b.tiempo) return 1;
      if (a.tiempo > b.tiempo) return -1;
      return 0;
    });
    let tiempo = 0;
    tratamientos.forEach((item, index) => {
      tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - 20));
    });
    return tiempo;
  }

  const handleOnClickActualizarCita = async (event, rowData) => {
    rowData.tratamientos.forEach(tratamiento => {
			tratamiento.areas = undefined;
		});
    if (rowData.pagado) {
      if (rowData.status === canceloCPStatusId) {
        rowData.pagos.forEach(async (pago) => {
          pago.pago_anticipado = true;
          const ingreso = await findIngresoById(pago.ingreso);
          if (`${ingreso.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            const updateIngresoData = ingreso.data;
            updateIngresoData.pago_anticipado = true;
            await updateIngreso(updateIngresoData._id, updateIngresoData);
            await updatePago(pago._id, pago);
          }
        });
      } else if (rowData.status === canceloSPStatusId) {
        rowData.pagos.forEach(async (pago) => {
          await deleteIngreso(pago.ingreso);
          await deletePago(pago._id);
        });
        rowData.pagado = false;
      }
    }
    if (rowData.status._id !== pendienteStatusId) {
      rowData.quien_confirma_asistencia = empleado._id;
      if (rowData.status === asistioStatusId) {
        const dateNow = new Date();
        rowData.hora_aplicacion = rowData.hora_aplicacion ? rowData.hora_aplicacion : dateNow;
        rowData.hora_llegada = (rowData.hora_llegada && rowData.hora_llegada !== '--:--') ? rowData.hora_llegada : `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      }
    }

    //rowData.tiempo = getTimeToTratamiento(rowData.tratamientos);
    if (rowData.status === reagendoStatusId) {
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          await updateAparatologia(cita._id, rowData);
          break;
        case servicioFacialId:
          await updateFacial(cita._id, rowData);
          break;
        case servicioLaserId:
          await updateLaser(cita._id, rowData);
          break;
      }
      rowData.quien_agenda = empleado._id;
      rowData.sucursal = sucursal;
      rowData.status = pendienteStatusId;
      rowData.hora_llegada = '--:--';
      rowData.hora_atencion = '--:--';
      rowData.hora_salida = '--:--';
      rowData.observaciones = `TRATAMIENTO REAGENDADO ${values.fecha_actual} - ${values.hora_actual} HRS`;
      rowData.fecha_hora = rowData.nueva_fecha_hora;
      let response;
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          response = await createAparatologia(rowData);
          break;
        case servicioFacialId:
          response = await createFacial(rowData);
          break;
        case servicioLaserId:
          response = await createLaser(rowData);
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
          setMessage('TRATAMIENTO REAGENDADO CORRECTAMENTE');
        }
      }
      const dia = addZero(rowData.fecha_hora.getDate());
      const mes = addZero(rowData.fecha_hora.getMonth());
      const anio = rowData.fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          await loadAparatologias(rowData.fecha_hora);
          break;
        case servicioFacialId:
          await loadFaciales(rowData.fecha_hora);
          break;
        case servicioLaserId:
          await loadLaser(rowData.fecha_hora);
          break;
      }
    } else {
      const dia = addZero(rowData.fecha_show.getDate());
      const mes = addZero(rowData.fecha_show.getMonth());
      const anio = rowData.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_show,
        fecha: `${dia}/${mes}/${anio}`
      });
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          await updateAparatologia(cita._id, rowData);
          await loadAparatologias(rowData.fecha_show);
          break;
        case servicioFacialId:
          await updateFacial(cita._id, rowData);
          await loadFaciales(rowData.fecha_show);
          break;
        case servicioLaserId:
          await updateLaser(cita._id, rowData);
          await loadLaser(rowData.fecha_show);
          break;
      }
    }
    onClose();
  }

  const handleChangeSesion = e => {
    setValues({ ...values, numero_sesion: e.target.value });
  };

  const handleChangePrecio = e => {
    setValues({ ...values, precio: e.target.value });
  };

  const handleChangeMotivos = e => {
    setValues({ ...values, motivos: e.target.value });
  }

  const handleChangeDermatologo = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const handleChangePagado = (e) => {
    setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, status: previousState });
  }

  const handleConfirmModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
  }

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagos: pagos,
    });
    setOpenModalPagos(false);
  }

  const handleChangeAreas = async (items, tratamiento) => {
    tratamiento.areasSeleccionadas = items;
    setIsLoading(true);
    let precio = 0;
    values.tratamientos.forEach(tratam => {
      if (tratam.areasSeleccionadas) {
        tratam.areasSeleccionadas.map((item) => {
          const itemPrecio =
            sucursal === sucursalManuelAcunaId ? item.precio_ma // Precio Manuel Acuña
              : (sucursal === sucursalOcciId ? item.precio_oc // Precio Occidental
                : (sucursal === sucursalFedeId ? item.precio_fe // Precio Federalismo
                  : 0)); // Error
          precio = Number(precio) + Number(itemPrecio);
        });
      }
    });
    setValues({
      ...values,
      precio: precio
    });
    setIsLoading(false);
  }

  useEffect(() => {
    const loadHorariosByServicio = async () => {
      const date = new Date(cita.fecha_hora);
      const response = await findScheduleByDateAndSucursalAndService(date.getDate(), Number(date.getMonth()), date.getFullYear(), cita.sucursal._id, cita.servicio._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        response.data.push({ hora: values.hora });
        setHorarios(response.data);
      }
    }

    const loadPromovendedores = async () => {
      const response = await findEmployeesByRolId(promovendedorRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setPromovendedores(response.data);
      }
    }

    const loadCosmetologas = async () => {
      const response = await findEmployeesByRolId(cosmetologaRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setCosmetologas(response.data);
      }
    }

    const loadDoctores = async () => {
      const response = await findEmployeesByRolId(dermatologoRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setDoctores(response.data);
      }
    }

    const loadTipoCitas = async () => {
      const response = await showAllTipoCitas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoCitas(response.data);
      }
      setIsLoading(false);
    }

    const loadStaus = async () => {
      const response = await showAllStatus();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setStatements(response.data);
      }
      setIsLoading(false);
    }

    setIsLoading(true);
    loadAreas(cita);
    loadHorariosByServicio();
    loadPromovendedores();
    loadCosmetologas();
    loadDoctores();
    loadTipoCitas();
    loadStaus();
    setIsLoading(false);
  }, [cita, promovendedorRolId, cosmetologaRolId, dermatologoRolId]);

  return (
    <Fragment>
      {
        !isLoading ?
          <Formik
            enableReinitialize
            initialValues={values}
            validationSchema={validationSchema} >
            {
              props => <ModalFormCita
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClickCancel={onClose}
                cita={cita}
                onClickActualizarCita={handleOnClickActualizarCita}
                onChangeTratamientos={(e) => handleChangeTratamientos(e)}
                onChangeAreas={handleChangeAreas}
                onChangeFecha={(e) => handleChangeFecha(e)}
                onChangeHora={(e) => handleChangeHora(e)}
                onChangeTipoCita={(e) => handleChangeTipoCita(e)}
                onChangeStatus={(e) => handleChangeStatus(e)}
                onChangePromovendedor={(e) => handleChangePromovendedor(e)}
                onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
                onChangeDermatologo={(e) => handleChangeDermatologo(e)}
                onChangeTiempo={(e) => handleChangeTiempo(e)}
                tratamientos={tratamientos}
                areas={areas}
                horarios={horarios}
                promovendedores={promovendedores}
                cosmetologas={cosmetologas}
                doctores={doctores}
                tipoCitas={tipoCitas}
                statements={statements}
                onChangeSesion={handleChangeSesion}
                onChangePrecio={handleChangePrecio}
                onChangeMotivos={handleChangeMotivos}
                onChangeObservaciones={handleChangeObservaciones}
                onChangePagado={(e) => handleChangePagado(e)}
                openModalPagos={openModalPagos}
                onCloseModalPagos={handleCloseModalPagos}
                onGuardarModalPagos={handleGuardarModalPagos}
                sucursal={sucursal}
                empleado={empleado}
                openModalConfirmacion={openModalConfirmacion}
                onCloseModalConfirmacion={handleCloseModalConfirmacion}
                onConfirmModalConfirmacion={handleConfirmModalConfirmacion}
                setOpenAlert={setOpenAlert}
                setMessage={setMessage}
                setSeverity={setSeverity}
                {...props} />
            }
          </Formik> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCita;