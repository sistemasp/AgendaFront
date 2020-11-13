import React, { useState, useEffect, Fragment } from 'react';
import {
  findEmployeesByRolId,
  showAllMaterials,
  createConsecutivo,
  createBiopsia,
  findScheduleByDateAndSucursalAndService,
} from "../../../services";
import {
  createCirugia,
  updateCirugia,
} from "../../../services/cirugias";
import { updateConsult } from '../../../services/consultas';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormDermapen from './ModalFormDermapen';
import { createFacial } from '../../../services/faciales';

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
    empleado,
    sucursal,
    setOpenAlert,
    setMessage,
    paciente,
  } = props;

  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const dermapenServicioId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const dermapenTratamientoId = process.env.REACT_APP_DERMAPEN_TRATAMIENTO_ID;
  const dermapenAreaId = process.env.REACT_APP_DERMAPEN_AREA_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [medicos, setMedicos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [horarios, setHorarios] = useState([{}]);
  const [disableDate, setDisableDate] = useState(false);

  const [openModalPagos, setOpenModalPagos] = useState(false);

  const [values, setValues] = useState({
    fecha_hora: new Date(),
    tratamientos: [{_id: dermapenTratamientoId}],
    materiales: [],
  });

  const dataComplete = values.pagado;

  const loadHorariosByServicio = async (date, servicio) => {
    const dia = date ? date.getDate() : values.fecha_hora.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
    const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
    const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal._id, servicio);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
  }

  const handleClickCrearDermapen = async (event, data) => {
    const fecha_actual = new Date();
    data.fecha_hora = fecha_actual;
    const response = await createCirugia(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const consecutivo = {
        consecutivo: response.data.consecutivo,
        tipo_servicio: dermapenServicioId,
        servicio: response.data._id,
        sucursal: data.sucursal,
        fecha_hora: new Date(),
        status: response.data.status,
      }
      const responseConsecutivo = await createConsecutivo(consecutivo);
      if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('CIRUGIA AGREGADA CORRECTAMENTE');
      }
    }
    onClose();
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  const handleChangeTotal = e => {
    let precio = Number(e.target.value);
    values.materiales.map(item => {
      precio -= Number(item.precio);
    });
    precio -= Number(values.costo_biopsias);
    setValues({
      ...values,
      total: e.target.value,
      precio: precio,
    });
  };

  const handleChangeFecha = (date) => {
    setIsLoading(true);
    setValues({
      ...values,
      fecha_hora: date,
    });
    loadHorariosByServicio(date, dermapenServicioId);
    setIsLoading(false);
  };

  const handleChangeHora = e => {
    setIsLoading(true);
    const hora = (e.target.value).split(':');
    const date = values.fecha_hora;
    date.setHours(Number(hora[0]));
    date.setMinutes(hora[1]);
    date.setSeconds(0);
    setValues({ ...values, hora: e.target.value, fecha_hora: date });
    setIsLoading(false);
  };


  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagado: true,
      pagos: pagos,
    });
    setOpenModalPagos(false);
  }

  const handleChangePagado = (e) => {
    //setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    let precio = Number(values.total);
    newMateriales.map((item) => {
      precio -= Number(item.precio);
    });
    precio -= Number(values.costo_biopsias);
    setValues({
      ...values,
      materiales: newMateriales,
      precio: precio,
    });
  }

  const handleClickAgendar = async (data) => {
    setIsLoading(true);
    data.quien_agenda = empleado._id;
    data.sucursal = sucursal;
    data.status = pendienteStatusId;
    data.hora_llegada = '--:--';
    data.hora_atencion = '--:--';
    data.hora_salida = '--:--';
    /*
    const response = await createFacial(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const consecutivo = {
        consecutivo: response.data.consecutivo,
        tipo_servicio: response.data.servicio,
        servicio: response.data._id,
        sucursal: sucursal,
        fecha_hora: new Date(),
        status: response.data.status,
      }
      const responseConsecutivo = await createConsecutivo(consecutivo);
      if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('EL FACIAL SE AGREGO CORRECTAMENTE');
        setValues({
          servicio: '',
          tratamientos: [],
          medico: '',
          promovendedor: '',
          cosmetologa: '',
          paciente: `${paciente._id}`,
          precio: '',
          tipo_cita: {},
        });
      }
    }*/

    setIsLoading(false);
  };

  useEffect(() => {

    const loadMateriales = async () => {
      const response = await showAllMaterials();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMateriales(response.data);
      }
    }

    const loadMedicos = async () => {
      const response = await findEmployeesByRolId(medicoRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMedicos(response.data);
      }
    }

    setIsLoading(true);
    loadMateriales();
    loadMedicos();
    loadHorariosByServicio(new Date(), dermapenServicioId);
    setIsLoading(false);
  }, [dermapenServicioId]);


  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormDermapen
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            empleado={empleado}
            onClickCrearCirugia={handleClickCrearDermapen}
            onChange={handleChange}
            onChangeTotal={handleChangeTotal}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onChangeMateriales={(e) => handleChangeMateriales(e)}
            onClickAgendar={handleClickAgendar}
            sucursal={sucursal}
            materiales={materiales}
            onChangeItemPrecio={handleChangeItemPrecio}
            values={values}
            dataComplete={dataComplete}
            onChangePagado={(e) => handleChangePagado(e)}
            tipoServicioId={dermapenServicioId}
            medicos={medicos}
            horarios={horarios}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            disableDate={disableDate}
            paciente={paciente} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalDermapen;