import React, { useState } from 'react';
import ModalFormPassword from './ModalFormPassword';
import { updateEmployee } from "../../../services";

const ModalPassword = (props) => {
  const {
    open,
    onClose,
    empleado,
    setMessage,
    setSeverity,
    setOpenAlert,
  } = props;

  const [values, setValues] = useState ({
    showOldPassword: false,
    showNewPassword: false,
    passwordActual: '',
    passwordNuevo: ''
  });

  const dataComplete = !values.passwordActual || !values.passwordNuevo;

  const handleChangeOldPassword = e => {
    setValues({ ...values, passwordActual: e.target.value });
  }

  const handleChangeNewPassword = e => {
    setValues({ ...values, passwordNuevo: e.target.value });
  }

  const handleClickShowOldPassword = () => {
    setValues({ ...values, showOldPassword: !values.showOldPassword });
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleActualizarPassword = async() => {
    setOpenAlert(true);
    if (empleado.password === values.passwordActual) {
      const data = {
        password: values.passwordNuevo
      }
      await updateEmployee(empleado._id, data);
      setSeverity('success');
      setMessage('CONSTRASEÑA CAMBIADA CORRECTAMENTE');
      onClose();
    } else {
      setSeverity('warning');
      setMessage('CONTRASEÑA INCORRECTA');
    }
  }

  return (
    <ModalFormPassword
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        onClickGuardar={handleActualizarPassword}
        dataComplete={dataComplete}
        values={values}
        handleClickShowOldPassword={handleClickShowOldPassword}
        handleClickShowNewPassword={handleClickShowNewPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        handleChangeOldPassword={handleChangeOldPassword}
        handleChangeNewPassword={handleChangeNewPassword}
        {...props} />
  );
}

export default ModalPassword;