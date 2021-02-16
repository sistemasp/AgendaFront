import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  showAllBanco,
  showAllMetodoPago,
  showAllTipoTarjeta,
  createPago,
  updatePago,
} from '../../../services';
import {
  createIngreso, /*findIngresoByPago,*/ updateIngreso,
} from '../../../services/ingresos';
import { generateFolio } from '../../../utils/utils';
import ModalFormPago from './ModalFormPago';
import { findEsquemaById } from '../../../services/esquemas';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalPago = (props) => {
  const {
    open,
    onClose,
    servicio,
    empleado,
    setOpenAlert,
    setMessage,
    sucursal,
    loadPagos,
    pago,
    restante,
    tipoServicioId,
  } = props;

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const tipoIngresoConsultaId = process.env.REACT_APP_TIPO_INGRESO_CONSULTA_ID;
  const tipoIngresoCirugiaId = process.env.REACT_APP_TIPO_INGRESO_CIRUGIA_ID;
  const tipoIngresoFacialesId = process.env.REACT_APP_TIPO_INGRESO_FACIALES_ID;
  const tipoIngresoEsteticaId = process.env.REACT_APP_TIPO_INGRESO_ESTETICA_ID;
  const tipoIngresoAparatologiaId = process.env.REACT_APP_TIPO_INGRESO_APARATOLOGIA_ID;
  const tipoIngresoLaserId = process.env.REACT_APP_TIPO_INGRESO_LASER_ID;
  const tipoIngresoDermapenId = process.env.REACT_APP_TIPO_INGRESO_DERMAPEN_ID;
  const tipoIngresoOtrosId = process.env.REACT_APP_TIPO_INGRESO_OTROS_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioDermapenlId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const tipoCitaRevisadoId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const tipoCitaDerivadoId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);
  const [esquema, setEsquema] = useState({});

  const [values, setValues] = useState({
    forma_pago: pago.forma_pago ? pago.forma_pago._id : '',
    observaciones: pago.observaciones ? pago.observaciones : '',
    cantidad: pago.cantidad ? pago.cantidad : '0',
    porcentaje_descuento_clinica: pago.porcentaje_descuento_clinica ? pago.porcentaje_descuento_clinica : '0',
    descuento_clinica: pago.descuento_clinica ? pago.descuento_clinica : '0',
    total: pago.total ? pago.total : '0',
    pago_anticipado: pago.pago_anticipado,
    has_descuento_dermatologo: pago.descuento_dermatologo && pago.descuento_dermatologo !== '0',
    descuento_dermatologo: pago.descuento_dermatologo || 0,
  });


  const tarjetaMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const consultaTratamientoId = process.env.REACT_APP_CONSULTA_TRATAMIENTO_ID;

  const handleChangePaymentMethod = (event) => {
    const datos = {
      ...values,
      forma_pago: event.target.value,
    }
    calcularTotal(datos);
  }

  const handleChangeBank = (event) => {
    setValues({ ...values, banco: event.target.value });
  }

  const handleChangeCardType = (event) => {
    setValues({ ...values, tipo_tarjeta: event.target.value });
  }

  const getMayorDescuento = () => {
    let porcentajeDescuento = 0;
    switch (servicio.servicio._id) {
      case servicioCirugiaId:
        porcentajeDescuento = esquema.porcentaje_cirugias;
        break;
      case servicioConsultaId:
        porcentajeDescuento = servicio.frecuencia._id === frecuenciaReconsultaId ? esquema.porcentaje_reconsulta : esquema.porcentaje_consulta;
        break;
      case servicioEsteticaId:
        porcentajeDescuento = esquema.porcentaje_dermocosmetica;
        break;
      case servicioAparatologiaId:
        porcentajeDescuento = esquema.porcentaje_laser;
        break;
    }

    return porcentajeDescuento;
  }

  const calcularTotal = (datos) => {
    const cantidad = datos.cantidad;
    const descuento_clinica = cantidad * datos.porcentaje_descuento_clinica / 100;

    const descuento_dermatologo = datos.has_descuento_dermatologo
      ? (servicio.dermatologo._id !== dermatologoDirectoId
        ? (getMayorDescuento())
        : 0)
      : 0;
    const descuento_dermatologo_final = (descuento_dermatologo * (cantidad - descuento_clinica) / 100);
    let total = cantidad - descuento_clinica - descuento_dermatologo_final;
    setValues({
      ...values,
      forma_pago: datos.forma_pago,
      cantidad: cantidad,
      porcentaje_descuento_clinica: datos.porcentaje_descuento_clinica,
      descuento_clinica: descuento_clinica,
      descuento_dermatologo: descuento_dermatologo_final,
      has_descuento_dermatologo: datos.has_descuento_dermatologo,
      total: total,
    });
  }

  const handleChangeDescuento = (event) => {
    const datos = {
      ...values,
      porcentaje_descuento_clinica: event.target.value,
    }
    calcularTotal(datos);
  }

  const handleChangeCantidad = (event) => {
    const datos = {
      ...values,
      cantidad: Number(event.target.value) > Number(restante) ? restante : event.target.value,
    }
    calcularTotal(datos);
  }

  const handleChangeConfirmado = (event) => {
    setValues({ ...values, deposito_confirmado: !values.deposito_confirmado });
  }

  const handleChangePagoAnticipado = (event) => {
    setValues({ ...values, pago_anticipado: !values.pago_anticipado });
  }

  const handleChangDescuentoDermatologo = (event) => {
    const datos = {
      ...values,
      has_descuento_dermatologo: !values.has_descuento_dermatologo,
    }
    calcularTotal(datos);
  }

  const handleChangeObservaciones = (event) => {
    setValues({ ...values, observaciones: event.target.value.toUpperCase() });
  }

  /*const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);
    rowData.fecha_pago = new Date();
    onGuardarPago(rowData);
    setIsLoading(false);
  }*/

  const handleChangeDigitos = (event) => {
    setValues({ ...values, digitos: event.target.value });
  }

  const handleClickGuardarPago = async (event, rowData) => {
    rowData.fecha_pago = new Date();
    rowData.paciente = servicio.paciente._id;
    rowData.dermatologo = servicio.dermatologo._id;
    rowData.tratamientos = consultaTratamientoId;
    rowData.quien_recibe_pago = empleado._id;
    rowData.sucursal = sucursal;
    rowData.servicio = servicio._id;
    rowData.tipo_servicio = tipoServicioId;
    rowData.hora_aplicacion = servicio.hora_aplicacion;

    let tipoIngreso = '';

    switch (rowData.tipo_servicio) {
      case servicioFacialId:
        tipoIngreso = tipoIngresoFacialesId;
        break;
      case servicioDermapenlId:
        tipoIngreso = tipoIngresoDermapenId;
        break;
      case servicioLaserId:
        tipoIngreso = tipoIngresoLaserId;
        break;
      case servicioAparatologiaId:
        tipoIngreso = tipoIngresoAparatologiaId;
        break;
      case servicioConsultaId:
        tipoIngreso = tipoIngresoConsultaId;
        break;
      case servicioCirugiaId:
        tipoIngreso = tipoIngresoCirugiaId;
        break;
      case servicioBiopsiaId:
        tipoIngreso = tipoIngresoOtrosId;
        break;
      case servicioEsteticaId:
        tipoIngreso = tipoIngresoEsteticaId;
        break
      default:
        tipoIngreso = tipoIngresoOtrosId;
        break;
    }

    const create_date = new Date();
    create_date.setHours(create_date.getHours());

    let response;
    const ingreso = {
      create_date: create_date,
      hora_aplicacion: servicio.hora_aplicacion,
      recepcionista: empleado._id,
      concepto: `FOLIO: ${generateFolio(servicio)}`,
      cantidad: rowData.total,
      tipo_ingreso: tipoIngreso,
      sucursal: sucursal,
      forma_pago: rowData.forma_pago,
      pago_anticipado: rowData.pago_anticipado,
    }
    //TODO: CUIDADO AQUI
    /*const resExistIngreso = await findIngresoByPago(pago._id);
    if (`${resExistIngreso.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const existIngreso = resExistIngreso.data;

      if (existIngreso) {
        response = await updateIngreso(existIngreso._id, ingreso);
      } else {
        response = await createIngreso(ingreso);
      }
    }*/

    if (pago.ingreso) {
      response = await updateIngreso(pago.ingreso, ingreso);
    } else {
      response = await createIngreso(ingreso);
    }

    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resIngreso = response.data;
      rowData.ingreso = resIngreso._id;
      const res = pago._id ? await updatePago(pago._id, rowData) : await createPago(rowData);
      if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
        || `${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        resIngreso.pago = res.data._id;
        await updateIngreso(resIngreso._id, resIngreso);
        onClose();
        loadPagos();
      }
    }
  }

  const loadBancos = async () => {
    const response = await showAllBanco();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setBancos(response.data);
    }
  }

  const loadMetodosPago = async () => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMetodosPago(response.data);
    }
  }

  const loadTipoTarjeta = async () => {
    const response = await showAllTipoTarjeta();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTiposTarjeta(response.data);
    }
  }

  const loadEsquema = async () => {
    const response = await findEsquemaById(servicio.dermatologo.esquema);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsquema(response.data);
    }
  }

  useEffect(() => {

    loadBancos();
    loadMetodosPago();
    loadTipoTarjeta();
    loadEsquema();
    setIsLoading(false);

  }, [sucursal]);

  return (
    <Formik
      initialValues={values}
      enableReinitialize
      validationSchema={validationSchema} >
      {
        props => <ModalFormPago
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          bancos={bancos}
          metodosPago={metodosPago}
          tiposTarjeta={tiposTarjeta}
          onClickCancel={onClose}
          onClickGuardar={handleClickGuardarPago}
          isLoading={isLoading}
          onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
          onChangeBank={(e) => handleChangeBank(e)}
          onChangeCardType={(e) => handleChangeCardType(e)}
          onChangeCantidad={(e) => handleChangeCantidad(e)}
          onChangeConfirmado={(e) => handleChangeConfirmado(e)}
          onChangeObservaciones={(e) => handleChangeObservaciones(e)}
          onChangeDigitos={(e) => handleChangeDigitos(e)}
          onChangeDescuento={(e) => handleChangeDescuento(e)}
          onChangePagoAnticipado={(e) => handleChangePagoAnticipado(e)}
          onChangDescuentoDermatologo={(e) => handleChangDescuentoDermatologo(e)}
          {...props} />
      }
    </Formik>
  );
}

export default ModalPago;