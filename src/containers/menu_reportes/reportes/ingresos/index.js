import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesIngresosContainer } from "./reportes_ingresos";
import { findConsultsByRangeDateAndSucursal } from "../../../../services/consultas";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio } from "../../../../utils/utils";
import { findCortesByRangeDateAndSucursal } from "../../../../services/corte";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesIngresos = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const formaPagoEfectivo = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
	const formaPagoTarjeta = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const formaPagoTransferencia = process.env.REACT_APP_FORMA_PAGO_TRANSFERENCIA;
	const formaPagoDeposito = process.env.REACT_APP_FORMA_PAGO_DEPOSITO;
	

	const [isLoading, setIsLoading] = useState(true);
	const [cortes, setCortes] = useState([]);
	const [datos, setDatos] = useState([]);

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [startDate, setStartDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const [endDate, setEndDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const columns = [
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'TURNO', field: 'turno' },
		{ title: 'SUCURSAL', field: 'sucursal' },
		{ title: 'RECEPCIONISTA', field: 'recepcionista' },
		{ title: 'INGRESOS TOTALES', field: 'ingresos_totales' },
		{ title: 'INGRESOS TOTALES REALES', field: 'ingresos_totales_reales' },
		{ title: 'PAGOS ANTICIPADOS', field: 'pagos_anticipados' },
		{ title: 'PAGO CON TARJETA', field: 'tarjeta' },
		{ title: 'TRANSFERENCIA', field: 'transferencia' },
		{ title: 'EFECTIVO', field: 'efectivo' },
		{ title: 'DEPÓSITO', field: 'deposito' },
		{ title: 'PAGO DERMATÓLOGO EFECTIVO', field: 'cantidad_moneda' },
		{ title: 'PAGO DERMATÓLOGO RETENCIÓN', field: 'cantidad_moneda' },
		{ title: 'GASTOS ', field: 'cantidad_moneda' },
		{ title: 'RETIROS PARCIALES', field: 'cantidad_moneda' },
		{ title: 'UTILIDAD O PÉRDIDA ', field: 'cantidad_moneda' },
	];

	const options = {
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
	}

	const procesarDatos = () => {
		const datos = [];
		cortes.forEach((item, index) => {
			const fecha = new Date(item.create_date);

			// PAGOS ANTICIPADOS
			let pagosAnticipados = 0;
			item.pagos_anticipados.forEach(pago_anticipado => {
				pagosAnticipados += Number(pago_anticipado.cantidad);
			});

			// PAGOS EFECTIVO
			let efectivo = 0;
			const ingresosEfectivo = item.ingresos.filter(ingreso => {
				return ingreso.forma_pago === formaPagoEfectivo;
			});
			ingresosEfectivo.forEach(ingresoEfectivo => {
				efectivo += Number(ingresoEfectivo.cantidad);
			});

			// PAGOS TARJETA
			let tarjeta = 0;
			const ingresosTarjeta = item.ingresos.filter(ingreso => {
				return ingreso.forma_pago === formaPagoTarjeta;
			});
			ingresosTarjeta.forEach(ingresoTarjeta => {
				tarjeta += Number(ingresoTarjeta.cantidad);
			});

			// PAGOS TRANSFERENCIA
			let transferencia = 0;
			const ingresosTransferencia = item.ingresos.filter(ingreso => {
				return ingreso.forma_pago === formaPagoTransferencia;
			});
			ingresosTransferencia.forEach(ingresoTransferencia => {
				transferencia += Number(ingresoTransferencia.cantidad);
			});

			// PAGOS DEPOSITO
			let deposito = 0;
			const ingresosDeposito = item.ingresos.filter(ingreso => {
				return ingreso.forma_pago === formaPagoDeposito;
			});
			ingresosDeposito.forEach(ingresoDeposito => {
				deposito += Number(ingresoDeposito.cantidad);
			});

			const ingresosTotales = pagosAnticipados + efectivo + tarjeta + transferencia + deposito;
			const ingresosTotalesReales = ingresosTotales - pagosAnticipados;

			datos.push({
				fecha_show: `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`,
				turno: item.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
				sucursal: item.sucursal.nombre,
				recepcionista: item.recepcionista.nombre,
				pagos_anticipados: toFormatterCurrency(pagosAnticipados),
				efectivo: toFormatterCurrency(efectivo),
				tarjeta: toFormatterCurrency(tarjeta),
				transferencia: toFormatterCurrency(transferencia),
				deposito: toFormatterCurrency(deposito),
				ingresos_totales_reales: toFormatterCurrency(ingresosTotalesReales),
				ingresos_totales: toFormatterCurrency(ingresosTotales),

			});
		});
		setDatos(datos);
		setIsLoading(false);
	}

	const loadEgresos = async (startDate, endDate) => {
		const response = await findCortesByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCortes(response.data);
			procesarDatos();
		}
	}

	const handleChangeStartDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setStartDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		setIsLoading(false);
	};

	const handleChangeEndDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setEndDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});

		setIsLoading(false);
	};

	const loadInfo = async (startDate, endDate) => {
		setIsLoading(true);
		await loadEgresos(startDate, endDate);
	}

	const handleReportes = async () => {
		await loadInfo(startDate.fecha_show, endDate.fecha_show);
	}

	const actions = [
	];

	useEffect(() => {
		loadInfo(startDate.fecha_show, endDate.fecha_show);
	}, [startDate, endDate]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesIngresosContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES INGRESOS(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						datos={datos}
						actions={actions}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesIngresos;