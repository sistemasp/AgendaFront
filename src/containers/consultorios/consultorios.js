import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalConsultorio from '../../components/modales/modal_consultorio';
import ModalConsultorioAgregarMedico from '../../components/modales/modal_consultorio_agregar_medico';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  }
}));

export const ConsultorioContainer = (props) => {

  const classes = useStyles();

  const {
    titulo,
    columns,
    consultorios,
    consultorio,
    actions,
    options,
    openModal,
    handleOpen,
    handleClose,
    onClickGuardar,
    handleClickGuardar,
    openModalAsignar,
    setOpenAlert,
    setMessage,
    loadConsultorios,
  } = props;

  return (
    <Fragment>
      {
        openModal ?
          <ModalConsultorio
            open={openModal}
            onClose={handleClose}
            consultorio={consultorio}
            handleClickGuardar={handleClickGuardar}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage} /> : ''
      }
      {
        openModalAsignar ?
          <ModalConsultorioAgregarMedico
            open={openModalAsignar}
            onClose={handleClose}
            consultorio={consultorio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadConsultorios={loadConsultorios} /> : ''
      }

      <ButtonCustom
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleOpen}
        text='Nuevo Consultorio' />

      <TableComponent
        titulo={titulo}
        columns={columns}
        data={consultorios}
        actions={actions}
        options={options} />
    </Fragment>
  );
}