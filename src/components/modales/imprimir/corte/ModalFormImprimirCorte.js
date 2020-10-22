import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import { EventNote } from '@material-ui/icons';
import Corte from '../../../../containers/menu_corte';
import { dateToString, toFormatterCurrency } from '../../../../utils/utils';

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
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
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
    width: '100%',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_title: {
    backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label_title_descripcion: {
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_title_ingresos: {
    backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '13px',
    paddingTop: 1,
    paddingBottom: 1,
    color: '#FFFFFF',
  },
  label_cells: {
    textAlign: 'center',
    fontSize: '12px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_cells_concepto: {
    textAlign: 'left',
    fontSize: '12px',
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: 10
  },
  label_cells_total: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '0px',
    marginBottom: '0px',
  },
  label_cells_totales: {
    textAlign: 'center',
    fontSize: '14px',
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
  }
}));

const ModalFormImprimirCorte = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    corte,
    onClose,
    onClickImprimir,
    open,
    show,
    tipoIngresos,
    tipoEgresos,
    metodoPagos,
    dataIngresos,
    dataEgresos,
  } = props;

  let totalIngresos = 0;
  let totalEfectivo = 0;
  let pagoMedicos = 0;
  let retirosParciales = 0;
  let otrosEgresos = 0;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <Grid container>

            <Grid item xs={3}>
              <img src={bannerMePiel} alt='banner' width='100%' height='100%' />
            </Grid>
            <Grid container xs={9}>
              <Grid item xs={12} className={classes.label}>
                <h2 className={classes.label_title}>CENTRO DERMATOLÓGICO M. E. PIEL S. C.</h2>
              </Grid>
              <Grid item xs={8}>
                <h3 className={classes.label}>RECEPCIONISTA: {corte.recepcionista.nombre}</h3>
              </Grid>
              <Grid item xs={4} >
                <h3 className={classes.label}>FECHA: {dateToString(corte.create_date)} </h3>
              </Grid>
              <Grid item xs={8} >
                <h3 className={classes.label}>SUCURSAL: {corte.sucursal.nombre}</h3>
              </Grid>
              <Grid item xs={4} >
                <h3 className={classes.label}>TURNO: {corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO'} </h3>
              </Grid>
            </Grid>

            <Grid container xs={12} className={classes.grid_left}>
              <Grid item xs={12} className={classes.label}>
                <h2 className={classes.label_title_descripcion} >INGRESOS BRUTOS</h2>
              </Grid>
              <Grid container>
                <Grid item xs={true} className={classes.label}>
                  <p className={classes.label_title_ingresos}>METODO PAGO</p>
                </Grid>

                {
                  tipoIngresos.map(tipoIngreso => {
                    return (
                      <Grid item xs={true} className={classes.label}>
                        <p className={classes.label_title_ingresos}>{tipoIngreso.nombre}</p>
                      </Grid>
                    )
                  })
                }
                <Grid item xs={true} className={classes.label}>
                  <p className={classes.label_title_ingresos}>TOTAL</p>
                </Grid>
              </Grid>

              {
                metodoPagos.map(metodoPago => {
                  return (
                    <Fragment>
                      <Grid container>
                        <Grid item xs={true} className={classes.label}>
                          <h3 className={classes.label_cells_concepto}>{metodoPago.nombre}</h3>
                        </Grid>
                        {
                          dataIngresos ? dataIngresos.filter(dataIngreso => {
                            return dataIngreso.metodo_pago === metodoPago.nombre
                          }).map(dataIngreso => {
                            totalIngresos += dataIngreso.total;
                            totalEfectivo += dataIngreso.metodo_pago === 'EFECTIVO' ? dataIngreso.total : 0;

                            return (
                              <Fragment>
                                {
                                  tipoIngresos.map(tipoIngreso => {
                                    const ingreso = dataIngreso.tipo_ingresos_detalles.find(detalle => {
                                      return detalle.tipo_ingreso === tipoIngreso.nombre;
                                    });
                                    return <Grid item xs={true} className={classes.label}>
                                      <h3 className={classes.label_cells}>{ingreso ? ingreso.total_moneda : '-'}</h3>
                                    </Grid>
                                  })
                                }
                                <Grid item xs={true} className={classes.label_cells}>
                                  <h3 className={classes.label_cells}>{dataIngreso.total_moneda}</h3>
                                </Grid>
                              </Fragment>

                            )
                          }) : ''
                        }
                      </Grid>
                    </Fragment>
                  )
                })
              }
              <Grid item xs={true} className={classes.label}>
                <h3 className={classes.label_cells_totales}>TOTALES</h3>
              </Grid>
            </Grid>
            {
              dataEgresos.map(dataEgreso => {
                {
                  pagoMedicos += dataEgreso.tipo_egreso === 'PAGO MEDICO' ? dataEgreso.total : 0;
                  retirosParciales += dataEgreso.tipo_egreso === 'RETIRO PARCIAL' ? dataEgreso.total : 0;
                  otrosEgresos += dataEgreso.tipo_egreso === 'OTROS EGRESOS' ? dataEgreso.total : 0;
                }
                return (
                  <Grid container xs={4} className={classes.grid_left}>
                    <Grid item xs={12} className={classes.label}>
                      <h2 className={classes.label_title_descripcion} > {dataEgreso.tipo_egreso}</h2>
                    </Grid>
                    <Grid item xs={9} className={classes.label}>
                      <p className={classes.label_title_ingresos}>CONCEPTO</p>
                    </Grid>
                    <Grid item xs={3} className={classes.label}>
                      <p className={classes.label_title_ingresos}>CANTIDAD</p>
                    </Grid>
                    {
                      dataEgreso.egresos_por_tipo.map(egreso => {
                        return (
                          <Fragment>
                            <Grid item xs={9} className={classes.label}>
                              <h3 className={classes.label_cells_concepto}>{egreso.concepto}</h3>
                            </Grid>
                            <Grid item xs={3} className={classes.label}>
                              <h3 className={classes.label_cells_total}>{egreso.cantidad_moneda}</h3>
                            </Grid>
                          </Fragment>

                        )
                      })
                    }
                  </Grid>
                );
              })
            }
            <Grid container xs={6} className={classes.grid_right}>
              <Grid item xs={12} className={classes.label}>
                <h2 className={classes.label_title_descripcion}> BALANCE </h2>
              </Grid>
              <Grid item xs={8} className={classes.label}>
                <p className={classes.label_title_ingresos}>CONCEPTO</p>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <p className={classes.label_title_ingresos}>CANTIDAD</p>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <p className={classes.label_cells_concepto}>TOTAL INGRESOS BRUTOS</p>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <p className={classes.label_cells}>{toFormatterCurrency(totalIngresos)}</p>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <p className={classes.label_cells_concepto}>TOTAL EN EFECTIVO</p>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <p className={classes.label_cells}>{toFormatterCurrency(totalEfectivo)}</p>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <p className={classes.label_cells_concepto}>TOTAL PAGO MEDICOS</p>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <p className={classes.label_cells}>{toFormatterCurrency(pagoMedicos)}</p>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <p className={classes.label_cells_concepto}>TOTAL RETIROS PARCIALES</p>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <p className={classes.label_cells}>{toFormatterCurrency(retirosParciales)}</p>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <p className={classes.label_cells_concepto}>TOTAL OTROS EGRESOS</p>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <p className={classes.label_cells}>{toFormatterCurrency(otrosEgresos)}</p>
              </Grid>

            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirCorte;