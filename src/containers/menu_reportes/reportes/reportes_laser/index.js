import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesLaserContainer } from "./reportes_laser";
import { findDatesByRangeDateAndSucursalAndService } from "../../../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../utils/utils";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesLaser = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const laserServicioId = process.env.REACT_APP_LASER_SERVICIO_ID;

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
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'TRATAMIENTOS', field: 'show_tratamientos' },
		{ title: 'AREAS', field: 'show_areas' },
		{ title: 'QUIEN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'TIPO CITA', field: 'tipo_cita.nombre' },
		{ title: 'MEDIO', field: 'medio.nombre' },
		{ title: 'QUIEN CONFIRMA LLAMADA', field: 'quien_confirma.nombre' },
		{ title: 'QUIEN CONFIRMA ASISTENCIA', field: 'quien_confirma.nombre' },
		{ title: 'PROMOVENDEDOR', field: 'promovendedor_nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'COSMETOLOGA', field: 'cosmetologa_nombre' },
		{ title: 'ESTADO', field: 'status.nombre' },
		{ title: 'MOTIVOS', field: 'motivos' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TIEMPO (MINUTOS)', field: 'tiempo' },
		{ title: 'SUCURSAL', field: 'sucursal.nombre' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
	];

	const options = {
		rowStyle: rowData => {
			return {
				color: rowData.status.color,
			};
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

	const loadLaser = async (startDate, endDate) => {
		const response = await findDatesByRangeDateAndSucursalAndService(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, laserServicioId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					return `${tratamiento.nombre}, `;
				});
				item.show_areas = item.areas.map(area => {
					return `${area.nombre}, `;
				});
			});
			setCitas(response.data);
		}
	}

	useEffect(() => {
		setIsLoading(true);
		loadLaser(startDate.fecha_show, endDate.fecha_show);
		setIsLoading(false);
	}, [startDate, endDate]);

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
		await loadLaser(startDate.fecha_show, endDate.fecha_show);
	}

	const actions = [
	];

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesLaserContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES LASER (${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						citas={citas}
						actions={actions}
						loadCitas={loadLaser}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesLaser;