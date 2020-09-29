import React, { useState } from 'react';
import ModalFormConfirmacion from './ModalFormConfirmacion';
import { updateEmployee } from "../../../services";

const ModalConfirmacion = (props) => {
  const {
    open,
    onClose,
    onConfirm,
    empleado,
    setMessage,
    setSeverity,
    setOpenAlert,
  } = props;

  const [values, setValues] = useState ({
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

  const handleActualizarPassword = async() => {
    if (empleado.password === values.password) {
      onConfirm();
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