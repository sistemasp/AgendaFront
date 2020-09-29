import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles, Grid } from '@material-ui/core';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalConsultorio from '../../components/modales/modal_consultorio';
import ModalConsultorioAgregarMedico from '../../components/modales/modal_consultorio_agregar_medico';
import ModalCabina from '../../components/modales/modal_cabina';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  }
}));

export const ConsultorioContainer = (props) => {

  const classes = useStyles();

  const {
    tituloConsultorio,
    tituloCabina,
    columnsConsultorio,
    columnsCabina,
    consultorios,
    consultorio,
    cabinas,
    cabina,
    actionsConsultorio,
    actionsCabina,
    options,
    openModalConsultorio,
    openModalCabina,
    handleOpenConsultorio,
    handleOpenCabina,
    handleClose,
    handleClickGuardarConsultorio,
    handleClickGuardarCabina,
    openModalAsignar,
    setOpenAlert,
    setMessage,
    loadConsultorios,
  } = props;

  return (
    <Fragment>
      {
        openModalConsultorio ?
          <ModalConsultorio
            open={openModalConsultorio}
            onClose={handleClose}
            consultorio={consultorio}
            handleClickGuardar={handleClickGuardarConsultorio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage} /> : ''
      }
      {
        openModalCabina ?
          <ModalCabina
            open={openModalCabina}
            onClose={handleClose}
            cabina={cabina}
            handleClickGuardar={handleClickGuardarCabina}
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

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenConsultorio}
            text='Nuevo Consultorio' />

          <TableComponent
            titulo={tituloConsultorio}
            columns={columnsConsultorio}
            data={consultorios}
            actions={actionsConsultorio}
            options={options} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenCabina}
            text='Nueva Cabina' />

          <TableComponent
            titulo={tituloCabina}
            columns={columnsCabina}
            data={cabinas}
            actions={actionsCabina}
            options={options} />
        </Grid>
      </Grid>

    </Fragment >
  );
}
