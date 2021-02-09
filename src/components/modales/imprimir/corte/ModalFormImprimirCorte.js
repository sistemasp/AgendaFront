import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
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
    //backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
    color: '#000000',
    textAlign: 'center',
  },
  label_title_descripcion: {
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '0px',
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
    fontSize: '13px',
    paddingTop: 1,
    paddingBottom: 1,
    marginTop: 0,
    marginBottom: 0,
    color: '#000000',
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
    formaPagos,
    dataIngresos,
    dataPagosAnticipados,
    dataEgresos,
    empleado,
  } = props;

  let totalIngresos = 0;
  let totalPagosAnticipados = 0;
  let totalEfectivo = 0;
  let pagoDermatologos = 0;
  let retirosParciales = 0;
  let otrosEgresos = 0;

  let totalesIngresos = [0, 0, 0, 0, 0, 0, 0];
  let totalesPagosAnticipados = [0, 0, 0, 0, 0, 0, 0];

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
                <h3 className={classes.label}>RECEPCIONISTA: {empleado.nombre}</h3>
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
                  <p className={classes.label_title_ingresos}>FORMA PAGO</p>
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
                formaPagos.map(formaPago => {
                  return (
                    <Fragment>
                      <Grid container>
                        <Grid item xs={true} className={classes.label}>
                          <h3 className={classes.label_cells_concepto}>{formaPago.nombre}</h3>
                        </Grid>
                        {
                          dataIngresos ? dataIngresos.filter(dataIngreso => {
                            return dataIngreso.forma_pago === formaPago.nombre
                          }).map((dataIngreso) => {
                            totalIngresos += dataIngreso.forma_pago !== 'NO PAGA' ? dataIngreso.total : 0;
                            totalEfectivo += dataIngreso.forma_pago === 'EFECTIVO' ? dataIngreso.total : 0;

                            return (
                              <Fragment>
                                {
                                  tipoIngresos.map((tipoIngreso, index) => {
                                    const ingreso = dataIngreso.tipo_ingresos_detalles.find(detalle => {
                                      return detalle.tipo_ingreso === tipoIngreso.nombre;
                                    });
                                    totalesIngresos[index] += ingreso ? Number(ingreso.total) : Number(0);
                                    return (
                                      <Grid item xs={true} className={classes.label}>
                                        <p className={classes.label_cells}>{ingreso ? ingreso.total_moneda : '-'}</p>
                                      </Grid>
                                    )
                                  })
                                }
                                <Grid item xs={true} className={classes.label_cells_total}>
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
              {
                totalesIngresos.map(val => {
                  return (
                    <Grid item xs={true} className={classes.label}>
                      <h3 className={classes.label_cells_totales}>{toFormatterCurrency(val)}</h3>
                    </Grid>
                  )
                })
              }
              <Grid item xs={true} className={classes.label}>
                <h3 className={classes.label_cells_totales}>{toFormatterCurrency(totalIngresos)}</h3>
              </Grid>
            </Grid>

            {
              dataPagosAnticipados.length > 0 ?
                <Grid container xs={12} className={classes.grid_left}>
                  <Grid item xs={12} className={classes.label}>
                    <h2 className={classes.label_title_descripcion} >PAGOS ANTICIPADOS</h2>
                  </Grid>
                  <Grid container>
                    <Grid item xs={true} className={classes.label}>
                      <p className={classes.label_title_ingresos}>FORMA PAGO</p>
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
                    formaPagos.map(formaPago => {
                      return (
                        <Fragment>
                          <Grid container>
                            <Grid item xs={true} className={classes.label}>
                              <h3 className={classes.label_cells_concepto}>{formaPago.nombre}</h3>
                            </Grid>
                            {
                              dataPagosAnticipados ? dataPagosAnticipados.filter(dataPagoAnticipado => {
                                return dataPagoAnticipado.forma_pago === formaPago.nombre
                              }).map((dataPagoAnticipado) => {
                                totalPagosAnticipados += dataPagoAnticipado.total;
                                //totalEfectivo += dataPagoAnticipado.forma_pago === 'EFECTIVO' ? dataPagoAnticipado.total : 0;

                                return (
                                  <Fragment>
                                    {
                                      tipoIngresos.map((tipoIngreso, index) => {
                                        const ingreso = dataPagoAnticipado.tipo_ingresos_detalles.find(detalle => {
                                          return detalle.tipo_ingreso === tipoIngreso.nombre;
                                        });
                                        totalesPagosAnticipados[index] += ingreso ? Number(ingreso.total) : Number(0);
                                        return (
                                          <Grid item xs={true} className={classes.label}>
                                            <p className={classes.label_cells}>{ingreso ? ingreso.total_moneda : '-'}</p>
                                          </Grid>
                                        )
                                      })
                                    }
                                    <Grid item xs={true} className={classes.label_cells_total}>
                                      <h3 className={classes.label_cells}>{dataPagoAnticipado.total_moneda}</h3>
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
                  {
                    totalesPagosAnticipados.map(val => {
                      return (
                        <Grid item xs={true} className={classes.label}>
                          <h3 className={classes.label_cells_totales}>{toFormatterCurrency(val)}</h3>
                        </Grid>
                      )
                    })
                  }
                  <Grid item xs={true} className={classes.label}>
                    <h3 className={classes.label_cells_totales}>{toFormatterCurrency(totalPagosAnticipados)}</h3>
                  </Grid>
                </Grid>
                : ''
            }

            {
              dataEgresos.map(dataEgreso => {
                {
                  pagoDermatologos += dataEgreso.tipo_egreso === 'PAGO DERMATÓLOGOS' ? dataEgreso.total : 0;
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
                      dataEgreso.egresos_por_tipo.map((egreso) => {
                        return (
                          <Fragment>
                            <Grid item xs={9} className={classes.label}>
                              <h3 className={classes.label_cells_concepto}>{egreso.concepto}</h3>
                            </Grid>
                            <Grid item xs={3} className={classes.label}>
                              <p className={classes.label_cells_total}>{egreso.cantidad_moneda}</p>
                            </Grid>
                          </Fragment>

                        )
                      })
                    }
                  </Grid>
                );
              })
            }
            <Grid container xs={6} className={classes.grid_left}>
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
                <h3 className={classes.label_cells_concepto}>TOTAL INGRESOS BRUTOS</h3>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <h3 className={classes.label_cells}>{toFormatterCurrency(totalIngresos)}</h3>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <h3 className={classes.label_cells_concepto}>TOTAL EN EFECTIVO</h3>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <h3 className={classes.label_cells}>{toFormatterCurrency(totalEfectivo)}</h3>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <h3 className={classes.label_cells_concepto}>TOTAL PAGO DERMATÓLOGOS</h3>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <h3 className={classes.label_cells}>{toFormatterCurrency(pagoDermatologos)}</h3>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <h3 className={classes.label_cells_concepto}>TOTAL RETIROS PARCIALES</h3>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <h3 className={classes.label_cells}>{toFormatterCurrency(retirosParciales)}</h3>
              </Grid>

              <Grid item xs={8} className={classes.label}>
                <h3 className={classes.label_cells_concepto}>TOTAL OTROS EGRESOS</h3>
              </Grid>
              <Grid item xs={4} className={classes.label}>
                <h3 className={classes.label_cells}>{toFormatterCurrency(otrosEgresos)}</h3>
              </Grid>
            </Grid>

            <Grid container xs={6} className={classes.grid_right}>
              <Grid item xs={12} className={classes.label}>
                <h1 className={classes.label_utilidad_perdida}>{`UTILIDAD O PÉRDIDA: ${toFormatterCurrency(totalEfectivo - pagoDermatologos - retirosParciales - otrosEgresos)}`}<br /><br /></h1>
              </Grid>
              <Grid container>
                <Grid item xs={true}>
                  <h3 className={classes.label_title_descripcion}>_____________________________</h3>
                  <h3 className={classes.label_title_descripcion}>REALIZÓ</h3>
                </Grid>

                <Grid item xs={true} className={classes.label}>
                  <h3 className={classes.label_title_descripcion}>_____________________________</h3>
                  <h3 className={classes.label_title_descripcion}>RECIBIÓ</h3>
                </Grid>
              </Grid>
            </Grid>

          </Grid>


        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirCorte;