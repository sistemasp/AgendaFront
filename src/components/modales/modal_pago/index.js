import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import { updateSurgery, findSurgeryBySucursalIdAndFree, updateConsult, showAllBanco, showAllMetodoPago, showAllTipoTarjeta, createPago, updatePago } from '../../../services';
import { addZero } from '../../../utils/utils';
import ModalFormPago from './ModalFormPago';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalPago = (props) => {
  const {
    open,
    onClose,
    cita,
    empleado,
    setOpenAlert,
    setMessage,
    sucursal,
    loadPagos,
    pago,
  } = props;

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
  const metodoPagoTarjetaId = process.env.REACT_APP_METODO_PAGO_TARJETA;

  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);

  const [values, setValues] = useState({
    metodo_pago: pago.metodo_pago ? pago.metodo_pago._id : '',
    observaciones: pago.observaciones ? pago.observaciones : '',
    porcentaje_comision: porcetanjeComision,
    comision: pago.comision ? pago.comision : '',
    cantidad: pago.cantidad ? pago.cantidad : '0',
    porcentaje_descuento: pago.porcentaje_descuento ? pago.porcentaje_descuento : '0',
    descuento: pago.descuento ? pago.descuento : '0',
    total: pago.total ? pago.total : '0'
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
      cantidad: event.target.value,
    }
    calcularTotal(datos);
  }

  const calcularTotal = (datos) => {
    const cantidad = datos.cantidad;
    let comision = 0;
    const descuento = cantidad * datos.porcentaje_descuento / 100;
    if (datos.metodo_pago === tarjetaMetodoPagoId) {
      comision = (Number(cantidad) - Number(descuento))* Number(values.porcentaje_comision) / 100;
    }
    let total = cantidad - descuento + comision;
    setValues({
      ...values,
      metodo_pago: datos.metodo_pago,
      cantidad: cantidad,
      comision: comision,
      porcentaje_descuento: datos.porcentaje_descuento,
      descuento: descuento,
      total: total,     
    });
  }

  const handleChangeConfirmado = (event) => {
    setValues({ ...values, deposito_confirmado: !values.deposito_confirmado });
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
    rowData.paciente = cita.paciente._id;
    rowData.medico = cita.medico._id;
    rowData.servicio = consultaServicioId;
    rowData.tratamientos = consultaTratamientoId;
    rowData.quien_recibe_pago = empleado._id;
    rowData.sucursal = sucursal;
    rowData.cita = cita._id;
    rowData.porcentaje_comision = `${rowData.metodo_pago === metodoPagoTarjetaId ? porcetanjeComision : '0'} %`;
    const res = pago._id ? await updatePago(pago._id, rowData) : await createPago(rowData);
    if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      onClose();
      loadPagos();
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
          {...props} />
      }
    </Formik>
  );
}

export default ModalPago;