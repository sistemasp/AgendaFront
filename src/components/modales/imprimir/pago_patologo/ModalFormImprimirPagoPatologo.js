import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import { dateToString, toFormatterCurrency } from '../../../../utils/utils';

function getModalStyle() {
  return {
    overflow: 'scroll',
    height: '100%',
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 10
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    color: '#FFFFFF',
    width: '100%',
    fontSize: '18px',
    margin: 3,
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_left: {
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '10px',
  },
  label_line: {
    marginTop: '40px',
    marginBottom: '0px',
    marginLeft: '10px',
    marginRight: '10px',
  },
  labelItemRight: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'right',
  },
  label_title: {
    //backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
    color: '#000000',
    textAlign: 'center',
    padding: 10,
    margin: 0,
  },
  label_title_descripcion: {
    //backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '15px',
    margin: 0,
    padding: 3,
  },
  label_utilidad_perdida: {
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '0px',
    fontSize: '38px',
  },
  label_title_ingresos: {
    //backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '12px',
    paddingTop: 1,
    paddingBottom: 1,
    color: '#000000',
  },
  label_cells: {
    textAlign: 'center',
    fontSize: '10px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_cells_concepto: {
    textAlign: 'left',
    fontSize: '10px',
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: 10
  },
  label_cells_total: {
    textAlign: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_cells_totales: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '0px',
    marginBottom: '0px',
  },
  grid_left: {
    marginTop: '10px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
  grid_right: {
    marginTop: '10px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
  container: {
    marginTop: 18,
    border: '2px solid #000',
  },
  container_buttom: {
    marginTop: 35,
  },
  hr: {
    borderTop: '1px solid #000',
  }
}));

const ModalFormImprimirPagoPatologo = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    sucursal,
    corte,
    biopsias,
    cirugias,
    patologo,
    onClose,
    onClickImprimir,
    onClickPagar,
    open,
    onCambioTurno,
    onObtenerInformacion,
    findCorte,
    show,
    turno,
    pagoDermatologo,
    empleado,
  } = props;

  let pagoTotal = 0;

  const revisadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const derivadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const realizadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
  const noAplicaTipoCitaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <Grid container>
            <Grid item xs={3}>
              <img
                src={bannerMePiel}
                alt='banner'
                width='100%'
                height='100%' />
            </Grid>
            <Grid container xs={9}>
              <Grid item xs={12}>
                <h2 className={classes.label_title}>CENTRO DERMATOLÓGICO M. E. PIEL S. C.</h2>
              </Grid>
              <Grid item xs={8}>
                <h3 className={classes.label_left}>PATÓLOGO: {patologo.nombre}</h3>
              </Grid>
              <Grid item xs={4} >
                <h3 className={classes.label}>FECHA: {dateToString(corte.create_date)} </h3>
              </Grid>
              <Grid item xs={8} >
                <h3 className={classes.label_left}>SUCURSAL: {corte.sucursal.nombre}</h3>
              </Grid>
              <Grid item xs={4} >
                <h3 className={classes.label}>TURNO: {turno === 'm' ? 'MATUTINO' : 'VESPERTINO'} </h3>
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            {
              show ?
                <Fragment>
                  {
                    pagoDermatologo.pagado ?
                      <Grid item xs={12}>
                        <ButtonCustom
                          className={classes.button}
                          color="primary"
                          variant="contained"
                          onClick={onClickImprimir}
                          text='Imprimir' />
                      </Grid>
                      :
                      cirugias.length > 0 ?
                        <Grid item xs={12}>
                          <ButtonCustom
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            onClick={onClickPagar}
                            text='PAGAR' />
                        </Grid>
                        : ''
                  }
                  {
                    corte.hora_cierre || corte.turno === 'v' ?
                      <Fragment>
                        <Grid item xs={12} sm={6}>
                          <ButtonCustom
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            onClick={() => onCambioTurno()}
                            text='CAMBIO TURNO' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <ButtonCustom
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            onClick={() => findCorte()}
                            text='TRAER INFORMACIÓN' />
                        </Grid>
                      </Fragment>
                      : ''
                  }

                  <br />
                  <Grid item xs={12}>
                    <ButtonCustom
                      className={classes.button}
                      color="secondary"
                      variant="contained"
                      onClick={onClose}
                      text="CERRAR" />
                  </Grid>
                </Fragment> : ''
            }

            {
              cirugias.length > 0 ?
                <Grid container className={classes.container}>
                  <Grid item xs={12}>
                    <p className={classes.label_title_descripcion}> {`${cirugias.length} BIOPSIAS`}</p>
                  </Grid>
                  <Grid item xs={true} className={classes.label}>
                    <p className={classes.label_cells_totales}>HORA</p>
                  </Grid>
                  <Grid item xs={true} className={classes.label}>
                    <p className={classes.label_cells_totales}>PACIENTE</p>
                  </Grid>
                  <Grid item xs={true} className={classes.label}>
                    <p className={classes.label_cells_totales}>CONSECUTIVO</p>
                  </Grid>
                  <Grid item xs={true} className={classes.label}>
                    <p className={classes.label_cells_totales}>CANTIDAD</p>
                  </Grid>
                  <Grid item xs={12} className={classes.label}>
                    <hr className={classes.label} />
                  </Grid>

                  {
                    cirugias ?
                    cirugias.map(cirugia => {
                        const pagoPatologo = Number(cirugia.costo_biopsias);
                        pagoTotal += Number(pagoPatologo);

                        return <Grid container>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{cirugia.hora_llegada}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${cirugia.paciente.nombres} ${cirugia.paciente.apellidos}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${cirugia.consecutivo}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoPatologo)}`} </p>
                          </Grid>
                        </Grid>
                      })
                      : ''
                  }
                </Grid>
                : ''
            }

            <Grid container xs={6} className={classes.container_buttom}>
              <Grid container xs={6}>
                <Grid item xs={12} className={classes.label_line}>
                  <hr className={classes.hr} />
                </Grid>
                <Grid item xs={12} >
                  <p className={classes.label_cells_totales}>{`RECEP: ${empleado.nombre} `}</p>
                </Grid>
              </Grid>

              <Grid container xs={6}>
                <Grid item xs={12} className={classes.label_line}>
                  <hr className={classes.hr} />
                </Grid>
                <Grid item xs={12} >
                  <p className={classes.label_cells_totales}>{`PATÓLOGO: ${patologo.nombre}`}</p>
                </Grid>
              </Grid>
            </Grid>

            <Grid container xs={6} className={classes.container_buttom}>
              <Grid item xs={12} className={classes.labelItemRight}>
                <h2 className={classes.labelItemRight}>TOTAL: { patologo.pago_completo ? toFormatterCurrency(pagoTotal) : 0}</h2>
                {
                  patologo._id !== dermatologoDirectoId
                    ? <h1 className={classes.labelItemRight}>RETENCIÓN: {patologo.pago_completo ? 0 : toFormatterCurrency(pagoTotal)}</h1>
                    : ''
                }
              </Grid>
            </Grid>

          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirPagoPatologo;