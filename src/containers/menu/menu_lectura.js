import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Pacientes from '../pacientes/index';
import Citas from '../citas/index';
import Agendar from '../agendar/index';
import { Button, Toolbar } from '@material-ui/core';
import Reportes from '../reportes/index';
import ModalPassword from '../../components/modal_password';
import AgendarLectura from '../agendar/index_lectura';
import PacientesLectura from '../pacientes/index_lectura';


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	bar: {
		backgroundColor: "#2BA6C6",
	}
}));

export const MenuLecturaContainer = props => {
	const classes = useStyles();

	const {
		pacienteAgendado,
		setPacienteAgendado,
		onChangeTab,
		value,
		empleado,
		sucursal,
		onClickLogout,
		onClickCambioPassword,
		open,
		onClose,
		onOpen,
		setMessage,
		setSeverity,
		setOpenAlert,
	} = props;

	return (
		<div className={classes.root}>
			{
				open ?
					<ModalPassword
						open={open}
						onClose={onClose}
						empleado={empleado}
						onClickLogout={onClickLogout}
						onClickCambioPassword={onClickCambioPassword}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert} /> : ''
			}
			<AppBar className={classes.bar} position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						{`Sucuarsal: ${sucursal.nombre} - ${empleado.nombre} ( ${empleado.rol.nombre} )`}
					</Typography>
					<Button
						color="default"
						variant="contained"
						onClick={onOpen}>Cambiar Contraseña</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={onClickLogout}>Cerrar Sesion</Button>
				</Toolbar>
			</AppBar>
			<AppBar className={classes.bar} position="static">
				<Tabs value={value} onChange={onChangeTab} aria-label="simple tabs">
					<Tab label="Pacientes" {...a11yProps(0)} />
					<Tab label="Buscar citas" {...a11yProps(1)} />
					<Tab label="Calendario" {...a11yProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<PacientesLectura
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<AgendarLectura
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Citas
					sucursal={sucursal._id} />
			</TabPanel>
		</div>
	);
}
