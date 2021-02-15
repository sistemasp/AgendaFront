import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Grid } from '@material-ui/core';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import { addZero, dateToString, toFormatterCurrency } from '../../../../utils/utils';

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

const ModalFormImprimirPagoDermatologo = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;

  const {
    sucursal,
    corte,
    consultasPrimeraVez,
    consultasPrimeraVezPA,
    consultasReconsultas,
    consultasReconsultasPA,
    cirugias,
    cirugiasPA,
    esteticas,
    esteticasPA,
    faciales,
    facialesPA,
    dermapens,
    dermapensPA,
    aparatologias,
    aparatologiasPA,
    dermatologo,
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

  const listaFaciales = [...faciales, ...facialesPA];
  const listaAparatologias = [...aparatologias, ...aparatologiasPA];

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
                <h3 className={classes.label_left}>DERMATÓLOGO: {dermatologo.nombre}</h3>
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
                      consultasPrimeraVez.length > 0 || consultasReconsultas.length > 0 || cirugias.length > 0 || esteticas.length > 0 ||
                        listaFaciales.length > 0 || dermapens.length > 0 || listaAparatologias.length > 0 ?
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
                    <Button
                      className={classes.button}
                      color="secondary"
                      variant="contained"
                      onClick={onClose} >
                      CERRAR
              </Button>
                  </Grid>
                </Fragment> : ''
            }

            {
              consultasPrimeraVez.length > 0 ?
                <Grid container className={classes.container}>
                  <Grid item xs={12}>
                    <p className={classes.label_title_descripcion}> {`${consultasPrimeraVez.length} CONSULTAS DE PRIMERA VEZ`}</p>
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
                    consultasPrimeraVez ?
                      consultasPrimeraVez.map(consulta => {
                        let totalPagos = 0;
                        if (!consulta.has_descuento_dermatologo) {
                          consulta.pagos.map(pago => {
                            totalPagos += Number(pago.total);
                          });
                        }
                        const pagoDermatologo = Number(totalPagos) * Number(dermatologo.esquema.porcentaje_consulta) / 100;
                        pagoTotal += Number(pagoDermatologo);

                        return <Grid container>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{consulta.hora_llegada}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.paciente.nombres} ${consulta.paciente.apellidos}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.consecutivo}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                          </Grid>
                        </Grid>
                      })
                      : ''
                  }
                </Grid>
                : ''
            }

            {
              consultasPrimeraVezPA.length > 0 ?
                <Grid container className={classes.container}>
                  <Grid item xs={12}>
                    <p className={classes.label_title_descripcion}> {`${consultasPrimeraVezPA.length} CONSULTAS DE PRIMERA VEZ PAGO ANTICIPADO`}</p>
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
                    consultasPrimeraVezPA ?
                      consultasPrimeraVezPA.map(consulta => {
                        return <Grid container>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{consulta.hora_llegada}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.paciente.nombres} ${consulta.paciente.apellidos}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.consecutivo}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{toFormatterCurrency(
                              dermatologo._id === dermatologoDirectoId
                                ? consulta.precio
                                : '0'
                            )}</p>
                          </Grid>
                        </Grid>
                      })
                      : ''
                  }
                </Grid>
                : ''
            }

            {
              consultasReconsultas.length > 0 ?
                <Grid container className={classes.container}>
                  <Grid item xs={12}>
                    <p className={classes.label_title_descripcion}> {`${consultasReconsultas.length} RECONSULTAS`}</p>
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
                    consultasReconsultas ?
                      consultasReconsultas.map(consulta => {
                        let totalPagos = 0;
                        if (!consulta.has_descuento_dermatologo) {
                          consulta.pagos.map(pago => {
                            totalPagos += Number(pago.total);
                          });
                        }
                        const pagoDermatologo = Number(totalPagos) * Number(dermatologo.esquema.porcentaje_reconsulta) / 100;

                        pagoTotal += Number(pagoDermatologo);
                        return <Grid container>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{consulta.hora_llegada}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.paciente.nombres} ${consulta.paciente.apellidos}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.consecutivo}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                          </Grid>
                        </Grid>
                      })
                      : ''
                  }
                </Grid>
                : ''
            }

            {
              consultasReconsultasPA.length > 0 ?
                <Grid container className={classes.container}>
                  <Grid item xs={12}>
                    <p className={classes.label_title_descripcion}> {`${consultasReconsultasPA.length} RECONSULTAS PAGO ANTICIPADO`}</p>
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
                    consultasReconsultasPA ?
                      consultasReconsultasPA.map(consulta => {
                        return <Grid container>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{consulta.hora_llegada}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.paciente.nombres} ${consulta.paciente.apellidos}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{`${consulta.consecutivo}`}</p>
                          </Grid>
                          <Grid item xs={true} className={classes.label}>
                            <p className={classes.label_cells}>{toFormatterCurrency(
                              dermatologo._id === dermatologoDirectoId
                                ? consulta.precio
                                : '0'
                            )}</p>
                          </Grid>
                        </Grid>
                      })
                      : ''
                  }
                </Grid>
                : ''
            }

            {
              cirugias.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${cirugias.length} CIRUGIAS`}</p>
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
                          const pagoDermatologo = cirugia.has_descuento_dermatologo ? 0 : Number(cirugia.total_aplicacion) * Number(dermatologo.esquema.porcentaje_cirugias) / 100;
                          pagoTotal += Number(pagoDermatologo);
                          const date = new Date(cirugia.hora_aplicacion);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${addZero(date.getHours())}:${addZero(date.getMinutes())}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${cirugia.paciente.nombres} ${cirugia.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${cirugia.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              cirugiasPA.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${cirugiasPA.length} CIRUGIAS PAGO ANTICIPADO`}</p>
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
                      cirugiasPA ?
                        cirugiasPA.map(cirugia => {
                          const date = new Date(cirugia.hora_aplicacion);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${addZero(date.getHours())}:${addZero(date.getMinutes())}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${cirugia.paciente.nombres} ${cirugia.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${cirugia.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{toFormatterCurrency('0')}</p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              esteticas.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${esteticas.length} TOXINAS Y RELLENOS`}</p>
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
                      esteticas ?
                        esteticas.map(estetica => {
                          console.log("KAOZ", estetica);
                          const pagoDermatologo = estetica.has_descuento_dermatologo ? 0 : Number(estetica.total_aplicacion) * Number(dermatologo.esquema.porcentaje_dermocosmetica) / 100;
                          pagoTotal += Number(pagoDermatologo);
                          const date = new Date(estetica.hora_aplicacion);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${addZero(date.getHours())}:${addZero(date.getMinutes())}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${estetica.paciente.nombres} ${estetica.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${estetica.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              esteticasPA.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${esteticasPA.length} TOXINAS Y RELLENOS PAGO ANTICIPADO`}</p>
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
                      esteticasPA ?
                        esteticasPA.map(estetica => {
                          const date = new Date(estetica.hora_aplicacion);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${addZero(date.getHours())}:${addZero(date.getMinutes())}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${estetica.paciente.nombres} ${estetica.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{`${estetica.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{toFormatterCurrency('0')}</p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              faciales.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${faciales.length} FACIALES`}</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>HORA</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>TIPO DE CITA</p>
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
                      faciales ?
                        faciales.map(facial => {
                          let comisionDermatologo = 0;
                          let pagoDermatologo = 0;
                          if (!facial.has_descuento_dermatologo) {
                            facial.tratamientos.map(tratamiento => {
                              tratamiento.areasSeleccionadas.map(areaSeleccionada => {
                                switch (facial.tipo_cita._id) {
                                  case revisadoTipoCitaId:
                                    comisionDermatologo += Number(
                                      sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_revisado_ma
                                        : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_revisado_rd
                                          : areaSeleccionada.comision_revisado)
                                    );
                                    break;
                                  case derivadoTipoCitaId:
                                    comisionDermatologo += Number(
                                      sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_derivado_ma
                                        : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_derivado_rd
                                          : areaSeleccionada.comision_derivado)
                                    );
                                    break;
                                  case realizadoTipoCitaId:
                                    comisionDermatologo += Number(
                                      sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_realizado_ma
                                        : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_realizado_rd
                                          : areaSeleccionada.comision_realizado)
                                    );
                                    break;
                                  case directoTipoCitaId: // TOMA EL 100%
                                    comisionDermatologo += Number(
                                      sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
                                        : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                                          : areaSeleccionada.precio_fe)
                                    );
                                    break;
                                  case noAplicaTipoCitaId:
                                    comisionDermatologo += Number(0);
                                    break;
                                }
                              });
                            });
                            pagoDermatologo = comisionDermatologo - ((comisionDermatologo * facial.porcentaje_descuento_clinica ? facial.porcentaje_descuento_clinica : 0) / 100);
                            pagoTotal += Number(pagoDermatologo);
                          }
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{facial.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{facial.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${facial.paciente.nombres} ${facial.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${facial.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              facialesPA.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${facialesPA.length} FACIALES PAGO ANTICIPADO`}</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>HORA</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>TIPO DE CITA</p>
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
                      facialesPA ?
                        facialesPA.map(facial => {
                          let pagoDermatologoDirecto = 0;
                          facial.tratamientos.map(tratamiento => {
                            tratamiento.areasSeleccionadas.map(areaSeleccionada => {
                              // TOMA EL 100%
                              pagoDermatologoDirecto += Number(
                                sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
                                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                                    : areaSeleccionada.precio_fe)
                              );
                            });
                          });
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{facial.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{facial.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${facial.paciente.nombres} ${facial.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${facial.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{toFormatterCurrency(
                                dermatologo._id === dermatologoDirectoId
                                  ? pagoDermatologoDirecto
                                  : '0'
                              )}</p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              dermapens.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${dermapens.length} DERMAPENS`}</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>HORA</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>TIPO DE CITA</p>
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
                      dermapens ?
                        dermapens.map(dermapen => {
                          const pagoDermatologo = dermapen.has_descuento_dermatologo ? 0 : Number(dermapen.total_aplicacion) * Number(dermatologo.esquema.porcentaje_dermocosmetica) / 100;
                          pagoTotal += Number(pagoDermatologo);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{dermapen.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{dermapen.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${dermapen.paciente.nombres} ${dermapen.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${dermapen.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              dermapensPA.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12}>
                      <p className={classes.label_title_descripcion}> {`${dermapensPA.length} DERMAPENS PAGO ANTICIPADO`}</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>HORA</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>TIPO DE CITA</p>
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
                      dermapensPA ?
                        dermapensPA.map(dermapen => {
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{dermapen.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{dermapen.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${dermapen.paciente.nombres} ${dermapen.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${dermapen.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{toFormatterCurrency('0')}</p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              aparatologias.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12} >
                      <p className={classes.label_title_descripcion}> {`${aparatologias.length} APARATOLOGIA`}</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>HORA</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>TIPO DE CITA</p>
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
                      aparatologias ?
                        aparatologias.map(aparatologia => {
                          let comisionDermatologo = 0;
                          aparatologia.tratamientos.forEach(tratamiento => {

                            tratamiento.areasSeleccionadas.map(area => {
                              const itemPrecio = 
                                sucursal._id === sucursalManuelAcunaId ? area.precio_ma // Precio Manuel Acuña
                                  : (sucursal._id === sucursalOcciId ? area.precio_oc // Precio Occidental
                                    : (sucursal._id === sucursalFedeId ? area.precio_fe // Precio Federalismo
                                      : (sucursal._id === sucursalRubenDarioId ? area.precio_rd // PRECIO RUBEN DARIO
                                        : 0))); // Error
                              comisionDermatologo += (Number(itemPrecio) * Number(aparatologia.frecuencia === frecuenciaPrimeraVezId ? dermatologo.esquema.porcentaje_laser : 0) / 100);
                            });
                          });
                          let pagoDermatologo = comisionDermatologo - ((comisionDermatologo * (aparatologia.porcentaje_descuento_clinica ? aparatologia.porcentaje_descuento_clinica : 0)) / 100);

                          pagoDermatologo = aparatologia.has_descuento_dermatologo ? 0 : pagoDermatologo;
                          pagoTotal += Number(pagoDermatologo);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{aparatologia.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{aparatologia.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${aparatologia.paciente.nombres} ${aparatologia.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${aparatologia.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoDermatologo)}`} </p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
                : ''
            }

            {
              aparatologiasPA.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12} >
                      <p className={classes.label_title_descripcion}> {`${aparatologiasPA.length} APARATOLOGIA PAGO ANTICIPADO`}</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>HORA</p>
                    </Grid>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_cells_totales}>TIPO DE CITA</p>
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
                      aparatologiasPA ?
                        aparatologiasPA.map(aparatologia => {
                          let pagoDermatologoDirecto = 0;
                          aparatologia.tratamientos.forEach(tratamiento => {

                            tratamiento.areasSeleccionadas.map(area => {
                              const itemPrecio =
                                sucursal._id === sucursalManuelAcunaId ? area.precio_ma // Precio Manuel Acuña
                                  : (sucursal._id === sucursalOcciId ? area.precio_oc // Precio Occidental
                                    : (sucursal._id === sucursalFedeId ? area.precio_fe // Precio Federalismo
                                      : (sucursal._id === sucursalRubenDarioId ? area.precio_rd // Precio RUBEN DARIO
                                        : 0))); // Error
                              pagoDermatologoDirecto += Number(itemPrecio);
                            });
                          });
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{aparatologia.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{aparatologia.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${aparatologia.paciente.nombres} ${aparatologia.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${aparatologia.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{toFormatterCurrency(
                                dermatologo._id === dermatologoDirectoId
                                  ? pagoDermatologoDirecto
                                  : '0'
                              )}</p>
                            </Grid>
                          </Grid>
                        })
                        : ''
                    }
                  </Grid>
                </Fragment>
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
                  <p className={classes.label_cells_totales}>{`DERMATÓLOGO: ${dermatologo.nombre}`}</p>
                </Grid>
              </Grid>
            </Grid>

            <Grid container xs={6} className={classes.container_buttom}>
              <Grid item xs={12} className={classes.labelItemRight}>
                <h2 className={classes.labelItemRight}>TOTAL: {toFormatterCurrency(pagoTotal)}</h2>
                {
                  dermatologo._id !== dermatologoDirectoId
                    ? <h1 className={classes.labelItemRight}>RETENCIÓN: {toFormatterCurrency(dermatologo.pago_completo ? 0 : (pagoTotal / 2))}</h1>
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

export default ModalFormImprimirPagoDermatologo;