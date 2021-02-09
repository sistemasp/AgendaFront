import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { PacientesContainer } from './pacientes';
import { getAllPatients, updatePatient, createPatient, findPatientByPhoneNumber } from '../../../services';
import EditIcon from '@material-ui/icons/Edit';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import TodayIcon from '@material-ui/icons/Today';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	formControl: {
		width: '100%',
		margin: '5px',
	},
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

const Pacientes = (props) => {

	const classes = useStyles();

	const [open, setOpen] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [paciente, setPaciente] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		onClickAgendar,
		onClickAgendarConsulta,
		onClickAgendarFaciales,
		onClickAgendarLaser,
		onClickAgendarAparatologia,
		onClickAgendarDermapen,
	} = props;

	const columns = [
		{ title: 'NOMBRES', field: 'nombres' },
		{ title: 'APELLIDOS', field: 'apellidos' },
		{ title: 'TELEFONO', field: 'telefono' },
		{ title: 'SEXO', field: 'sexo.nombre' },
		{ title: 'FECHA DE NACIMIENTO', field: 'fecha_nacimiento' },
	];

	const options = {
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';',
		cellStyle: {
			fontWeight: 'bolder',
			fontSize: '16px',
			padding: '0px',
		},
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setPaciente({});
		setOpen(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadPacientes = async () => {
		/*const response = await getAllPatients();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPacientes(response.data);
		}*/
		setIsLoading(false);
	}

	const handleOnClickGuardar = async (e, val) => {
		setIsLoading(true);
		const existPatient = paciente._id ? '' : await findPatientByPhoneNumber(val.telefono);
		setOpenAlert(true);

		if (`${existPatient.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (existPatient.data.length > 0) {
				setSeverity('warning');
				setMessage('YA EXISTE UN REGISTRO CON EL MISMO NUMERO DE TELEFONO');
				setIsLoading(false);
				handleClose();
				return;
			}
		}

		const response = paciente._id ? await updatePatient(paciente._id, val) : await createPatient(val);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			loadPacientes();
			setMessage(paciente._id ? 'PACIENTE ACTUALIZADO' : 'PACIENTE CREADO');
		}

		handleClose();
		setIsLoading(false);
	}

	const handleOnClickGuardarAgendar = async (e, val) => {
		setIsLoading(true);
		const existPatient = paciente._id ? '' : await findPatientByPhoneNumber(val.telefono);
		setOpenAlert(true);

		if (`${existPatient.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (existPatient.data.length > 0) {
				setSeverity('warning');
				setMessage('YA EXISTE UN REGISTRO CON EL MISMO NUMERO DE TELEFONO');
				setIsLoading(false);
				handleClose();
				return;
			}
		}

		const response = paciente._id ? await updatePatient(paciente._id, val) : await createPatient(val);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			loadPacientes();
			onClickAgendar(e, val);
			setMessage(paciente._id ? 'PACIENTE ACTUALIZADO' : 'PACIENTE CREADO');
		}

		handleClose();
		setIsLoading(false);
	}

	const handleOnClickEditar = (event, rowData) => {
		setPaciente(rowData);
		setOpen(true);
	}

	const handleClickHistorico = (event, rowData) => {
		setPaciente(rowData);
		setOpenHistoric(true);
	}

	const actions = [
		{
			icon: TodayIcon,
			tooltip: 'AGREGAR CONSULTA',
			onClick: onClickAgendarConsulta
		},
		{
			icon: EventAvailableIcon,
			tooltip: 'AGREGAR FACIAL',
			onClick: onClickAgendarFaciales
		},
		/*{
			icon: EventAvailableIcon,
			tooltip: 'AGREGAR LÁSER',
			onClick: onClickAgendarLaser
		},*/
		{
			icon: EventAvailableIcon,
			tooltip: 'AGREGAR APARATOLOGIA',
			onClick: onClickAgendarAparatologia
		},
		{
			icon: EditIcon,
			tooltip: 'ACTUALIZAR REGISTRO',
			onClick: handleOnClickEditar
		},
		{
			icon: HistoryIcon,
			tooltip: 'HISTORICO',
			onClick: handleClickHistorico
		}
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'AGREGAR CONSULTA':
				onClickAgendarConsulta(e, rowData);
				break;
			case 'AGREGAR FACIAL':
				onClickAgendarFaciales(e, rowData);
				break;
			/*case 'AGREGAR LÁSER':
				onClickAgendarLaser(e, rowData);
				break;*/
			case 'AGREGAR APARATOLOGIA':
				onClickAgendarAparatologia(e, rowData);
				break;
			case 'ACTUALIZAR REGISTRO':
				handleOnClickEditar(e, rowData);
				break;
			case 'HISTORICO':
				handleClickHistorico(e, rowData);
				break;
		}
	}

	const components = {
		Actions: props => {
			return <Fragment>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="simple-select-outlined-hora"></InputLabel>
					<Select
						labelId="simple-select-outlined-actions"
						id="simple-select-outlined-actions"
						onChange={(e) => onChangeActions(e, props.data)}
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

	useEffect(() => {
		const loadPacientes = async () => {
			/*const response = await getAllPatients();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPacientes(response.data);
			}*/
			setIsLoading(false);
		}
		loadPacientes();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<PacientesContainer
						columns={columns}
						titulo='PACIENTES'
						actions={actions}
						options={options}
						open={open}
						openHistoric={openHistoric}
						paciente={paciente}
						telefono={paciente.telefono}
						onClickGuardar={handleOnClickGuardar}
						onClickGuardarAgendar={handleOnClickGuardarAgendar}
						handleOpen={handleOpen}
						handleClose={handleClose}
						components={components} /> :
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

export default Pacientes;