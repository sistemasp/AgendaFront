import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesCirugiasContainer } from "./reportes_consultas";
import { findCirugiasByRangeDateAndSucursal } from "../../../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../utils/utils";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesCirugias = (props) => {

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
		{ title: 'Consecutivo', field: 'consecutivo' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Folio consulta', field: 'folio_consulta' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Materiales', field: 'materiales_show' },
		{ title: 'Biopsias', field: 'biopsias_show' },
		{ title: 'Costo biopsias', field: 'costo_biopsias_moneda' },
		{ title: 'Patologo', field: 'patologo.nombre' },
		{ title: 'Estado', field: 'status.nombre' },
		{ title: 'Precio', field: 'precio_moneda' },
		{ title: 'Total', field: 'total_moneda' },
		{ title: 'Sucursal', field: 'sucursal.nombre' },
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
			const response = await findCirugiasByRangeDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(),
				date.getDate(), date.getMonth(), date.getFullYear(), sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_hora);
					item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.total_moneda = toFormatterCurrency(item.total);
					item.costo_biopsias_moneda = toFormatterCurrency(item.costo_biopsias);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
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
		const response = await findCirugiasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			await response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.costo_biopsias_moneda = toFormatterCurrency(item.costo_biopsias);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
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
					<ReportesCirugiasContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES CIRUGIAS(${startDate.fecha} - ${endDate.fecha})`}
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

export default ReportesCirugias;