import React, { useState, useEffect, Fragment } from 'react';
import {
  findEmployeesByRolId,
  showAllMaterials,
  createConsecutivo,
  findSchedulesBySucursalAndServicio,
} from "../../../services";
import {
  createCirugia,
  updateCirugia,
} from "../../../services/cirugias";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormCirugia from './ModalFormCirugia';
import { createBiopsia } from '../../../services/biopsias';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalCirugia = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    empleado,
    loadCirugias,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    cirugia,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [materiales, setMateriales] = useState([]);
  const [patologos, setPatologos] = useState([]);

  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [horarios, setHorarios] = useState([]);

  const [values, setValues] = useState({
    _id: cirugia._id,
    fecha_hora: cirugia.fecha_hora,
    consulta: cirugia.consulta,
    consecutivo: cirugia.consecutivo,
    sucursal: cirugia.sucursal,
    precio: cirugia.precio ? cirugia.precio : 0,
    total: cirugia.total ? cirugia.total : 0,
    materiales: cirugia.materiales,
    biopsias: cirugia.biopsias,
    pagado: cirugia.pagado,
    paciente: cirugia.paciente,
    dermatologo: cirugia.dermatologo,
    hasBiopsia: cirugia.hasBiopsia,
    cantidad_biopsias: cirugia.biopsias ? cirugia.biopsias.length : 0,
    costo_biopsias: cirugia.costo_biopsias ? cirugia.costo_biopsias : 0,
    patologo: cirugia.patologo ? cirugia.patologo._id : undefined,
    hora_aplicacion: cirugia.hora_aplicacion,
    total_aplicacion: cirugia.total_aplicacion,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
  const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const biopsiaServicioId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;

  const dataComplete = values.pagado;

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
  }

  const handleClickCrearCirugia = async (event, data) => {
    const fecha_actual = new Date();
    data.fecha_hora = fecha_actual;
    data.servicio = cirugiaServicioId;
    if (!data._id) {
      data.status = asistioStatusId;
    }
    const idBiopsias = [];
    if (data.hasBiopsia) {
      const biopsias = [];

      for (var i = 0; i < data.cantidad_biopsias; i++) {
        const biopsia = {
          fecha_realizacion: fecha_actual,
          consulta: data.consulta._id,
          dermatologo: data.dermatologo._id,
          paciente: data.paciente._id,
          sucursal: data.sucursal,
          patologo: data.patologo,
          tipo_servicio: biopsiaServicioId,
          hora_aplicacion: data.hora_aplicacion,
        };
        biopsias.push(biopsia);
      }
      const resp = await createBiopsia(biopsias);
      if (`${resp.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        resp.data.map(item => {
          idBiopsias.push(item._id);
        });
      }
    }
    data.biopsias = idBiopsias;
    const response = data._id ? await updateCirugia(data._id, data) : await createCirugia(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      if (data._id) {
        setOpenAlert(true);
        setMessage('CIRUGIA ACTUALIZADA CORRECTAMENTE');
      } else {
        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: cirugiaServicioId,
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
    }
    loadCirugias(data.fecha_hora);
    onClose();
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  const handleChangeTotal = e => {
    let total_aplicacion = Number(e.target.value);
    values.materiales.map(item => {
      total_aplicacion -= Number(item.precio);
    });
    total_aplicacion -= Number(values.costo_biopsias);
    setValues({
      ...values,
      total: e.target.value,
      total_aplicacion: total_aplicacion,
    });
  };

  const handleChangeCostoBiopsias = e => {
    let total_aplicacion = Number(values.total);
    values.materiales.map(item => {
      total_aplicacion -= Number(item.precio);
    });
    total_aplicacion -= Number(e.target.value);
    setValues({
      ...values,
      costo_biopsias: e.target.value,
      total_aplicacion: total_aplicacion
    });
  }

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

  const handleChangeBiopsia = (e) => {
    const newValue = !values.hasBiopsia;
    if (newValue) {
      setValues({
        ...values,
        hasBiopsia: newValue,
      });
    } else {
      setValues({
        ...values,
        total: (values.total - values.costo_biopsias),
        hasBiopsia: newValue,
        cantidad_biopsias: 0,
        costo_biopsias: 0,
        patologo: {},
      });

    }
  }

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    let total_aplicacion = Number(values.total);
    newMateriales.map((item) => {
      total_aplicacion -= Number(item.precio);
    });
    total_aplicacion -= Number(values.costo_biopsias);
    setValues({
      ...values,
      materiales: newMateriales,
      total_aplicacion: total_aplicacion,
    });
  }

  const loadHorariosByServicio = async () => {
    const response = await findSchedulesBySucursalAndServicio(cirugia.sucursal._id, cirugia.servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.push({ hora: values.hora });
      setHorarios(response.data);
    }
  }

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora} hrs`;
    await setValues({
      ...values,
      fecha_hora: date,
      observaciones: fechaObservaciones,
    });
    await loadHorariosByServicio();
    setIsLoading(false);
  };
  

  useEffect(() => {

    const loadMateriales = async () => {
      const response = await showAllMaterials();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMateriales(response.data);
      }
    }

    const loadPatologos = async () => {
      const response = await findEmployeesByRolId(patologoRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setPatologos(response.data);
      }
    }

    setIsLoading(true);
    loadMateriales();
    loadPatologos();
    loadHorariosByServicio();
    setIsLoading(false);
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormCirugia
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            empleado={empleado}
            onClickCrearCirugia={handleClickCrearCirugia}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChange={handleChange}
            onChangeTotal={handleChangeTotal}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onChangeMateriales={(e) => handleChangeMateriales(e)}
            sucursal={sucursal}
            materiales={materiales}
            onChangeItemPrecio={handleChangeItemPrecio}
            values={values}
            dataComplete={dataComplete}
            horarios={horarios}
            onChangePagado={(e) => handleChangePagado(e)}
            onChangeBiopsia={(e) => handleChangeBiopsia(e)}
            onChangeCostoBiopsias={handleChangeCostoBiopsias}
            patologos={patologos}
            tipoServicioId={cirugiaServicioId}
            cirugia={cirugia} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCirugia;