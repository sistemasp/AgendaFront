import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { CorteContainer } from './corte';
import TableComponent from '../../../components/table/TableComponent';
import {
  showAllMetodoPago,
  showAllTipoEgresos,
  showAllTipoIngresos,
} from '../../../services';
import {
  showIngresosTodayBySucursalAndHoraAplicacion, showIngresosTodayBySucursalAndHoraAplicacionPA,
} from '../../../services/ingresos';
import {
  showEgresosTodayBySucursalAndHoraAplicacion,
} from '../../../services/egresos';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { addZero, toFormatterCurrency } from "../../../utils/utils";
import {
  createCorte,
  showCorteTodayBySucursalAndTurno,
  updateCorte,
} from "../../../services/corte";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const Corte = (props) => {

  const classes = useStyles();

  const [openModalNuevoIngreso, setOpenModalNuevoIngreso] = useState(false);
  const [openModalNuevoEgreso, setOpenModalNuevoEgreso] = useState(false);
  const [openModalImprimir, setOpenModalInmprimir] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [dataIngresos, setDataIngresos] = useState([]);
  const [dataPagosAnticipados, setDataPagosAnticipados] = useState([]);
  const [dataEgresos, setDataEgresos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [pagosAnticipados, setPagosAnticipados] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [turno, setTurno] = useState('m');
  const [corte, setCorte] = useState({});

  const {
    sucursal,
    empleado,
  } = props;

  const columnsIngreso = [
    { title: 'FORMA DE PAGO', field: 'forma_pago' },
    { title: 'TOTAL', field: 'total_moneda' },
  ];

  const columnsIngresoTipo = [
    { title: 'TIPO DE INGRESO', field: 'tipo_ingreso' },
    { title: 'CANTIDAD', field: 'cantidad_ingresos' },
    { title: 'TOTAL', field: 'total_moneda' },
  ];

  const columnsIngresoDetalles = [
    { title: 'CONCEPTO', field: 'concepto' },
    { title: 'HORA', field: 'hora' },
    { title: 'RECEPCIONISTA', field: 'recepcionista.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },
  ];

  const columnsEgreso = [
    { title: 'TIPO EGRESO', field: 'tipo_egreso' },
    { title: 'CANTIDAD', field: 'cantidad_egresos' },
    { title: 'TOTAL', field: 'total_moneda' },
  ];

  const columnsEgresoDetalles = [
    { title: 'CONCEPTO', field: 'concepto' },
    { title: 'RECEPCIONISTA', field: 'recepcionista.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },

  ];

  const options = {
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
    rowStyle: {
      fontWeight: 'bolder',
      fontSize: '16px'
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';',
    paging: false,
  }

  const optionsDetail = {
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_DETAIL_COLOR,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '0px',
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';',
    search: false,
    showTitle: false,
    toolbar: false,
    paging: false,
    draggable: false,
  }

  const detailPanelIngresoDetalle = [
    {
      tooltip: 'DETALLES',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsIngresoDetalles}
              data={rowData.ingresos}
              options={optionsDetail} />
          </Fragment>
        )
      },
    }
  ];

  const detailPanelIngreso = [
    {
      tooltip: 'DETALLES',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsIngresoTipo}
              data={rowData.tipo_ingresos_detalles}
              options={optionsDetail}
              detailPanel={detailPanelIngresoDetalle} />
          </Fragment>
        )
      },
    }
  ];

  const detailPanelEgreso = [
    {
      tooltip: 'Detalles',
      render: rowData => {
        return (
          <Fragment>
            <TableComponent
              columns={columnsEgresoDetalles}
              data={rowData.egresos_por_tipo}
              options={optionsDetail} />
          </Fragment>
        )
      },
    }
  ];

  const loadDataIngresos = async (tipoIngresos, ingresos, formaPagos) => {

    const dataIngresosTemp = [];
    formaPagos.map((formaPago) => {

      const tipoIngresosDetalles = [];
      tipoIngresos.map((tipoIngreso) => {

        const ingresosPorTipo = [];
        let totalTipoIngreso = 0;

        ingresos.forEach(ingreso => {
          if (ingreso.forma_pago._id === formaPago._id) {
            if (ingreso.tipo_ingreso._id === tipoIngreso._id) {
              totalTipoIngreso += Number(ingreso.cantidad);
              const date = new Date(ingreso.create_date);
              ingreso.hora = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
              ingresosPorTipo.push(ingreso);
            }
          }
        });

        if (totalTipoIngreso !== 0) {
          const tipoIngresoDetalle = {
            tipo_ingreso: tipoIngreso.nombre,
            total: totalTipoIngreso,
            total_moneda: toFormatterCurrency(totalTipoIngreso),
            cantidad_ingresos: ingresosPorTipo.length,
            ingresos: ingresosPorTipo,
          }
          if (tipoIngresoDetalle.total > 0) {
            tipoIngresosDetalles.push(tipoIngresoDetalle);
          }
        }
      });

      let total = 0;
      tipoIngresosDetalles.forEach(tipoIngresoDetalle => {
        return total += Number(tipoIngresoDetalle.total);
      });

      const dataIngreso = {
        forma_pago: formaPago.nombre,
        total: total,
        total_moneda: toFormatterCurrency(total),
        tipo_ingresos_detalles: tipoIngresosDetalles,
      }
      if (dataIngreso.total > 0) {
        dataIngresosTemp.push(dataIngreso);
      }
    });
    setDataIngresos(dataIngresosTemp);
  }

  const loadDataPagosAnticipados = async (tipoIngresos, ingresos, formaPagos) => {

    const dataIngresosTemp = [];
    formaPagos.map((formaPago) => {

      const tipoIngresosDetalles = [];
      tipoIngresos.map((tipoIngreso) => {

        const ingresosPorTipo = [];
        let totalTipoIngreso = 0;

        ingresos.forEach(ingreso => {
          if (ingreso.forma_pago._id === formaPago._id) {
            if (ingreso.tipo_ingreso._id === tipoIngreso._id) {
              totalTipoIngreso += Number(ingreso.cantidad);
              const date = new Date(ingreso.create_date);
              ingreso.hora = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
              ingresosPorTipo.push(ingreso);
            }
          }
        });

        if (totalTipoIngreso !== 0) {
          const tipoIngresoDetalle = {
            tipo_ingreso: tipoIngreso.nombre,
            total: totalTipoIngreso,
            total_moneda: toFormatterCurrency(totalTipoIngreso),
            cantidad_ingresos: ingresosPorTipo.length,
            ingresos: ingresosPorTipo,
          }

          if (tipoIngresoDetalle.total > 0) {
            tipoIngresosDetalles.push(tipoIngresoDetalle);
          }
        }
      });

      let total = 0;
      tipoIngresosDetalles.forEach(tipoIngresoDetalle => {
        return total += Number(tipoIngresoDetalle.total);
      });

      const dataIngreso = {
        forma_pago: formaPago.nombre,
        total: total,
        total_moneda: toFormatterCurrency(total),
        tipo_ingresos_detalles: tipoIngresosDetalles,
      }

      if (dataIngreso.total > 0) {
        dataIngresosTemp.push(dataIngreso);
      }
    });
    setDataPagosAnticipados(dataIngresosTemp);
  }

  const loadDataEgresos = async (egresos, tipoEgresos) => {

    const dataEgresosTemp = [];
    tipoEgresos.map((tipoEgreso) => {
      const egresosPorTipo = [];
      egresos.forEach(egreso => {
        if (egreso.tipo_egreso._id === tipoEgreso._id) {
          egresosPorTipo.push(egreso);
        }
      });

      let total = 0;
      egresosPorTipo.forEach(egreso => {
        return total += Number(egreso.cantidad);
      });
      const dataEgreso = {
        tipo_egreso: tipoEgreso.nombre,
        egresos_por_tipo: egresosPorTipo,
        cantidad_egresos: egresosPorTipo.length,
        total: total,
        total_moneda: toFormatterCurrency(total),
      }
      if (dataEgreso.total > 0) {
        dataEgresosTemp.push(dataEgreso);
      }
    });
    setDataEgresos(dataEgresosTemp);
  }

  const loadIngresos = async (tipoIngresos, formaPagos, hora_apertura, hora_cierre) => {
    const response = await showIngresosTodayBySucursalAndHoraAplicacion(sucursal, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setIngresos(data);
      await loadDataIngresos(tipoIngresos, data, formaPagos);
      setIsLoading(false);
    }
  }

  const loadPagosAnticipados = async (tipoIngresos, formaPagos, hora_apertura, hora_cierre) => {
    const response = await showIngresosTodayBySucursalAndHoraAplicacionPA(sucursal, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setPagosAnticipados(data);
      await loadDataPagosAnticipados(tipoIngresos, data, formaPagos);
      setIsLoading(false);
    }
  }

  const loadEgresos = async (tipoEgresos, hora_apertura, hora_cierre) => {
    const response = await showEgresosTodayBySucursalAndHoraAplicacion(sucursal, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setEgresos(data);
      await loadDataEgresos(data, tipoEgresos);
      setIsLoading(false);
    }
  }

  const loadMetodoPagos = async (tipoIngresos, hora_apertura, hora_cierre) => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const formaPagos = response.data;
      await loadIngresos(tipoIngresos, formaPagos, hora_apertura, hora_cierre);
      await loadPagosAnticipados(tipoIngresos, formaPagos, hora_apertura, hora_cierre);
    }
  }

  const loadTipoIngresos = async (corte) => {
    const response = await showAllTipoIngresos();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoIngresos = response.data;
      await loadMetodoPagos(tipoIngresos, corte.hora_apertura, corte.hora_cierre);
    }
  }

  const loadTipoEgresos = async (corte) => {
    const response = await showAllTipoEgresos();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoEgresos = response.data;
      await loadEgresos(tipoEgresos, corte.hora_apertura, corte.hora_cierre);
    }
  }

  const handleOpenNuevoIngreso = () => {
    setOpenModalNuevoIngreso(true);
  };

  const handleOpenNuevoEgreso = () => {
    setOpenModalNuevoEgreso(true);
  };

  const handleOpenImprimir = () => {
    setOpenModalInmprimir(true);
  };

  const handleClose = () => {
    setOpenModalNuevoIngreso(false);
    setOpenModalNuevoEgreso(false);
    setOpenModalInmprimir(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleObtenerInformacion = async () => {
    const response = await showCorteTodayBySucursalAndTurno(sucursal, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCorte(response.data);
      await loadTipoIngresos(response.data);
      await loadTipoEgresos(response.data);
    }
    setIsLoading(false);

  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  useEffect(() => {
    handleObtenerInformacion();
  }, []);

  const handleGuardarCorte = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours());
    const newCorte = {
      create_date: create_date,
      turno: turno,
      ingresos: ingresos,
      pagos_anticipados: pagosAnticipados,
      egresos: egresos,
      recepcionista: empleado._id,
      sucursal: sucursal._id,
    }
    const response = await createCorte(newCorte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setSeverity('success');
      setMessage("CORTE GUARDADO CORRECTAMENTE.");
      setOpenAlert(true);
      handleObtenerInformacion();
    }
  }

  const handleGenerarCorte = async () => {
    corte.egresos = egresos.map((egreso) => {
      return egreso._id;
    });
    corte.ingresos = ingresos.map((ingreso) => {
      return ingreso._id;
    });
    corte.pagos_anticipados = pagosAnticipados.map((pagoAnticipado) => {
      return pagoAnticipado._id;
    });
    corte.generado = true;
    corte.recepcionista = empleado._id;
    const response = await updateCorte(corte._id, corte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSeverity('success');
      setMessage("EL CORTE SE GENERO.");
      setOpenAlert(true);
      handleObtenerInformacion();
    }
  }

  const handleCerrarCorte = async () => {
    const date = new Date();
    corte.hora_cierre = date;
    corte.recepcionista = empleado._id;
    const response = await updateCorte(corte._id, corte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSeverity('success');
      setMessage("CORTE CERRADO.");
      setOpenAlert(true);
      handleObtenerInformacion();
      if (corte.turno === 'm') {
        const newCorte = {
          create_date: date,
          hora_apertura: date,
          turno: 'v',
          sucursal: sucursal,
          recepcionista: empleado._id,
        }
        await createCorte(newCorte);
      }
    }
  }

  return (
    <Fragment>
      {
        !isLoading ?
          <CorteContainer
            columnsIngreso={columnsIngreso}
            columnsEgreso={columnsEgreso}
            tituloIngreso='INGRESOS BRUTOS'
            tituloPagoAnticipado='PAGOS ANTICIPADOS'
            tituloEgreso='EGRESOS'
            options={options}
            openModalNuevoIngreso={openModalNuevoIngreso}
            openModalNuevoEgreso={openModalNuevoEgreso}
            openModalImprimir={openModalImprimir}
            dataIngresos={dataIngresos}
            dataEgresos={dataEgresos}
            dataPagosAnticipados={dataPagosAnticipados}
            handleOpenNuevoIngreso={handleOpenNuevoIngreso}
            handleOpenNuevoEgreso={handleOpenNuevoEgreso}
            handleOpenImprimir={handleOpenImprimir}
            handleClose={handleClose}
            turno={turno}
            onCambioTurno={() => handleCambioTurno()}
            onObtenerInformacion={() => handleObtenerInformacion()}
            sucursal={sucursal}
            empleado={empleado}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity}
            detailPanelIngreso={detailPanelIngreso}
            detailPanelEgreso={detailPanelEgreso}
            handleGuardarCorte={() => handleGuardarCorte()}
            handleCerrarCorte={() => handleCerrarCorte()}
            onGenerarCorte={() => handleGenerarCorte()}
            corte={corte}
          /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default Corte;