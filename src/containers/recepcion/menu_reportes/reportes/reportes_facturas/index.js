import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../../utils/utils";
import { ReportesFacturasContainer } from "./reportes_facturas";
import { findAparatologiaById } from "../../../../../services/aparatolgia";
import { findFacialById } from "../../../../../services/faciales";
import { findConsultById } from "../../../../../services/consultas";
import { findCirugiaById } from "../../../../../services/cirugias";
import { findBiopsiaById } from "../../../../../services/biopsias";
import { findEsteticaById } from "../../../../../services/esteticas";
import { findDermapenById } from "../../../../../services/dermapens";
import { findFacturasByRangeDateAndSucursal } from "../../../../../services/facturas";

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

	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID
	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID
	const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID
	const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID
	const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID
	const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID

	const [isLoading, setIsLoading] = useState(true);
	const [facturas, setFacturas] = useState([]);

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
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'RAZÓN SOCIAL', field: 'razon_social.nombre_completo' },
		{ title: 'CANTIDAD', field: 'cantidad_moneda' },
		{ title: 'SUCURSAL', field: 'sucursal.nombre' },
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

		const loadFacturas = async () => {
			setIsLoading(true);
			const response = await findFacturasByRangeDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(),
				date.getDate(), date.getMonth(), date.getFullYear(), sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(async (item) => {
					let servicioResponse = { data: '' };
					switch (item.tipo_servicio._id) {
						case servicioAparatologiaId:
							servicioResponse = await findAparatologiaById(item.servicio);
							break;
						case servicioFacialId:
							servicioResponse = await findFacialById(item.servicio);
							break;
						case servicioConsultaId:
							servicioResponse = await findConsultById(item.servicio);
							break;
						case servicioCirugiaId:
							servicioResponse = await findCirugiaById(item.servicio);
							break;
						case servicioBiopsiaId:
							servicioResponse = await findBiopsiaById(item.servicio);
							break;
						case servicioEsteticaId:
							servicioResponse = await findEsteticaById(item.servicio);
							break;
						case servicioDermapenId:
							servicioResponse = await findDermapenById(item.servicio);
							break;
					}

					if (`${servicioResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
						item.servicio = servicioResponse.data;

						let cantidad = 0;
						item.servicio.pagos.forEach(pago => {
							cantidad += Number(pago.total);
						});
						const fecha = new Date(item.fecha_hora);
						item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
						item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;

						item.cantidad_moneda = toFormatterCurrency(cantidad);
						item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					}

					setFacturas(response.data);
					setIsLoading(false);

				});

			}
		}
		loadFacturas();

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
		await loadFacturas(startDate.fecha_show, endDate.fecha_show);
	}

	const loadFacturas = async (startDate, endDate) => {
		setIsLoading(true);
		const response = await findFacturasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			await response.data.forEach(async (item) => {
				let servicioResponse = { data: '' };
				switch (item.tipo_servicio._id) {
					case servicioAparatologiaId:
						servicioResponse = await findAparatologiaById(item.servicio);
						break;
					case servicioFacialId:
						servicioResponse = await findFacialById(item.servicio);
						break;
					case servicioConsultaId:
						servicioResponse = await findConsultById(item.servicio);
						break;
					case servicioCirugiaId:
						servicioResponse = await findCirugiaById(item.servicio);
						break;
					case servicioBiopsiaId:
						servicioResponse = await findBiopsiaById(item.servicio);
						break;
					case servicioEsteticaId:
						servicioResponse = await findEsteticaById(item.servicio);
						break;
					case servicioDermapenId:
						servicioResponse = await findDermapenById(item.servicio);
						break;
				}

				if (`${servicioResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					item.servicio = servicioResponse.data;
					let cantidad = 0;
					item.servicio.pagos.forEach(pago => {
						cantidad += Number(pago.total);
					});
					const fecha = new Date(item.fecha_hora);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;

					item.cantidad_moneda = toFormatterCurrency(cantidad);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				}

				setFacturas(response.data);
				setIsLoading(false);
			});
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
						facturas={facturas}
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

export default ReportesFacturas;