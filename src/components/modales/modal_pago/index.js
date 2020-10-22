import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  updateSurgery,
  findSurgeryBySucursalIdAndFree,
  updateConsult,
  showAllBanco,
  showAllMetodoPago,
  showAllTipoTarjeta,
  createPago,
  updatePago,
  createIngreso,
  findTipoIngresoById,
} from '../../../services';
import { addZero, generateFolio } from '../../../utils/utils';
import ModalFormPago from './ModalFormPago';

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

  const tipoIngresoConsultaId = process.env.REACT_APP_TIPO_INGRESO_CONSULTA_ID;
  const tipoIngresoCirugiaId = process.env.REACT_APP_TIPO_INGRESO_CIRUGIA_ID;
  const tipoIngresoFacialesId = process.env.REACT_APP_TIPO_INGRESO_FACIALES_ID;
  const tipoIngresoEsteticaId = process.env.REACT_APP_TIPO_INGRESO_ESTETICA_ID;
  const tipoIngresoAparatologiaId = process.env.REACT_APP_TIPO_INGRESO_APARATOLOGIA_ID;
  const tipoIngresoLaserId = process.env.REACT_APP_TIPO_INGRESO_LASER_ID;
  const tipoIngresoOtrosId = process.env.REACT_APP_TIPO_INGRESO_OTROS_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);

  const [values, setValues] = useState({
    metodo_pago: pago.metodo_pago ? pago.metodo_pago._id : '',
    observaciones: pago.observaciones ? pago.observaciones : '',
    cantidad: pago.cantidad ? pago.cantidad : '0',
    porcentaje_descuento: pago.porcentaje_descuento ? pago.porcentaje_descuento : '0',
    descuento: pago.descuento ? pago.descuento : '0',
    total: pago.total ? pago.total : '0',
    pago_anticipado: pago.pago_anticipado,
  });

  const tarjetaMetodoPagoId = process.env.REACT_APP_METODO_PAGO_TARJETA;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const consultaTratamientoId = process.env.REACT_APP_CONSULTA_TRATAMIENTO_ID;

  useEffect(() => {
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
    loadBancos();
    loadMetodosPago();
    loadTipoTarjeta();
    setIsLoading(false);

  }, [sucursal]);

  const handleChangePaymentMethod = (event) => {
    const datos = {
      ...values,
      metodo_pago: event.target.value,
    }
    calcularTotal(datos);
  }

  const handleChangeBank = (event) => {
    setValues({ ...values, banco: event.target.value });
  }

  const handleChangeCardType = (event) => {
    setValues({ ...values, tipo_tarjeta: event.target.value });
  }

  const handleChangeDescuento = (event) => {
    const datos = {
      ...values,
      porcentaje_descuento: event.target.value,
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

  const calcularTotal = (datos) => {
    const cantidad = datos.cantidad;
    const descuento = cantidad * datos.porcentaje_descuento / 100;
    let total = cantidad - descuento;
    setValues({
      ...values,
      metodo_pago: datos.metodo_pago,
      cantidad: cantidad,
      porcentaje_descuento: datos.porcentaje_descuento,
      descuento: descuento,
      total: total,
    });
  }

  const handleChangeConfirmado = (event) => {
    setValues({ ...values, deposito_confirmado: !values.deposito_confirmado });
  }

  const handleChangePagoAnticipado = (event) => {
    setValues({ ...values, pago_anticipado: !values.pago_anticipado });
  }

  const handleChangeObservaciones = (event) => {
    setValues({ ...values, observaciones: event.target.value });
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
    rowData.medico = servicio.medico._id;
    rowData.servicio = consultaServicioId;
    rowData.tratamientos = consultaTratamientoId;
    rowData.quien_recibe_pago = empleado._id;
    rowData.sucursal = sucursal;
    rowData.servicio = servicio._id;
    rowData.tipo_servicio = tipoServicioId;
    rowData.porcentaje_descuento = `${rowData.porcentaje_descuento} %`;
    const res = pago._id ? await updatePago(pago._id, rowData) : await createPago(rowData);
    if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const data = res.data;
      let tipoIngreso = '';

      switch (data.tipo_servicio) {
        case servicioFacialId:
          tipoIngreso = tipoIngresoFacialesId;
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
      create_date.setHours(create_date.getHours() - 5);

      const ingreso = {
        create_date: create_date,
        recepcionista: empleado._id,
        concepto: `Folio: ${generateFolio(servicio)}`,
        cantidad: data.total,
        tipo_ingreso: tipoIngreso,
        sucursal: sucursal,
        metodo_pago: data.metodo_pago,
      }
      const response = await createIngreso(ingreso);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        onClose();
        loadPagos();
      }



    }
  }

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
          {...props} />
      }
    </Formik>
  );
}

export default ModalPago;