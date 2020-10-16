import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalConsultorio from '../../components/modales/modal_consultorio';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  }
}));

export const CorteContainer = (props) => {

  const classes = useStyles();

  const {
    tituloIngreso,
    tituloEgreso,
    columns,
    consultorios,
    consultorio,
    options,
    openModal,
    handleOpen,
    handleClose,
    handleClickGuardar,
  } = props;

  return (
    <Fragment>
      {
        openModal ?
          <ModalConsultorio
            open={openModal}
            onClose={handleClose}
            consultorio={consultorio}
            handleClickGuardar={handleClickGuardar} /> : ''
      }

      <ButtonCustom
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleOpen}
        text='Generar corte' />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TableComponent
            titulo={tituloIngreso}
            columns={columns}
            data={consultorios}
            options={options} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableComponent
            titulo={tituloEgreso}
            columns={columns}
            data={consultorios}
            options={options} />
        </Grid>
      </Grid>

    </Fragment>
  );
}
