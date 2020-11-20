import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { findDatesByRangeDateAndSucursal, findFacturasByRangeDateAndSucursal } from "../../../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../utils/utils";
import { ReportesFacturasContainer } from "./reportes_facturas";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesFacturas = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const [isLoading, setIsLoading] = useState(true);
	const [citas, setCitas] = useState([]);

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
		{ title: 'Fecha', field: 'fecha_show' },
		{ title: 'Hora', field: 'hora' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Razon Social', field: 'razon_social.nombre_completo' },
		{ title: 'Cantidad', field: 'cantidad_moneda' },
		{ title: 'Metodo pago', field: 'forma_pago.nombre' },
		{ title: 'Sucursal', field: 'sucursal.nombre'},
		{ title: 'Digitos', field: 'ultimos_4_digitos' },
	];

	const options = {
		rowStyle: rowData => {
			const { asistio } = rowData;
			if (asistio === 'NO ASISTIO') {
				return { color: '#B7B4A1' };
			} else if (asistio === 'CANCELO') {
				return { color: '#FF0000', fontWeight: 'bold' };
			} else if (asistio === 'REAGENDO') {
				return { color: '#FBD014' };
			}
		},
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

	useEffect(() => {

		const loadCitas = async () => {
			const response = await findFacturasByRangeDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(),
				date.getDate(), date.getMonth(), date.getFullYear(), sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_hora);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
					item.cantidad_moneda = toFormatterCurrency(item.cantidad);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				});
				setCitas(response.data);
			}
		}
		setIsLoading(true);
		loadCitas();
		setIsLoading(false);
	}, [sucursal]);

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

	const handleReportes = async () => {
		await loadCitas(startDate.fecha_show, endDate.fecha_show);
	}

	const loadCitas = async (startDate, endDate) => {
		const response = await findFacturasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
				item.cantidad_moneda = toFormatterCurrency(item.cantidad);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
			});
			setCitas(response.data);
		}
	}

	const actions = [
	];

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesFacturasContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES FACTURAS(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						citas={citas}
						actions={actions}
						loadCitas={loadCitas}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesFacturas;