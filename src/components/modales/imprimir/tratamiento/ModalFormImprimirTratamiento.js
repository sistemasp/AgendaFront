import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import { toFormatterCurrency } from '../../../../utils/utils';

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
    paddingLeft: 15,
    paddingRight: 15
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
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'center',
  },
  labelItemLeft: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'left',
  },
  labelItemRight: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'right',
  }
}));

const ModalFormImprimirTratamiento = (props) => {
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

  console.log("DATOS", datos);

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
            <br />
            <br />
            <br />
            {
              datos.tratamientos_precios.map(tratamiento => {
                return <Fragment>
                  <Grid item xs={10} className={classes.labelItem}>
                    <h4 className={classes.labelItemLeft}>{`${tratamiento.nombre}:`}</h4>
                  </Grid>
                  <Grid item xs={2} className={classes.labelItem}>
                    <h4 className={classes.labelItemRight}> {`${toFormatterCurrency(tratamiento.precio)}`} </h4>
                  </Grid>
                </Fragment>
              })
            }
            <Grid item xs={12} className={classes.labelItemRight}>
              <h1 className={classes.labelItemRight}>TOTAL: {datos.precio_moneda}</h1>
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

export default ModalFormImprimirTratamiento; 