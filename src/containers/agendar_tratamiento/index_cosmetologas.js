import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findDatesByDateAndSucursal
} from "../../services";
import { Backdrop, CircularProgress, Snackbar, TablePagination } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { toFormatterCurrency, addZero, generateFolio } from "../../utils/utils";
import { TratamientosCosmetologasContainer } from "./agendar_tratamiento_cosmetologas";
import EditIcon from '@material-ui/icons/Edit';


function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const TratamientosCosmetologas = (props) => {
	const classes = useStyles();

	const {
		paciente,
		empleado,
		sucursal,
	} = props;

	const medicoDirectoId = process.env.REACT_APP_MEDICO_DIRECTO_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [cosmetologas, setCosmetologas] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [citas, setCitas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [cita, setCita] = useState();

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`
	});

	const columns = [
		{ title: 'Folio', field: 'folio' },
		{ title: 'Hora', field: 'hora' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Servicio', field: 'servicio.nombre' },
		{ title: 'Tratamientos', field: 'show_tratamientos' },
		{ title: 'Areas', field: 'show_areas' },
		{ title: 'Quien agenda', field: 'quien_agenda.nombre' },
		{ title: 'Medio', field: 'medio.nombre' },
		{ title: 'Quien confirma llamada', field: 'quien_confirma_llamada.nombre' },
		{ title: 'Quien confirma asistencia', field: 'quien_confirma_asistencia.nombre' },
		{ title: 'Promovendedor', field: 'promovendedor_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Tipo Cita', field: 'tipo_cita.nombre' },
		{ title: 'Cosmetologa', field: 'cosmetologa_nombre' },
		{ title: 'Estado', field: 'status.nombre' },
		{ title: 'Tiempo (minutos)', field: 'tiempo' },
		{ title: 'Observaciones', field: 'observaciones' },
		{ title: 'Hora llegada', field: 'hora_llegada' },
		{ title: 'Hora atendido', field: 'hora_atencion' },
		{ title: 'Hora salida', field: 'hora_salida' },
	];

	const options = {
		rowStyle: rowData => {
			return {
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
			};
		},
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		paging: false,
	}

	useEffect(() => {


		const loadCitas = async () => {
			const response = await findDatesByDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(), sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					item.folio = generateFolio(item);
					const fecha = new Date(item.fecha_hora);
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
			setIsLoading(false);
		}


		setIsLoading(true);
		loadCitas();
	}, [sucursal]);

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadCitas(date);
		setIsLoading(false);
	};

	const loadCitas = async (filterDate) => {
		const response = await findDatesByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
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

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setCita(rowData);
		// await loadTratamientos(rowData.servicio);
		setOpenModal(true);
		setIsLoading(false);
	}

	const actions = [
		{
			icon: EditIcon,
			tooltip: 'Editar cita',
			onClick: handleOnClickEditarCita
		}
	];

	return (
		<Fragment>
			{
				!isLoading ?
					<TratamientosCosmetologasContainer
						onChangeFilterDate={(e) => handleChangeFilterDate(e)}
						filterDate={filterDate.fecha_show}
						paciente={paciente}
						disableDate={disableDate}
						titulo={`CITAS (${filterDate.fecha})`}
						columns={columns}
						options={options}
						citas={citas}
						actions={actions}
						 /> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity="success">
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default TratamientosCosmetologas;