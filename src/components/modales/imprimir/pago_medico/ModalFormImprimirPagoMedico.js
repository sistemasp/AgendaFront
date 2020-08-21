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
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    paddingLeft: 30,
    paddingRight: 30
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
  },
  labelItemCenter: {
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

const ModalFormImprimirPagoMedico = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    sucursal,
    consultas,
    medico,
    onClose,
    onClickImprimir,
    open,
    show,
  } = props;

  let pagoTotal = 0;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <br />
          <Grid item xs={12} className={classes.labelItemRight} >
            <img src={bannerMePiel} alt='banner' width="330" height="85" />
          </Grid>

          <Grid container>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.labelItemCenter} >"Al cuidado de tu Piel"</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.labelItemCenter}>Sucursal: {sucursal.nombre}</h2>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h3 className={classes.labelItemCenter}>Médico: {medico.nombre}</h3>
            </Grid>
            <br />
            <br />

            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.labelItemLeft}> CONSULTAS </h2>
            </Grid>
            <Grid item xs={4} >
              <h3 className={classes.labelItemLeft}>{`Paciente`}</h3>
            </Grid>
            <Grid item xs={4} >
              <h3 className={classes.labelItemCenter}>{`Consecutivo`}</h3>
            </Grid>
            <Grid item xs={4} >
              <h3 className={classes.labelItemRight}> {`Cantidad a pagar`} </h3>
            </Grid>
            <Grid item xs={12} className={classes.label}>
              <h5 className={classes.labelItemCenter}>__________________________________________________________________________________________________________________________________________</h5>
            </Grid>
            {
              consultas ?
                consultas.map(consulta => {
                  const pagoMedico = Number(consulta.precio) * Number(medico.porcentaje) / 100;
                  pagoTotal += Number(pagoMedico);
                  return <Fragment>
                    <Grid item xs={4} >
                      <h4 className={classes.labelItemLeft}>{`${consulta.paciente.nombres} ${consulta.paciente.apellidos}`}</h4>
                    </Grid>
                    <Grid item xs={4} >
                      <h4 className={classes.labelItemCenter}>{`${consulta.consecutivo}`}</h4>
                    </Grid>
                    <Grid item xs={4} >
                      <h4 className={classes.labelItemRight}> {`${toFormatterCurrency(pagoMedico)}`} </h4>
                    </Grid>
                  </Fragment>
                })
                : ''
            }

            <br />
            <br />

            <Grid item xs={12} className={classes.labelItemRight}>
              <h2 className={classes.labelItemRight}>TOTAL: {toFormatterCurrency(pagoTotal)}</h2>
              <h1 className={classes.labelItemRight}>RETENCIÓN: {toFormatterCurrency(pagoTotal / 2)}</h1>
            </Grid>

            <h1>
              <br />
              <br />
              <br />
            </h1>

            <Grid container xs={6} className={classes.labelItemLeft}>
              <Grid item xs={12} >
                <h4 className={classes.labelItemCenter}>{`_______________________________`}</h4>
              </Grid>
              <Grid item xs={12} >
                <h4 className={classes.labelItemCenter}>{`Firma Recepcionista`}</h4>
              </Grid>
            </Grid>

            <Grid container xs={6} className={classes.labelItemRight}>
              <Grid item xs={12} >
                <h4 className={classes.labelItemCenter}>{`_______________________________`}</h4>
              </Grid>
              <Grid item xs={12} >
                <h4 className={classes.labelItemCenter}>{`Firma Médico⁭⁭⁭⁭⁭⁭⁭⁭`}</h4>
              </Grid>
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

export default ModalFormImprimirPagoMedico;