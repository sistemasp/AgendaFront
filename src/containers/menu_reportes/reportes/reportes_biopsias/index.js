import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesBiopsiasContainer } from "./reportes_consultas";
import { findBiopsiasByRangeDateAndSucursal } from "../../../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../../../utils/utils";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesBiopsias = (props) => {

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
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Folio consulta', field: 'consulta.consecutivo' },
		{ title: 'Dermatologo', field: 'dermatologo_nombre' },
		{ title: 'Patologo', field: 'patologo_nombre' },
		{ title: 'Costo biopsias', field: 'costo_biopsia_moneda' },
		{ title: 'Con pago', field: 'con_pago' },
		{ title: 'Fecha entrega patologo', field: 'fecha_entrega_patologo' },
		{ title: 'Quien entrega', field: 'quien_entrega' },
		{ title: 'Fecha entrega resultado', field: 'fecha_entrega_resultado' },
		{ title: 'Quien recibe', field: 'quien_recibe' },
		{ title: 'Diagnositico', field: 'diagnostico' },
		{ title: 'A quien se entrega', field: 'a_quien_se_entrega' },
		{ title: 'Fecha entrega', field: 'fecha_entrega' },
		{ title: 'Quien lo entrega', field: 'quien_lo_entrega' },
		{ title: 'Estado', field: 'status.nombre' },
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
			const response = await findBiopsiasByRangeDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(),
				date.getDate(), date.getMonth(), date.getFullYear(), sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_realizacion);
					item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
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
		const response = await findBiopsiasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			await response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
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
					<ReportesBiopsiasContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES BIOPSIAS(${startDate.fecha} - ${endDate.fecha})`}
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

export default ReportesBiopsias;