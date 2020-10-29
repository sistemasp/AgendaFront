import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ListaEsperaContainer } from './lista_espera';
import {
	findSurgeryBySucursalIdWaitingList,
	waitingListConsulta,
	waitingListTratamiento,
	waitingListEstetica,
	updateSurgery,
	updateConsult,
	breakFreeSurgeryByIdPaciente,
	findConsultById,
	findCabinaBySucursalId,
	findDateById,
	updateDate,
	updateCabina,
	breakFreeCabinaByIdPaciente,
	waitingListCirugia,
	findSalaCirugiaBySucursalId,
	findCirugiaById,
	updateCirugia,
	updateSalaCirugia,
	breakFreeSalaCirugiaByIdPaciente,
	findEsteticaById,
	updateEstetica,
} from '../../services';
import InputIcon from '@material-ui/icons/Input';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import { addZero, generateFolio } from "../../utils/utils";

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
	},
	formControl: {
		width: '100%',
		margin: '5px',
	},
}));

const ListaEspera = (props) => {

	const classes = useStyles();

	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [cabinas, setCabinas] = useState([]);
	const [salaCirugias, setSalaCirugias] = useState([]);
	const [listaEsperaCirugias, setListaEsperaCirugias] = useState([]);
	const [listaEsperaConsultas, setListaEsperaConsultas] = useState([]);
	const [listaEsperaTratamientos, setListaEsperaTratamientos] = useState([]);
	const [listaEsperaEstetica, setListaEsperaEstetica] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [openModalConsultorioAsignar, setOpenModalConsultorioAsignar] = useState(false);
	const [openModalCabinaAsignar, setOpenModalCabinaAsignar] = useState(false);
	const [openModalSalaCirugiaAsignar, setOpenModalSalaCirugiaAsignar] = useState(false);
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
		{ title: 'Medico', field: 'medico_nombre' },
	];

	const columnsSalaCirugias = [
		{ title: 'Sala', field: 'nombre' },
		{ title: 'Nombre', field: 'paciente_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
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
		exportDelimiter: ';',
		paging: false,
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
	const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
	const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
	const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalIdWaitingList(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
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
				item.folio = generateFolio(item);
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
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
			});
			setListaEsperaTratamientos(response.data);
		}
	}

	const loadSalaCirugias = async () => {
		const response = await findSalaCirugiaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
			});
			setSalaCirugias(response.data);
		}
	}

	const loadListaEsperaCirugias = async () => {
		const response = await waitingListCirugia(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
			});
			setListaEsperaCirugias(response.data);
		}
	}

	const loadListaEsperaEstetica = async () => {
		const response = await waitingListEstetica(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
			});
			setListaEsperaEstetica(response.data);
			setIsLoading(false);
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

	const handleOnClickSalaCirugiaAsignarPaciente = (event, rowData) => {
		setTipoServicio(rowData.servicio._id);
		setServicio(rowData._id);
		setPaciente(rowData.paciente);
		setCambio(false);
		setOpenModalSalaCirugiaAsignar(true);
	}

	const handleOnConsultorioCambiarPaciente = async (event, rowData) => {
		setIsLoading(true);
		const response = await breakFreeSurgeryByIdPaciente(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalConsultorioAsignar(true);
			rowData.disponible = true;
			await updateSurgery(rowData._id, rowData);
		};
		setIsLoading(false);
	}

	const handleOnCabinaCambiarPaciente = async (event, rowData) => {
		setIsLoading(true);
		const response = await breakFreeCabinaByIdPaciente(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			rowData.disponible = true;
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalCabinaAsignar(true);
			//await updateCabina(rowData._id, rowData);
		}
		setIsLoading(false);

	}

	const handleOnSalaCirugiaCambiarPaciente = async (event, rowData) => {
		setIsLoading(true);
		const response = await breakFreeSalaCirugiaByIdPaciente(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			//rowData.disponible = true;
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalSalaCirugiaAsignar(true);
			//await updateSalaCirugia(rowData._id, rowData);
		}
		setIsLoading(false);
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
					await loadAll();
				}
			}
		} else { // SI ES TRATAMIENTO 
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
					await loadAll();
				}
			}
		}
	}

	const handleOnClickLiberarSalaCirugia = async (event, rowData) => {
		const dateNow = new Date();
		const responseServicio = rowData.tipo_servicio === cirugiaServicioId ? await findCirugiaById(rowData.servicio) : await findEsteticaById(rowData.servicio);
		//const responseServicio = await findCirugiaById(rowData.servicio);
		if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const currentService = responseServicio.data;
			await updateConsult(currentService.consulta._id, { ...currentService.consulta, status: enConsultorioStatusId });
			let updateData = currentService;
			updateData.status = atendidoStatusId;
			updateData.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			rowData.tipo_servicio === cirugiaServicioId ? await updateCirugia(currentService._id, updateData) : await updateEstetica(currentService._id, updateData);
			rowData.disponible = true;
			await updateSalaCirugia(rowData._id, rowData);
			const response = await breakFreeSalaCirugiaByIdPaciente(rowData._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('Salio el paciente');
				await loadAll();
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

	const actionsEsperaSalaCirugia = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'Asiganar a sala de cirugias',
			onClick: handleOnClickSalaCirugiaAsignarPaciente
		} //: ''
	];

	const actionsConsultorio = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => (
			(!rowData.disponible && rowData.consulta.status !== enProcedimientoStatusId) ? {
				icon: DirectionsWalkIcon,
				tooltip: 'Salida paciente',
				onClick: handleOnClickLiberar
			} : ''),
		rowData => (
			(!rowData.disponible && rowData.consulta.status !== enProcedimientoStatusId) ? {
				icon: InputIcon,
				tooltip: 'Cambiar de consultorio',
				onClick: handleOnConsultorioCambiarPaciente
			} : ''),
	];

	const onChangeActionsConsultorio = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'Salida paciente':
				handleOnClickLiberar(e, rowData);
				break;
			case 'Cambiar de consultorio':
				handleOnConsultorioCambiarPaciente(e, rowData);
				break;
		}
	}

	const componentsConsultorio = {
		Actions: props => {
			console.log("POROROOR", props);
			return <Fragment>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="simple-select-outlined"></InputLabel>
					<Select
						labelId="simple-select-outlined-actions"
						id="simple-select-outlined-actions"
						onChange={(e) => onChangeActionsConsultorio(e, props.data)}
						label="Acciones">
						{
							props.actions.map((item, index) => {
								return <MenuItem
									key={index}
									value={item.tooltip}
								>{item.tooltip}</MenuItem>
							})
						}
					</Select>
				</FormControl>
			</Fragment>
		}
	};

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

	const actionsSalaCirugia = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => (
			!rowData.disponible ? {
				icon: DirectionsWalkIcon,
				tooltip: 'Salida paciente',
				onClick: handleOnClickLiberarSalaCirugia
			} : ''),
		rowData => (
			!rowData.disponible ? {
				icon: InputIcon,
				tooltip: 'Cambiar de sala de cirugia',
				onClick: handleOnSalaCirugiaCambiarPaciente
			} : ''),
	];

	const handleClose = () => {
		setConsultorio({});
		setOpenModalConsultorioAsignar(false);
		setOpenModalCabinaAsignar(false);
		setOpenModalSalaCirugiaAsignar(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadCabinas = async () => {
		const response = await findCabinaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
			});
			setCabinas(response.data);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadConsultorios();
		await loadListaEsperaConsultas();
		await loadListaEsperaTratamientos();
		await loadCabinas();
		await loadSalaCirugias();
		await loadListaEsperaEstetica();
		await loadListaEsperaCirugias();
		setIsLoading(false);
	}

	useEffect(() => {
		/*
		const loadConsultorios = async () => {
			const response = await findSurgeryBySucursalIdWaitingList(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolio(item);
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
					item.folio = generateFolio(item);
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
					item.folio = generateFolio(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
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
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				});
				setCabinas(response.data);
			}
		}

		const loadSalaCirugias = async () => {
			const response = await findSalaCirugiaBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolio(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
					item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
				});
				setSalaCirugias(response.data);
			}
		}

		const loadListaEsperaCirugias = async () => {
			const response = await waitingListCirugia(sucursal, asistioStatusId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolio(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
					item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
				});
				setListaEsperaCirugias(response.data);
			}
		}

		const loadListaEsperaEstetica = async () => {
			const response = await waitingListEstetica(sucursal, asistioStatusId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.folio = generateFolio(item);
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				});
				setListaEsperaEstetica(response.data);
				setIsLoading(false);
			}
		}

		loadConsultorios();
		loadListaEsperaConsultas();
		loadListaEsperaTratamientos();
		loadCabinas();
		loadSalaCirugias();
		loadListaEsperaEstetica();
		loadListaEsperaCirugias();
		*/
		loadAll();

	}, [sucursal, asistioStatusId]);



	return (
		<Fragment>
			{
				!isLoading ?
					<ListaEsperaContainer
						columnsConsultorios={columnsConsultorios}
						columnsEspera={columnsEspera}
						columnsCabinas={columnsCabinas}
						columnsSalaCirugias={columnsSalaCirugias}
						tituloConsultorios='Consultorios'
						tituloCabinas='Cabinas'
						tituloSalaCirugia='Sala Cirugias'
						tituloEsperaConsultas='Consultas en espera'
						tituloEsperaTratamientos='Tratamientos en espera'
						tituloEsperaSalaCirugia="Cirugias en espera"
						optionsEspera={optionsEspera}
						optionsConsultorio={optionsConsultorio}
						consultorio={consultorio}
						consultorios={consultorios}
						cabinas={cabinas}
						listaEsperaConsultas={listaEsperaConsultas}
						listaEsperaTratamientos={listaEsperaTratamientos}
						listaEsperaCirugias={listaEsperaCirugias}
						actionsEsperaConsultorio={actionsEsperaConsultorio}
						actionsEsperaCabina={actionsEsperaCabina}
						actionsConsultorio={actionsConsultorio}
						actionsCabina={actionsCabina}
						openModalConsultorioAsignar={openModalConsultorioAsignar}
						openModalCabinaAsignar={openModalCabinaAsignar}
						openModalSalaCirugiaAsignar={openModalSalaCirugiaAsignar}
						tipo_servicio={tipo_servicio}
						servicio={servicio}
						handleClose={handleClose}
						cambio={cambio}
						loadAll={loadAll}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						paciente={paciente}
						salaCirugias={salaCirugias}
						actionsSalaCirugia={actionsSalaCirugia}
						listaEsperaEstetica={listaEsperaEstetica}
						actionsEsperaSalaCirugia={actionsEsperaSalaCirugia}
						componentsConsultorio={componentsConsultorio}
					/> :
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