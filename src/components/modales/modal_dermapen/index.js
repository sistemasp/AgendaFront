import React, { useState, useEffect, Fragment } from 'react';
import {
  getAllSchedules,
  findScheduleByDateAndSucursalAndService,
  findEmployeesByRolId,
  showAllTipoCitas,
  updatePago,
  deletePago,
  createConsecutivo,
  showAllMaterials,
} from "../../../services";
import {
  updateIngreso,
  deleteIngreso,
  findIngresoById,
} from "../../../services/ingresos";
import ModalFormDermapen from './ModalFormDermapen';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import { createDermapen, updateDermapen } from '../../../services/dermapens';
import { showAllStatus } from '../../../services/status';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalDermapen = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    dermapen,
    empleado,
    loadDermapens,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
  } = props;

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const canceloCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
  const canceloSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [previousState, setPreviousState] = useState();

  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const fecha_dermapen = new Date(dermapen.fecha_hora);
  const fecha = `${addZero(fecha_dermapen.getDate())}/${addZero(Number(fecha_dermapen.getMonth()) + 1)}/${addZero(fecha_dermapen.getFullYear())}`;
  const hora = `${addZero(Number(fecha_dermapen.getHours()))}:${addZero(fecha_dermapen.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_hora: dermapen.fecha_hora,
    fecha_show: fecha_dermapen,
    materiales: dermapen.materiales,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: dermapen.paciente,
    paciente_nombre: `${dermapen.paciente.nombres} ${dermapen.paciente.apellidos}`,
    telefono: dermapen.paciente.telefono,
    servicio: dermapen.servicio,
    tratamientos: dermapen.tratamientos,
    areas: dermapen.areas,
    numero_sesion: dermapen.numero_sesion,
    quien_agenda: dermapen.quien_agenda,
    tipo_cita: dermapen.tipo_cita ? dermapen.tipo_cita._id : '',
    confirmo: dermapen.confirmo,
    quien_confirma: dermapen.quien_confirma,
    promovendedor: dermapen.promovendedor ? dermapen.promovendedor._id : '',
    cosmetologa: dermapen.cosmetologa ? dermapen.cosmetologa._id : '',
    status: dermapen.status ? dermapen.status._id : '',
    precio: dermapen.precio,
    total: dermapen.total,
    motivos: dermapen.motivos,
    observaciones: dermapen.observaciones,
    dermatologo: dermapen.dermatologo ? dermapen.dermatologo._id : '',
    tiempo: dermapen.tiempo,
    pagado: dermapen.pagado,
    pagos: dermapen.pagos,
    hora_llegada: dermapen.hora_llegada,
    hora_aplicacion: dermapen.hora_aplicacion,
    tratamientos: dermapen.tratamientos,
    areas: dermapen.areas,
  });

  const loadHorarios = async () => {
    const response = await getAllSchedules();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

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
    date.setHours(Number(hora[0]));
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

  const handleOnClickActualizarDermapen = async (event, rowData) => {
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

    if (rowData.status === reagendoStatusId) {
      await updateDermapen(dermapen._id, rowData);
      rowData.quien_agenda = empleado._id;
      rowData.sucursal = sucursal;
      rowData.status = pendienteStatusId;
      rowData.hora_llegada = '--:--';
      rowData.hora_atencion = '--:--';
      rowData.hora_salida = '--:--';
      rowData.observaciones = `DERMAPEN REAGENDADO ${values.fecha_actual} - ${values.hora_actual} HRS`;
      rowData.fecha_hora = rowData.nueva_fecha_hora;
      const response = await createDermapen(rowData);

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: dermapen.servicio._id,
          servicio: response.data._id,
          sucursal: sucursal._id,
          fecha_hora: new Date(),
          status: response.data.status,
        }
        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setOpenAlert(true);
          setMessage('DERMAPEN REAGENDADO CORRECTAMENTE');
        }
      }
      const dia = addZero(rowData.fecha_hora.getDate());
      const mes = addZero(rowData.fecha_hora.getMonth());
      const anio = rowData.fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      await loadDermapens(rowData.fecha_hora);

    } else {
      const dia = addZero(rowData.fecha_show.getDate());
      const mes = addZero(rowData.fecha_show.getMonth());
      const anio = rowData.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_show,
        fecha: `${dia}/${mes}/${anio}`
      });
      await updateDermapen(dermapen._id, rowData);
      await loadDermapens(rowData.fecha_show);
      setOpenAlert(true);
      setMessage('DERMAPEN ACTUALIZADO');
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

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
  }

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    let total = Number(values.precio);
    newMateriales.map((item) => {
      total += Number(item.precio);
    });
    setValues({
      ...values,
      materiales: newMateriales,
      total: total,
    });
  }

  useEffect(() => {

    const loadMateriales = async () => {
      const response = await showAllMaterials();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMateriales(response.data);
      }
    }

    const loadHorariosByServicio = async () => {
      const date = new Date(dermapen.fecha_hora);
      const response = await findScheduleByDateAndSucursalAndService(date.getDate(), Number(date.getMonth()), date.getFullYear(), dermapen.sucursal._id, dermapen.servicio._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        response.data.push({ hora: values.hora });
        setHorarios(response.data);
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
    loadMateriales();
    loadHorariosByServicio();
    loadDoctores();
    loadTipoCitas();
    loadStaus();
    setIsLoading(false);
  }, [dermapen, promovendedorRolId, cosmetologaRolId, dermatologoRolId]);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormDermapen
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickCancel={onClose}
            dermapen={dermapen}
            values={values}
            onClickActualizarDermapen={handleOnClickActualizarDermapen}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTipoCita={(e) => handleChangeTipoCita(e)}
            onChangeStatus={(e) => handleChangeStatus(e)}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            horarios={horarios}
            doctores={doctores}
            tipoCitas={tipoCitas}
            statements={statements}
            materiales={materiales}
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
            onChangeMateriales={(e) => handleChangeMateriales(e)}
            onChangeItemPrecio={handleChangeItemPrecio} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalDermapen;