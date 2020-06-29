import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import { updateSurgery, findSurgeryBySucursalIdAndFree, updateConsult, showAllBanco, showAllMetodoPago, showAllTipoTarjeta } from '../../services';
import { addZero } from '../../utils/utils';
import ModalFormPagos from './ModalFormPagos';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalPagos = (props) => {
  const {
    open,
    onClose,
    consulta,
    setOpenAlert,
    setMessage,
    sucursal,
    handleClickGuardarPago,
  } = props;

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);

  const [values, setValues] = useState({
    metodo_pago: '',
    observaciones: '',
    porcentaje_comision: porcetanjeComision,
    comision: '',
    total: ''
  });

  const tarjetaMetodoPagoId = process.env.REACT_APP_METODO_PAGO_TARJETA;

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
  setValues({ ...values, metodo_pago: event.target.value });
}

const handleChangeBank = (event) => {
  setValues({ ...values, banco: event.target.value });
}

const handleChangeCardType = (event) => {
  setValues({ ...values, tipo_tarjeta: event.target.value });
}

const handleChangeCantidad = (event) => {
  const cantidad = event.target.value;
  let comision = 0;
  let total = event.target.value;
  if (values.metodo_pago === tarjetaMetodoPagoId) {
    comision = Number(cantidad) * Number(values.porcentaje_comision) / 100;
    total = Number(cantidad) + Number(comision);
  }
  
  setValues({ 
    ...values,
    cantidad: cantidad,
    comision: comision,
    total: total,
   });
}

const handleChangeFactura = (event) => {
  setValues({ ...values, factura: !values.factura });
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

  return (
    <Formik
      initialValues={values}
      enableReinitialize
      validationSchema={validationSchema} >
      {
        props => <ModalFormPagos
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
          onChangeFactura={(e) => handleChangeFactura(e)}
          onChangeConfirmado={(e) => handleChangeConfirmado(e)}
          onChangeObservaciones={(e) => handleChangeObservaciones(e)}
          onChangeDigitos={(e) => handleChangeDigitos(e)}
          {...props} />
      }
    </Formik>
  );
}

export default ModalPagos;