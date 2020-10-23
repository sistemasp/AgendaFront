import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { CorteContainer } from './corte';
import TableComponent from '../../components/table/TableComponent';
import {
  findEmployeesByRolId,
  showCorteTodayBySucursalAndTurno,
  createCorte,
  showIngresosTodayBySucursalAndTurno,
  showEgresosTodayBySucursalAndTurno,
  showAllMetodoPago,
  showAllTipoEgresos,
  showAllTipoIngresos,
} from '../../services';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Edit from '@material-ui/icons/Edit';
import { toFormatterCurrency } from "../../utils/utils";

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
  const [dataEgresos, setDataEgresos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
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
    { title: 'Metodo de pago', field: 'metodo_pago' },
    { title: 'Total', field: 'total_moneda' },
  ];

  const columnsIngresoTipo = [
    { title: 'Tipo de Ingreso', field: 'tipo_ingreso' },
    { title: 'Cantidad', field: 'cantidad_ingresos' },
    { title: 'Total', field: 'total_moneda' },
  ];

  const columnsIngresoDetalles = [
    { title: 'Concepto', field: 'concepto' },
    { title: 'Recepcionista', field: 'recepcionista.nombre' },
    { title: 'Cantidad', field: 'cantidad_moneda' },
  ];

  const columnsEgreso = [
    { title: 'Tipo Egreso', field: 'tipo_egreso' },
    { title: 'Cantidad', field: 'cantidad_egresos' },
    { title: 'Total', field: 'total_moneda' },
  ];

  const columnsEgresoDetalles = [
    { title: 'Concepto', field: 'concepto' },
    { title: 'Recepcionista', field: 'recepcionista.nombre' },
    { title: 'Cantidad', field: 'cantidad_moneda' },

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
      tooltip: 'Detalles',
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
      tooltip: 'Detalles',
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

  const loadDataIngresos = async (tipoIngresos, ingresos, metodoPagos) => {

    const dataIngresosTemp = [];
    metodoPagos.map((metodoPago) => {

      const tipoIngresosDetalles = [];
      tipoIngresos.map((tipoIngreso) => {

        const ingresosPorTipo = [];
        let totalTipoIngreso = 0;

        ingresos.forEach(ingreso => {
          if (ingreso.metodo_pago._id === metodoPago._id) {
            if (ingreso.tipo_ingreso._id === tipoIngreso._id) {
              totalTipoIngreso += Number(ingreso.cantidad);
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

          tipoIngresosDetalles.push(tipoIngresoDetalle);
        }
      });

      let total = 0;
      tipoIngresosDetalles.forEach(tipoIngresoDetalle => {
        return total += Number(tipoIngresoDetalle.total);
      });

      const dataIngreso = {
        metodo_pago: metodoPago.nombre,
        total: total,
        total_moneda: toFormatterCurrency(total),
        tipo_ingresos_detalles: tipoIngresosDetalles,
      }

      dataIngresosTemp.push(dataIngreso);
    });
    setDataIngresos(dataIngresosTemp);
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
      dataEgresosTemp.push(dataEgreso);
    });
    setDataEgresos(dataEgresosTemp);
  }

  const loadIngresos = async (tipoIngresos, metodoPagos) => {
    const response = await showIngresosTodayBySucursalAndTurno(sucursal, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const data = response.data;
      data.map((item) => {
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
      });
      setIngresos(data);
      await loadDataIngresos(tipoIngresos, data, metodoPagos);
      setIsLoading(false);
    }
  }

  const loadEgresos = async (tipoEgresos) => {
    const response = await showEgresosTodayBySucursalAndTurno(sucursal, turno);
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

  const loadMetodoPagos = async (tipoIngresos) => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const metodoPagos = response.data;
      await loadIngresos(tipoIngresos, metodoPagos);
    }
  }

  const loadTipoIngresos = async () => {
    const response = await showAllTipoIngresos();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoIngresos = response.data;
      await loadMetodoPagos(tipoIngresos);
    }
  }

  const loadTipoEgresos = async () => {
    const response = await showAllTipoEgresos();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const tipoEgresos = response.data;
      await loadEgresos(tipoEgresos);
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
      await loadTipoIngresos();
      await loadTipoEgresos();
    }
    setIsLoading(false);

  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  useEffect(() => {
    handleObtenerInformacion();
  }, []);

  const handleGenerateCorte = async () => {
    const create_date = new Date();
    create_date.setHours(create_date.getHours() - 5);
    const newCorte = {
      create_date: create_date,
      turno: turno,
      ingresos: ingresos,
      egresos: egresos,
      recepcionista: empleado,
      sucursal: sucursal,
    }
    const response = await createCorte(newCorte);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setMessage("Corte generado correctamente.");
      setOpenAlert(true);
      handleObtenerInformacion();
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
            tituloEgreso='EGRESOS'
            options={options}
            openModalNuevoIngreso={openModalNuevoIngreso}
            openModalNuevoEgreso={openModalNuevoEgreso}
            openModalImprimir={openModalImprimir}
            dataIngresos={dataIngresos}
            dataEgresos={dataEgresos}
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
            handleGenerateCorte={() => handleGenerateCorte()}
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