import React, { useState } from 'react';
import ModalFormConfirmacion from './ModalFormConfirmacion';
import { findSupervisorByClave } from '../../../services/clave_supervisor';
import { addZero } from '../../../utils/utils';
import { createCancelacion } from '../../../services/cancelaciones';

const ModalConfirmacion = (props) => {
  const {
    open,
    onClose,
    onConfirm,
    empleado,
    setMessage,
    setSeverity,
    setOpenAlert,
    servicio,
    status,
  } = props;

  const [values, setValues] = useState({
    showPassword: false,
    password: '',
  });

  const dataComplete = !values.password;

  const handleChangePassword = e => {
    setValues({ ...values, password: e.target.value });
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleActualizarPassword = async () => {
    const response = await findSupervisorByClave(values.password);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const supervisor = response.data;
      if (supervisor) {
        if (servicio) {
          const date = new Date();
          const horaSalida = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
          const cancelacion = {
            supervisor: supervisor._id,
            recepcionista: empleado._id,
            tipo_servicio: servicio.servicio,
            servicio: servicio._id,
            hora_llegada: servicio.hora_llegada,
            hora_salida: horaSalida,
            status: status,
          }

          const cancleResponse = await createCancelacion(cancelacion);
          if (`${cancleResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
            onConfirm();
          }
        } else {
          onConfirm();
        }

      } else {
        setSeverity('error');
        setMessage("ERROR AL INGRESAR LA CLAVE DE SUPERVISOR.");
        setOpenAlert(true);
      }
    }
  }

  return (
    <ModalFormConfirmacion
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickCancel={onClose}
      onClickGuardar={handleActualizarPassword}
      dataComplete={dataComplete}
      values={values}
      handleClickShowPassword={handleClickShowPassword}
      handleMouseDownPassword={handleMouseDownPassword}
      handleChangePassword={handleChangePassword}
      {...props} />
  );
}

export default ModalConfirmacion;