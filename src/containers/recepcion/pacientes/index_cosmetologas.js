import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { getAllPatients, updatePatient, createPatient, findPatientByPhoneNumber } from '../../../services';
import HistoryIcon from '@material-ui/icons/History';
import { PacientesCosmetologasContainer } from "./pacientes_cosmetologas";


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

const PacientesForCosmetologas = (props) => {

	const classes = useStyles();

	const [open, setOpen] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [paciente, setPaciente] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		onClickAgendar
	} = props;

	const columns = [
		{ title: 'NOMBRES', field: 'nombres' },
		{ title: 'APELLIDOS', field: 'apellidos' },
		{ title: 'TELÉFONO', field: 'telefono' },
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
		exportDelimiter: ';'
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setPaciente({});
		setOpen(false);
		setOpenHistoric(false);
	};

	const handleClickHistorico = (event, rowData) => {
		setPaciente(rowData);
		setOpenHistoric(true);
	}

	const actions = [
		{
			icon: HistoryIcon,
			tooltip: 'Ver Historico',
			onClick: handleClickHistorico
		}
	];

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
					<PacientesCosmetologasContainer
						columns={columns}
						titulo='PACIENTES'
						actions={actions}
						options={options}
						open={open}
						openHistoric={openHistoric}
						paciente={paciente}
						handleOpen={handleOpen}
						handleClose={handleClose} /> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default PacientesForCosmetologas;