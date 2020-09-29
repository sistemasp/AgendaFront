import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { ListaEsperaContainer } from './lista_espera';
import {
	findSurgeryBySucursalIdWaitingList,
	createSurgery,
	waitingListConsulta,
	waitingListTratamiento,
	updateSurgery,
	updateConsult,
	breakFreeSurgeryById,
	breakFreeSurgeryByIdPaciente,
	findConsultById,
	findCabinaBySucursalId,
	findDateById,
	updateDate,
	updateCabina,
	breakFreeCabinaByIdPaciente,
} from '../../services';
import InputIcon from '@material-ui/icons/Input';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import { addZero, generateFolioCita } from "../../utils/utils";

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

const ListaEspera = (props) => {

	const classes = useStyles();

	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [cabinas, setCabinas] = useState([]);
	const [cabina, setCabina] = useState({});
	const [listaEsperaConsultas, setListaEsperaConsultas] = useState([]);
	const [listaEsperaTratamientos, setListaEsperaTratamientos] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [openModalConsultorioAsignar, setOpenModalConsultorioAsignar] = useState(false);
	const [openModalCabinaAsignar, setOpenModalCabinaAsignar] = useState(false);
	const [tipo_servicio, setTipoServicio] = useState('');
	const [servicio, setServicio] = useState('');
	const [cambio, setCambio] = useState(false);
	const [paciente, setPaciente] = useState({});

	const {
		sucursal,
	} = props;

	const columnsConsultorios = [
		{ title: 'Consultorio', field: 'nombre' },
		{ title: 'Nombre', field: 'paciente_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
	];

	const columnsCabinas = [
		{ title: 'Cabina', field: 'nombre' },
		{ title: 'Nombre', field: 'paciente_nombre' },
		{ title: 'Cosmetologa', field: 'cosmetologa_nombre' },
	];

	const columnsEspera = [
		{ title: 'Nombre', field: 'paciente_nombre' },
		{ title: 'Servicio', field: 'servicio.nombre' },
		{ title: 'Hora llegada', field: 'hora_llegada' },
		{ title: 'Consecutivo', field: 'consecutivo' },
		{ title: 'Medico', field: 'medico_nombre' },
	];

	const optionsConsultorio = {
		rowStyle: rowData => {
			return {
				backgroundColor: rowData.disponible ? process.env.REACT_APP_LIBRE_COLOR : process.env.REACT_APP_OCUPADO_COLOR
			};
		},
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const optionsEspera = {
		rowStyle: rowData => {
			return {
				backgroundColor: rowData.servicio.color
			};
		},
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalIdWaitingList(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolioCita(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
			});
			setConsultorios(response.data);
		}
	}

	const loadListaEsperaConsultas = async () => {
		const response = await waitingListConsulta(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolioCita(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
			});
			setListaEsperaConsultas(response.data);
		}
	}

	const loadListaEsperaTratamientos = async () => {
		const response = await waitingListTratamiento(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolioCita(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
			});
			setListaEsperaTratamientos(response.data);
		}
	}

	const handleOnClickConsultorioAsignarPaciente = (event, rowData) => {
		setTipoServicio(rowData.servicio._id);
		setServicio(rowData._id);
		setPaciente(rowData.paciente);
		setCambio(false);
		setOpenModalConsultorioAsignar(true);
	}

	const handleOnClickCabinaAsignarPaciente = (event, rowData) => {
		setTipoServicio(rowData.servicio._id);
		setServicio(rowData._id);
		setPaciente(rowData.paciente);
		setCambio(false);
		setOpenModalCabinaAsignar(true);
	}

	const handleOnConsultorioCambiarPaciente = async (event, rowData) => {
		//setConsulta(rowData.consulta);
		setPaciente(rowData.paciente);
		setCambio(true);
		setOpenModalConsultorioAsignar(true);
		rowData.disponible = true;
		await updateSurgery(rowData._id, rowData);
		await breakFreeSurgeryByIdPaciente(rowData._id);
	}

	const handleOnCabinaCambiarPaciente = async (event, rowData) => {
		//setConsulta(rowData.consulta);
		setPaciente(rowData.paciente);
		setCambio(true);
		setOpenModalCabinaAsignar(true);
		rowData.disponible = true;
		await updateCabina(rowData._id, rowData);
		await breakFreeCabinaByIdPaciente(rowData._id);
	}

	const handleOnClickLiberar = async (event, rowData) => {
		const dateNow = new Date();
		if (rowData.tipo_servicio === consultaServicioId) { // SI ES CONSULTA
			const responseServicio = await findConsultById(rowData.servicio);
			if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				const consulta = responseServicio.data;
				let updateConsulta = consulta;
				updateConsulta.status = atendidoStatusId;
				updateConsulta.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
				await updateConsult(consulta._id, updateConsulta);
				rowData.disponible = true;
				await updateSurgery(rowData._id, rowData);
				const response = await breakFreeSurgeryByIdPaciente(rowData._id);
				if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					setOpenAlert(true);
					setMessage('Salio el paciente');
					await loadConsultorios();
					await loadCabinas();
					await loadListaEsperaConsultas();
					await loadListaEsperaTratamientos();
				}
			}
		}  else { // SI ES TRATAMIENTO 
			console.log("Tratamiento");
			const responseCita = await findDateById(rowData.servicio);
			if (`${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				const cita = responseCita.data;
				let updateCita = cita;
				updateCita.status = atendidoStatusId;
				updateCita.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
				await updateDate(cita._id, updateCita);
				rowData.disponible = true;
				await updateCabina(rowData._id, rowData);
				const response = await breakFreeCabinaByIdPaciente(rowData._id);
				if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					setOpenAlert(true);
					setMessage('Salio el paciente');
					await loadConsultorios();
					await loadCabinas();
					await loadListaEsperaConsultas();
					await loadListaEsperaTratamientos();
				}
			}

		}
	}

	const actionsEsperaConsultorio = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'Asiganar a consultorio',
			onClick: handleOnClickConsultorioAsignarPaciente
		} //: ''
	];

	const actionsEsperaCabina = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'Asiganar a cabina',
			onClick: handleOnClickCabinaAsignarPaciente
		} //: ''
	];

	const actionsConsultorio = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => (
			!rowData.disponible ? {
				icon: DirectionsWalkIcon,
				tooltip: 'Salida paciente',
				onClick: handleOnClickLiberar
			} : ''),
		rowData => (
			!rowData.disponible ? {
				icon: InputIcon,
				tooltip: 'Cambiar de consultorio',
				onClick: handleOnConsultorioCambiarPaciente
			} : ''),
	];

	const actionsCabina = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => (
			!rowData.disponible ? {
				icon: DirectionsWalkIcon,
				tooltip: 'Salida paciente',
				onClick: handleOnClickLiberar
			} : ''),
		rowData => (
			!rowData.disponible ? {
				icon: InputIcon,
				tooltip: 'Cambiar de cabina',
				onClick: handleOnCabinaCambiarPaciente
			} : ''),
	];


	const handleClose = () => {
		setConsultorio({});
		setOpenModalConsultorioAsignar(false);
		setOpenModalCabinaAsignar(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	useEffect(() => {
		const loadConsultorios = async () => {
			const response = await findSurgeryBySucursalIdWaitingList(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolioCita(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
					item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
				});
				setConsultorios(response.data);
			}
		}

		const loadListaEsperaConsultas = async () => {
			const response = await waitingListConsulta(sucursal, asistioStatusId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolioCita(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				});
				setListaEsperaConsultas(response.data);
			}
		}

		const loadListaEsperaTratamientos = async () => {
			const response = await waitingListTratamiento(sucursal, asistioStatusId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolioCita(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				});
				setListaEsperaTratamientos(response.data);
			}
		}

		const loadCabinas = async () => {
			const response = await findCabinaBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				});
				setCabinas(response.data);
			}
		}

		loadConsultorios();
		loadListaEsperaConsultas();
		loadListaEsperaTratamientos();
		loadCabinas();
		setIsLoading(false);
	}, [sucursal, asistioStatusId]);

	const loadCabinas = async () => {
		const response = await findCabinaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
			});
			setCabinas(response.data);
		}
	}

	return (
		<Fragment>
			{
				!isLoading ?
					<ListaEsperaContainer
						columnsConsultorios={columnsConsultorios}
						columnsEspera={columnsEspera}
						columnsCabinas={columnsCabinas}
						tituloConsultorios='Consultorios'
						tituloCabinas='Cabinas'
						tituloEsperaConsultas='Consultas en espera'
						tituloEsperaTratamientos='Tratamientos en espera'
						optionsEspera={optionsEspera}
						optionsConsultorio={optionsConsultorio}
						consultorio={consultorio}
						consultorios={consultorios}
						cabinas={cabinas}
						listaEsperaConsultas={listaEsperaConsultas}
						listaEsperaTratamientos={listaEsperaTratamientos}
						actionsEsperaConsultorio={actionsEsperaConsultorio}
						actionsEsperaCabina={actionsEsperaCabina}
						actionsConsultorio={actionsConsultorio}
						actionsCabina={actionsCabina}
						openModalConsultorioAsignar={openModalConsultorioAsignar}
						openModalCabinaAsignar={openModalCabinaAsignar}
						tipo_servicio={tipo_servicio}
						servicio={servicio}
						handleClose={handleClose}
						cambio={cambio}
						loadListaEsperaConsultas={loadListaEsperaConsultas}
						loadListaEsperaTratamientos={loadListaEsperaTratamientos}
						loadConsultorios={loadConsultorios}
						loadCabinas={loadCabinas}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						paciente={paciente} /> :
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

export default ListaEspera;