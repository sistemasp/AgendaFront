import React, { useState, useEffect } from 'react';
import ModalFormNuevoEgreso from './ModalFormNuevoEgreso';
import {
  showAllTipoEgresos,
} from "../../../services";
import {
  createEgreso,
} from "../../../services/egresos";

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
    corte,
  } = props;

  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;

  const [values, setValues] = useState({
    recepcionista: empleado._id,
    sucursal: sucursal,
    forma_pago: efectivoMetodoPagoId,
    turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
    tipo_egreso: '',
  });

  const [previousTipoEgreso, setPreviousTipoEgreso] = useState();
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const [tipoEgresos, setTipoEgresos] = useState([]);

  const dataComplete = !values.concepto || !values.cantidad || !values.tipo_egreso || !values.forma_pago;

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeTipoEgreso = (e) => {
    setPreviousTipoEgreso(values.tipo_egreso);
    const tipoEgreso = tipoEgresos.find(item => {
      return item._id === e.target.value
    });
    setOpenModalConfirmacion(tipoEgreso.confirmacion);
    setValues({
      ...values,
      tipo_egreso: tipoEgreso._id
    });
  }

  const handleAgregarEgreso = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    values.create_date = create_date;
    values.hora_aplicacion = corte.hora_apertura;
    const response = await createEgreso(values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setSeverity('success');
      setMessage("EGRESO AGREGADO CORRECTAMENTE");
      setOpenAlert(true);
      onClose();
      onObtenerInformacion();
    }
  }

  const handleConfirmModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
  }

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, tipo_egreso: previousTipoEgreso });
  }

  useEffect(() => {

    const loadTipoEgreso = async () => {
      const response = await showAllTipoEgresos();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoEgresos(response.data);
      }
    }

    loadTipoEgreso();
  }, []);

  return (
    <ModalFormNuevoEgreso
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickCancel={onClose}
      dataComplete={dataComplete}
      values={values}
      empleado={empleado}
      tipoEgresos={tipoEgresos}
      previousTipoEgreso={previousTipoEgreso}
      openModalConfirmacion={openModalConfirmacion}
      onCloseModalConfirmacion={handleCloseModalConfirmacion}
      onConfirmModalConfirmacion={handleConfirmModalConfirmacion}
      onAgregarEgreso={handleAgregarEgreso}
      onChange={handleChange}
      onChangeTipoEgreso={(e) => handleChangeTipoEgreso(e)}
      {...props} />
  );
}

export default ModalNuevoEgreso;