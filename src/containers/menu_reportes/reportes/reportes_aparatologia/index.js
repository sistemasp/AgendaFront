import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesAparatologiaContainer } from "./reportes_aparatologia";
import { findDatesByRangeDateAndSucursalAndService } from "../../../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../utils/utils";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesAparatologia = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const facialServicioId = process.env.REACT_APP_FACIAL_SERVICIO_ID;

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
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Servicio', field: 'servicio.nombre' },
		{ title: 'Tratamientos', field: 'show_tratamientos' },
		{ title: 'Areas', field: 'show_areas' },
		{ title: 'Quien agenda', field: 'quien_agenda.nombre' },
		{ title: 'Tipo Cita', field: 'tipo_cita.nombre' },
		{ title: 'Medio', field: 'medio.nombre' },
		{ title: 'Quien confirma llamada', field: 'quien_confirma.nombre' },
		{ title: 'Quien confirma asistencia', field: 'quien_confirma.nombre' },
		{ title: 'Promovendedor', field: 'promovendedor_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Cosmetologa', field: 'cosmetologa_nombre' },
		{ title: 'Estado', field: 'status.nombre' },
		{ title: 'Motivos', field: 'motivos' },
		{ title: 'Precio', field: 'precio_moneda' },
		{ title: 'Tiempo (minutos)', field: 'tiempo' },
		{ title: 'Sucursal', field: 'sucursal.nombre' },
		{ title: 'Observaciones', field: 'observaciones' },
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

	const loadFaciales = async (startDate, endDate) => {
		const response = await findDatesByRangeDateAndSucursalAndService(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, facialServicioId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
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
		loadFaciales(startDate.fecha_show, endDate.fecha_show);
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
		await loadFaciales(startDate.fecha_show, endDate.fecha_show);
	}

	const actions = [
	];

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesAparatologiaContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES APARATOLOGIA (${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						citas={citas}
						actions={actions}
						loadCitas={loadFaciales}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesAparatologia;