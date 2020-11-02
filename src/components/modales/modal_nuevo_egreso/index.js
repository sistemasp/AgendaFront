import React, { useState, useEffect } from 'react';
import ModalFormNuevoEgreso from './ModalFormNuevoEgreso';
import {
  updateEmployee,
  showAllTipoEgresos,
  showAllMetodoPago,
  createEgreso,
} from "../../../services";

const ModalNuevoEgreso = (props) => {
  const {
    open,
    onClose,
    empleado,
    sucursal,
    setMessage,
    setSeverity,
    setOpenAlert,
    onObtenerInformacion,
  } = props;

  const [values, setValues] = useState({
    recepcionista: empleado._id,
    sucursal: sucursal,
  });

  const [tipoEgresos, setTipoEgresos] = useState([]);
  const [metodoPagos, setMetodoPagos] = useState([]);

  const dataComplete = !values.concepto || !values.cantidad || !values.tipo_egreso || !values.metodo_pago;

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeTipoEgreso = (e) => {
    setValues({
      ...values,
      tipo_egreso: e.target.value
    });
  }

  const handleChangeMetodoPago = (e) => {
    setValues({
      ...values,
      metodo_pago: e.target.value
    });
  }

  const handleAgregarConceto = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    values.create_date = create_date;
    const response = await createEgreso(values);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setMessage("Egreso agregado correctamente");
          setOpenAlert(true);
          onClose();
          onObtenerInformacion();
        }
  }

  useEffect(() => {

    const loadTipoEgreso = async () => {
      const response = await showAllTipoEgresos();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoEgresos(response.data);
      }
    }

    const loadMetodoPago = async () => {
      const response = await showAllMetodoPago();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMetodoPagos(response.data);
      }
    }

    loadTipoEgreso();
    loadMetodoPago();
  }, []);

  return (
    <ModalFormNuevoEgreso
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickCancel={onClose}
      dataComplete={dataComplete}
      values={values}
      tipoEgresos={tipoEgresos}
      metodoPagos={metodoPagos}
      onAgregarConceto={handleAgregarConceto}
      onChange={handleChange}
      onChangeTipoEgreso={(e) => handleChangeTipoEgreso(e)}
      onChangeMetodoPago={(e) => handleChangeMetodoPago(e)}
      {...props} />
  );
}

export default ModalNuevoEgreso;