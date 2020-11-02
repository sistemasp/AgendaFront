import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesPagosContainer } from "./reportes_pago";
import { findPaysByRangeDateAndSucursal } from "../../../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../utils/utils";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesPagos = (props) => {

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
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Servicio', field: 'servicio.nombre' },
		{ title: 'Tratamientos', field: 'show_tratamientos' },
		{ title: 'Quien recibio pago', field: 'quien_recibe_pago.nombre' },
		{ title: 'Cantidad', field: 'cantidad_show' },
		{ title: 'Porcentaje comision', field: 'porcentaje_comision_show' },
		{ title: 'Comision', field: 'comision_show' },
		{ title: 'Total', field: 'total_show' },
		{ title: 'Banco', field: 'banco.nombre' },
		{ title: 'Tipo tarjeta', field: 'tipo_tarjeta.nombre' },
		{ title: 'Digitos', field: 'digitos' },
		{ title: 'Factura', field: 'factura' },
		{ title: 'Deposito confirmado', field: 'deposito_confirmado' },
		{ title: 'Sucursal', field: 'sucursal.nombre'},
		{ title: 'Observaciones', field: 'observaciones' },
	];

	const options = {
		/*rowStyle: rowData => {
			return { 
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? '#10CC88' : ''
			};
		},*/
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
			const response = await findPaysByRangeDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(),
				date.getDate(), date.getMonth(), date.getFullYear(), sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_pago);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
					item.cantidad_show = toFormatterCurrency(item.cantidad);
					item.porcentaje_comision_show = item.porcentaje_comision + ' %';
					item.comision_show = toFormatterCurrency(item.comision);
					item.total_show = toFormatterCurrency(item.total);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						return `${tratamiento.nombre}, `;
					});
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
		const response = await findPaysByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			await response.data.forEach(item => {
				const fecha = new Date(item.fecha_pago);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
				item.cantidad_show = toFormatterCurrency(item.cantidad);
				item.porcentaje_comision_show = item.porcentaje_comision + ' %';
				item.comision_show = toFormatterCurrency(item.comision);
				item.total_show = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					return `${tratamiento.nombre}, `;
				});
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
					<ReportesPagosContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES PAGOS(${startDate.fecha} - ${endDate.fecha})`}
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

export default ReportesPagos;