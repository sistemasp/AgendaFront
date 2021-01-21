import React, { useState, useEffect } from 'react';
import ModalFormNuevoIngreso from './ModalFormNuevoIngreso';
import {
  showAllTipoIngresos,
  showAllMetodoPago,
} from "../../../services";
import {
  createIngreso,
} from "../../../services/ingresos";

const ModalNuevoIngreso = (props) => {
  const {
    open,
    onClose,
    empleado,
    sucursal,
    setMessage,
    setSeverity,
    setOpenAlert,
    onObtenerInformacion,
    corte,
  } = props;

  const [values, setValues] = useState({
    recepcionista: empleado._id,
    sucursal: sucursal,
    turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
  });

  const [tipoIngresos, setTipoIngresos] = useState([]);
  const [formaPagos, setMetodoPagos] = useState([]);

  const dataComplete = !values.concepto || !values.cantidad || !values.tipo_ingreso || !values.forma_pago;

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeTipoIngreso = (e) => {
    setValues({
      ...values,
      tipo_ingreso: e.target.value
    });
  }

  const handleChangeMetodoPago = (e) => {
    setValues({
      ...values,
      forma_pago: e.target.value
    });
  }

  const handleAgregarConceto = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    values.create_date = create_date;
    values.hora_aplicacion = corte.hora_apertura;
    const response = await createIngreso(values);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setSeverity('success');
          setMessage("INGRESO AGREGADO CORRECTAMENTE");
          setOpenAlert(true);
          onClose();
          onObtenerInformacion();
        }
  }

  useEffect(() => {

    const loadTipoIngreso = async () => {
      const response = await showAllTipoIngresos();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoIngresos(response.data);
      }
    }

    const loadMetodoPago = async () => {
      const response = await showAllMetodoPago();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMetodoPagos(response.data);
      }
    }

    loadTipoIngreso();
    loadMetodoPago();
  }, []);

  return (
    <ModalFormNuevoIngreso
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickCancel={onClose}
      dataComplete={dataComplete}
      values={values}
      tipoIngresos={tipoIngresos}
      formaPagos={formaPagos}
      onAgregarConceto={handleAgregarConceto}
      onChange={handleChange}
      onChangeTipoIngreso={(e) => handleChangeTipoIngreso(e)}
      onChangeMetodoPago={(e) => handleChangeMetodoPago(e)}
      {...props} />
  );
}

export default ModalNuevoIngreso;