import React, { useState, useEffect, Fragment } from 'react';
import {
  findScheduleInConsultByDateAndSucursal,
  updateConsult,
  findEmployeesByRolId,
  showAllTipoCitas,
  showAllStatus,
  createCirugia,
  showAllMaterials,
  updateCirugia,
  createConsecutivo,
  createBiopsia,
} from "../../../services";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormCirugia from './ModalFormCirugia';

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
    sucursal: cirugia.sucursal ? cirugia.sucursal : consulta.sucursal,
    precio: cirugia.precio ? cirugia.precio : 0,
    total: cirugia.total ? cirugia.total : 0,
    materiales: cirugia.materiales,
    biopsias: cirugia.biopsias,
    pagado: cirugia.pagado,
    paciente: consulta.paciente,
    medico: consulta.medico,
    hasBiopsia: cirugia.hasBiopsia,
    cantidad_biopsias: cirugia.biopsias ? cirugia.biopsias.length : 0,
    costo_biopsias: cirugia.costo_biopsias ? cirugia.costo_biopsias : 0,
    patologo: cirugia.patologo ? cirugia.patologo._id : undefined,
    hora_aplicacion: consulta.hora_aplicacion,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
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
          medico: data.medico._id,
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
      //consulta.status = enProcedimientoStatusId;
      await updateConsult(consulta._id, { ...consulta, status: enProcedimientoStatusId });
      //loadConsultas(new Date(consulta.fecha_hora));
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

  const handleChangeCostoBiopsias = e => {
    let precio = Number(values.total);
    values.materiales.map(item => {
      precio -= Number(item.precio);
    });
    precio -= Number(e.target.value);
    setValues({
      ...values,
      costo_biopsias: e.target.value,
      precio: precio
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