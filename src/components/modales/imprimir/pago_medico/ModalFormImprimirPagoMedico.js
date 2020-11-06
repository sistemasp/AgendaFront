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

const ModalFormImprimirPagoMedico = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    sucursal,
    corte,
    consultasPrimeraVez,
    consultasReconsultas,
    cirugias,
    esteticas,
    faciales,
    lasers,
    aparatologias,
    medico,
    onClose,
    onClickImprimir,
    onClickPagar,
    open,
    onCambioTurno,
    onObtenerInformacion,
    findCorte,
    show,
    turno,
    pagoMedico,
    empleado,
  } = props;

  let pagoTotal = 0;

  const revisadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const derivadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const realizadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const noAplicaTipoCitaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
  const manuelAcunaSucursalId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;

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
                <h3 className={classes.label_left}>MÉDICO: {medico.nombre}</h3>
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
                    pagoMedico.pagado ?
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
                      faciales.length > 0 || lasers.length > 0 || aparatologias.length > 0  ?
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
                      Cerrar
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
                        consulta.pagos.map(pago => {
                          totalPagos += Number(pago.total);
                        });
                        const pagoMedico = Number(totalPagos) * Number(medico.porcentaje) / 100;
                        pagoTotal += Number(pagoMedico);

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
                            <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
                        consulta.pagos.map(pago => {
                          totalPagos += Number(pago.total);
                        });
                        const pagoMedico = Number(totalPagos) * Number(medico.porcentaje) / 100;
                        pagoTotal += Number(pagoMedico);
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
                            <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
                          const pagoMedico = Number(cirugia.precio) * Number(medico.porcentaje) / 100;
                          pagoTotal += Number(pagoMedico);
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
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
                          const pagoMedico = Number(estetica.precio) * Number(medico.porcentaje_estetica) / 100;
                          pagoTotal += Number(pagoMedico);
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
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
                          let comisionMedico = 0;
                          facial.areas.map(area => {
                            switch (facial.tipo_cita._id) {
                              case revisadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
                                break;
                              case derivadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
                                break;
                              case realizadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
                                break;
                              case noAplicaTipoCitaId:
                                comisionMedico += Number(0);
                                break;
                            }
                          });
                          const pagoMedico = comisionMedico;
                          pagoTotal += Number(pagoMedico);
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
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
              lasers.length > 0 ?
                <Fragment>
                  <Grid container className={classes.container}>
                    <Grid item xs={12} >
                      <p className={classes.label_title_descripcion}> {`${lasers.length} LASER`}</p>
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
                      lasers ?
                        lasers.map(laser => {
                          let comisionMedico = 0;
                          laser.areas.map(area => {
                            switch (laser.tipo_cita._id) {
                              case revisadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
                                break;
                              case derivadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
                                break;
                              case realizadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
                                break;
                              case noAplicaTipoCitaId:
                                comisionMedico += Number(0);
                                break;
                            }
                          });
                          const pagoMedico = comisionMedico;
                          pagoTotal += Number(pagoMedico);
                          return <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{laser.hora_llegada}</p>
                            </Grid>
                            <Grid item xs={true} className={classes.label}>
                              <p className={classes.label_cells}>{laser.tipo_cita.nombre}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${laser.paciente.nombres} ${laser.paciente.apellidos}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells}>{`${laser.consecutivo}`}</p>
                            </Grid>
                            <Grid item xs={true} >
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
                          let comisionMedico = 0;
                          aparatologia.areas.map(area => {
                            switch (aparatologia.tipo_cita._id) {
                              case revisadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
                                break;
                              case derivadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
                                break;
                              case realizadoTipoCitaId:
                                comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
                                break;
                              case noAplicaTipoCitaId:
                                comisionMedico += Number(0);
                                break;
                            }
                          });
                          const pagoMedico = comisionMedico;
                          pagoTotal += Number(pagoMedico);
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
                              <p className={classes.label_cells_total}> {`${toFormatterCurrency(pagoMedico)}`} </p>
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
                  <p className={classes.label_cells_totales}>{`MÉDICO: ${medico.nombre}`}</p>
                </Grid>
              </Grid>
            </Grid>

            <Grid container xs={6} className={classes.container_buttom}>
              <Grid item xs={12} className={classes.labelItemRight}>
                <h2 className={classes.labelItemRight}>TOTAL: {toFormatterCurrency(pagoTotal)}</h2>
                <h1 className={classes.labelItemRight}>RETENCIÓN: {toFormatterCurrency(pagoTotal / 2)}</h1>
              </Grid>
            </Grid>

          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirPagoMedico;