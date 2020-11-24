import React, { useState, useEffect, Fragment } from 'react';
import {
  showAllMaterialEsteticas,
  createConsecutivo,
  showAllMaterials,
} from "../../../services";
import { updateConsult } from '../../../services/consultas';
import {
  updateEstetica,
  createEstetica,
} from "../../../services/esteticas";
import * as Yup from "yup";
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormEstetica from './ModalFormEstetica';

const validationSchema = Yup.object({
  fecha: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  hora: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  paciente: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  numero_sesion: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  recepcionista: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  confirmo: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  quien_confirma_asistencia: Yup.string("Ingresa la direccion")
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

const ModalEstetica = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    consulta,
    empleado,
    sucursal,
    setOpenAlert,
    setMessage,
    estetica,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [toxinasRellenos, setToxinaRellenos] = useState([]);

  const [openModalPagos, setOpenModalPagos] = useState(false);

  const [values, setValues] = useState({
    _id: estetica._id,
    fecha_hora: estetica.fecha_hora,
    consulta: estetica.consulta,
    consecutivo: estetica.consecutivo,
    sucursal: estetica.sucursal,
    precio: estetica.precio ? estetica.precio : 0,
    total: estetica.total ? estetica.total : 0,
    toxinas_rellenos: estetica.toxinas_rellenos ? estetica.toxinas_rellenos : [],
    materiales: estetica.materiales ? estetica.materiales : [],
    pagado: estetica.pagado,
    paciente: estetica.paciente,
    dermatologo: estetica.dermatologo,
    hora_aplicacion: estetica.hora_aplicacion,
  });
  const [materiales, setMateriales] = useState([]);

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
  const esteticaServicioId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const biopsiaServicioId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;

  const dataComplete = values.pagado;

  useEffect(() => {

    const loadToxinasRellenos = async () => {
      const response = await showAllMaterialEsteticas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setToxinaRellenos(response.data);
      }
    }

    const loadMateriales = async () => {
      const response = await showAllMaterials();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMateriales(response.data);
      }
    }

    setIsLoading(true);
    loadToxinasRellenos();
    loadMateriales();
    setIsLoading(false);
  }, []);

  const handleChangeToxinasRellenos = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      toxinas_rellenos: items
    });
    setIsLoading(false);
  }

  const handleClickCrearEstetica = async (event, data) => {
    const fecha_actual = new Date();
    fecha_actual.setHours(fecha_actual.getHours());
    data.fecha_hora = fecha_actual;
    data.servicio = esteticaServicioId;
    if (!data._id) {
      data.status = asistioStatusId;
    }
    const update = data._id ? {} : await updateConsult(consulta._id, { ...consulta, status: enProcedimientoStatusId });
    const response = data._id ? await updateEstetica(data._id, data) : await createEstetica(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      if (data._id) {
        setOpenAlert(true);
        setMessage('ESTETICA ACTUALIZADA CORRECTAMENTE.');
      } else {
        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: esteticaServicioId,
          servicio: response.data._id,
          sucursal: data.sucursal,
          fecha_hora: new Date(),
          status: response.data.status,
        }
        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setOpenAlert(true);
          setMessage('ESTETICA GUARDADA CORRECTAMENTE.');
        }
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
    let precio = e.target.value;
    values.toxinas_rellenos.map(item => {
      precio -= Number(item.total);
    });
    values.materiales.map(item => {
      precio -= Number(item.precio);
    });
    setValues({
      ...values,
      precio: precio,
      total: e.target.value,
    });
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

  const handleChangeItemUnidades = (e, index) => {
    const newToxinasRellenos = values.toxinas_rellenos;
    newToxinasRellenos[index].unidades = e.target.value;
    newToxinasRellenos[index].total = Number(newToxinasRellenos[index].precio) * Number(e.target.value)
    let precio = values.total;
    newToxinasRellenos.map((item) => {
      precio -= Number(item.precio) * Number(item.unidades);
    });
    values.materiales.map(item => {
      precio -= Number(item.precio);
    });

    setValues({
      ...values,
      toxinas_rellenos: newToxinasRellenos,
      precio: precio,
    });
  }

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    let precio = Number(values.total);
    newMateriales.map((item) => {
      precio -= Number(item.precio);
    });
    values.toxinas_rellenos.map(item => {
      precio -= Number(item.total);
    });
    setValues({
      ...values,
      materiales: newMateriales,
      precio: precio,
    });
  }

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
  }

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormEstetica
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            consulta={consulta}
            empleado={empleado}
            onClickCrearEstetica={handleClickCrearEstetica}
            onChange={handleChange}
            onChangeTotal={handleChangeTotal}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onChangeToxinasRellenos={(e) => handleChangeToxinasRellenos(e)}
            sucursal={sucursal}
            toxinasRellenos={toxinasRellenos}
            materiales={materiales}
            onChangeItemUnidades={handleChangeItemUnidades}
            onChangeItemPrecio={handleChangeItemPrecio}
            onChangeMateriales={handleChangeMateriales}
            values={values}
            dataComplete={dataComplete}
            onChangePagado={(e) => handleChangePagado(e)}
            tipoServicioId={esteticaServicioId}
            estetica={estetica} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalEstetica;