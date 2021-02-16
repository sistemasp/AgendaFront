import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ListaEsperaContainer } from './lista_espera';
import {
	findCabinaBySucursalId,
	updateCabina,
	breakFreeCabinaByIdPaciente,
	findSalaCirugiaBySucursalId,
	updateSalaCirugia,
	breakFreeSalaCirugiaByIdPaciente,
} from '../../../services';
import {
	waitingListConsulta,
	updateConsult,
	findConsultById
} from '../../../services/consultas';
import {
	waitingListCirugia,
	findCirugiaById,
	updateCirugia,
} from '../../../services/cirugias';
import {
	waitingListEstetica,
	findEsteticaById,
	updateEstetica,
} from '../../../services/esteticas';
import InputIcon from '@material-ui/icons/Input';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import { addZero, generateFolio } from "../../../utils/utils";
import {
	findFacialById,
	waitingFacialList,
	updateFacial,
} from "../../../services/faciales";
import {
	findLaserById,
	updateLaser,
	waitingLaserList,
} from "../../../services/laser";
import {
	findAparatologiaById,
	updateAparatologia,
	waitingAparatologiaList,
} from "../../../services/aparatolgia";
import { 
	findDermapenById,
	updateDermapen,
	waitingDermapenList
} from "../../../services/dermapens";
import { 
	breakFreeSurgeryByIdPaciente,
	findSurgeryBySucursalIdWaitingList,
	updateSurgery
} from "../../../services/consultorios";

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
	const [listaEsperaFaciales, setListaEsperaFaciales] = useState([]);
	const [listaEsperaDermapens, setListaEsperaDermapens] = useState([]);
	const [listaEsperaLasers, setListaEsperaLasers] = useState([]);
	const [listaEsperaAparatologias, setListaEsperaAparatologias] = useState([]);
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
		{ title: 'CONSULTORIO', field: 'nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
	];

	const columnsCabinas = [
		{ title: 'CABINA', field: 'nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'COSMETÓLOGA', field: 'cosmetologa_nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
	];

	const columnsSalaCirugias = [
		{ title: 'SALA', field: 'nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
	];

	const columnsEspera = [
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'CONSECUTIVO', field: 'consecutivo' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
	];

	const columnsEsperaConsultas = [
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'CONSECUTIVO', field: 'consecutivo' },
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
		exportDelimiter: ';',
		paging: false,
	}

	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
	const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
	const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
	const facialServicioId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const dermapenServicioId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const laserServicioId = process.env.REACT_APP_LASER_SERVICIO_ID;
	const aparatologiaServicioId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalIdWaitingList(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
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
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaConsultas(response.data);
		}
	}

	const loadListaEsperaFaciales = async () => {
		const response = await waitingFacialList(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaFaciales(response.data);
		}
	}

	const loadListaEsperaDermapens = async () => {
		const response = await waitingDermapenList(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaDermapens(response.data);
		}
	}

	const loadListaEsperaAparatologias = async () => {
		const response = await waitingAparatologiaList(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaAparatologias(response.data);
		}
	}

	const loadSalaCirugias = async () => {
		const response = await findSalaCirugiaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
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
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
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
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
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
		rowData.disponible = true;

		const response = await updateSurgery(rowData._id, rowData);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalConsultorioAsignar(true);
			await breakFreeSurgeryByIdPaciente(rowData._id);
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

	const handleOnClickLiberarCabina = async (event, rowData) => {
		const dateNow = new Date();

		let responseCita;
		switch (rowData.tipo_servicio) {
			case facialServicioId:
				responseCita = await findFacialById(rowData.servicio);
				break;
			case dermapenServicioId:
				responseCita = await findDermapenById(rowData.servicio);
				break;
			case laserServicioId:
				responseCita = await findLaserById(rowData.servicio);
				break;
			case aparatologiaServicioId:
				responseCita = await findAparatologiaById(rowData.servicio);
				break;
		}

		if (responseCita && `${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const cita = responseCita.data;
			let updateCita = cita;
			updateCita.status = atendidoStatusId;
			updateCita.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			switch (rowData.tipo_servicio) {
				case facialServicioId:
					responseCita = await updateFacial(cita._id, updateCita);
					break;
				case dermapenServicioId:
					responseCita = await updateDermapen(cita._id, updateCita);
					break;
				case laserServicioId:
					responseCita = await updateLaser(cita._id, updateCita);
					break;
				case aparatologiaServicioId:
					responseCita = await updateAparatologia(cita._id, updateCita);
					break;
			}
			rowData.disponible = true;
			await updateCabina(rowData._id, rowData);
			const response = await breakFreeCabinaByIdPaciente(rowData._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('SALIO EL PACIENTE');
				await loadAll();
			}
		}
	}

	const handleOnClickLiberarConsultorio = async (event, rowData) => {
		const dateNow = new Date();
		const responseCita = await findConsultById(rowData.servicio);

		if (responseCita && `${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const cita = responseCita.data;
			let updateCita = cita;
			updateCita.status = atendidoStatusId;
			updateCita.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;

			await updateConsult(cita._id, updateCita);

			rowData.disponible = true;
			await updateSurgery(rowData._id, rowData);
			const response = await breakFreeSurgeryByIdPaciente(rowData._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('SALIO EL PACIENTE');
				await loadAll();
			}
		}
	}

	const handleOnClickLiberarSalaCirugia = async (event, rowData) => {
		const dateNow = new Date();
		const responseServicio = rowData.tipo_servicio === cirugiaServicioId ? await findCirugiaById(rowData.servicio) : await findEsteticaById(rowData.servicio);
		//const responseServicio = await findCirugiaById(rowData.servicio);
		if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const currentService = responseServicio.data;
			let updateData = currentService;
			updateData.status = atendidoStatusId;
			updateData.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			rowData.tipo_servicio === cirugiaServicioId ? await updateCirugia(currentService._id, updateData) : await updateEstetica(currentService._id, updateData);
			rowData.disponible = true;
			await updateSalaCirugia(rowData._id, rowData);
			const response = await breakFreeSalaCirugiaByIdPaciente(rowData._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('SALIO EL PACIENTE');
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
		rowData => {
			return (!rowData.disponible && rowData.consulta.status !== enProcedimientoStatusId) ? {
				icon: DirectionsWalkIcon,
				tooltip: 'Salida paciente',
				onClick: handleOnClickLiberarConsultorio
			} : ''
		},
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
				handleOnClickLiberarConsultorio(e, rowData);
				break;
			case 'Cambiar de consultorio':
				handleOnConsultorioCambiarPaciente(e, rowData);
				break;
		}
	}

	const componentsConsultorio = {
		Actions: props => {
			return <Fragment>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="simple-select-outlined"></InputLabel>
					<Select
						labelId="simple-select-outlined-actions"
						id="simple-select-outlined-actions"
						onChange={(e) => onChangeActionsConsultorio(e, props.data)}
						label="ACCIONES">
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
				onClick: handleOnClickLiberarCabina
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
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setCabinas(response.data);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadConsultorios();
		await loadListaEsperaConsultas();
		await loadListaEsperaFaciales();
		await loadListaEsperaAparatologias();
		await loadListaEsperaDermapens();
		await loadCabinas();
		await loadSalaCirugias();
		await loadListaEsperaEstetica();
		await loadListaEsperaCirugias();
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<ListaEsperaContainer
						columnsConsultorios={columnsConsultorios}
						columnsEspera={columnsEspera}
						columnsCabinas={columnsCabinas}
						columnsSalaCirugias={columnsSalaCirugias}
						columnsEsperaConsultas={columnsEsperaConsultas}
						tituloConsultorios='CONSULTORIOS'
						tituloCabinas='CABINAS'
						tituloSalaCirugia='SALA CIRUGIAS'
						tituloEsperaConsultas='CONSULTAS EN ESPERA'
						tituloEsperaTratamientos='TRATAMIENTOS EN ESPERA'
						tituloEsperaSalaCirugia="CIRUGIAS EN ESPERA"
						optionsEspera={optionsEspera}
						optionsConsultorio={optionsConsultorio}
						consultorio={consultorio}
						consultorios={consultorios}
						cabinas={cabinas}
						listaEsperaConsultas={listaEsperaConsultas}
						listaEsperaLasers={listaEsperaLasers}
						listaEsperaAparatologias={listaEsperaAparatologias}
						listaEsperaFaciales={listaEsperaFaciales}
						listaEsperaDermapens={listaEsperaDermapens}
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