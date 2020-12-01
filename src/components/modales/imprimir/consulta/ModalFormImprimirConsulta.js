import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    paddingLeft: 15
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'center',
  }
}));

const ModalFormImprimirConsulta = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    datos,
    onClose,
    onClickImprimir,
    open,
    show,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <img src={bannerMePiel} alt='banner' width="360" height="85" />
          <Grid container>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label} >"Al cuidado de tu Piel"</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>Sucursal: {datos.sucursal.nombre}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h3 className={classes.label}>Paciente: {datos.paciente_nombre}</h3>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h3 className={classes.label}>Folio: {datos.folio}</h3>
            </Grid>
            <br/>
            <Grid item xs={12} >
              <h2>1 CONSULTA {datos.precio_moneda}</h2>
            </Grid>

            {
              show ?
                <Fragment>
                  <Grid item xs={12}>
                    <Button
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      onClick={onClickImprimir} >
                      Imprimir
                </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      className={classes.button}
                      color="secondary"
                      variant="contained"
                      onClick={onClose} >
                      Cerrar
              </Button>
                  </Grid>
                </Fragment> : ''

            }
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirConsulta;