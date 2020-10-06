import React, { useState, useEffect, Fragment } from 'react';
import {
  findScheduleInConsultByDateAndSucursal,
  updateConsult,
  findEmployeesByRolId,
  showAllTipoCitas,
  showAllStatus,
  createCirugia,
  showAllMaterialEsteticas,
  updateCirugia,
  createConsecutivo,
  createBiopsia,
  updateEstetica,
  createEstetica,
} from "../../../services";
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
    loadConsultas,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    estetica,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [materiales, setMateriales] = useState([]);
  const [patologos, setPatologos] = useState([]);

  const [openModalPagos, setOpenModalPagos] = useState(false);

  const [values, setValues] = useState({
    _id: estetica._id,
    fecha_hora: estetica.fecha_hora,
    consulta: consulta,
    consecutivo: estetica.consecutivo,
    sucursal: estetica.sucursal ? estetica.sucursal : consulta.sucursal,
    precio: estetica.precio ? estetica.precio : 0,
    total: estetica.total ? estetica.total : 0,
    materiales: estetica.materiales,
    pagado: estetica.pagado,
    paciente: consulta.paciente,
    medico: consulta.medico,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const esteticaServicioId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const biopsiaServicioId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;

  const dataComplete = values.pagado;

  useEffect(() => {

    const loadMateriales = async () => {
      const response = await showAllMaterialEsteticas();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMateriales(response.data);
      }
    }

    setIsLoading(true);
    loadMateriales();
    setIsLoading(false);
  }, []);

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
    fecha_actual.setHours(fecha_actual.getHours() - 5);
    data.fecha_hora = fecha_actual;
    data.tipo_servicio = esteticaServicioId;
    console.log("DADADA>", data);
    const response = data._id ? await updateEstetica(data._id, data) : await createEstetica(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      if (data._id) {
        setOpenAlert(true);
        setMessage('La Estetica se actualizo correctamente');
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
          setMessage('La Estetica se guardo correctamente');
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

  const handleChangePrecio = e => {
    let total = 0;
    values.materiales.map(item => {
      total += Number(item.total);
    });
    total += Number(e.target.value);
    setValues({
      ...values,
      precio: e.target.value,
      total: total
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
    const newMateriales = values.materiales;
    newMateriales[index].unidades = e.target.value;
    newMateriales[index].total = Number(newMateriales[index].precio) * Number(e.target.value)
    let total = 0;
    newMateriales.map((item) => {
      total += Number(item.precio) * Number(item.unidades);
    });

    total += Number(values.precio);
    setValues({
      ...values,
      materiales: newMateriales,
      total: total,
    });
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
            onClickCrearCirugia={handleClickCrearCirugia}
            onChange={handleChange}
            onChangePrecio={handleChangePrecio}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onChangeMateriales={(e) => handleChangeMateriales(e)}
            sucursal={sucursal}
            materiales={materiales}
            onChangeItemUnidades={handleChangeItemUnidades}
            values={values}
            dataComplete={dataComplete}
            onChangePagado={(e) => handleChangePagado(e)}
            tipoServicioId={esteticaServicioId} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalEstetica;