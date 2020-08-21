import React, { useState, useEffect, Fragment } from 'react';
import {
  findScheduleInConsultByDateAndSucursal,
  updateConsult,
  findEmployeesByRolId,
  showAllTipoCitas,
  showAllStatus,
  createCirugia,
  showAllMaterials,
} from "../../../services";
import * as Yup from "yup";
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormCirugia from './ModalFormCirugia';

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

const ModalCirugia = (props) => {

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
    cirugia,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [materiales, setMateriales] = useState([]);
  const [patologos, setPatologos] = useState([]);

  const [openModalPagos, setOpenModalPagos] = useState(false);

  const [values, setValues] = useState({
    _id: cirugia._id,
    fecha_hora: cirugia.fecha_hora,
    consulta: consulta,
    consecutivo: cirugia.consecutivo,
    precio: cirugia.precio ? cirugia.precio : 0,
    total: cirugia.total ? cirugia.total : 0,
    materiales: cirugia.materiales,
    biopsias: cirugia.biopsias,
    pagado: cirugia.pagado,
    paciente: consulta.paciente,
    medico: consulta.medico,
    hasBiopsia: cirugia.hasBiopsia,
    costo_biopsias: 0,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const biopsiaServicioId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;

  const dataComplete = values.pagado;

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
    data.fecha_hora = new Date();
    const response = await createCirugia(data);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setOpenAlert(true);
      setMessage('La Cirugia se guardo correctamente');

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
      total += Number(item.precio);
    });
    total += Number(values.costo_biopsias);
    total += Number(e.target.value);
    setValues({
      ...values,
      precio: e.target.value,
      total: total
    });
  };

  const handleChangeCostoBiopsias = e => {
    let total = 0;
    values.materiales.map(item => {
      total += Number(item.precio);
    });
    total += Number(values.precio);
    total += Number(e.target.value);
    setValues({
      ...values,
      costo_biopsias: e.target.value,
      total: total
    });
  }


  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagos: pagos,
    });
    setOpenModalPagos(false);
  }

  const handleChangePagado = (e) => {
    setValues({ ...values, pagado: !values.pagado });
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
    let total = 0;
    newMateriales.map((item) => {
      total += Number(item.precio);
    });
    total += Number(values.costo_biopsias);
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
          <ModalFormCirugia
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
            onChangeItemPrecio={handleChangeItemPrecio}
            values={values}
            dataComplete={dataComplete}
            onChangePagado={(e) => handleChangePagado(e)}
            onChangeBiopsia={(e) => handleChangeBiopsia(e)}
            onChangeCostoBiopsias={handleChangeCostoBiopsias}
            patologos={patologos}
            tipoServicioId={cirugiaServicioId} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCirugia;