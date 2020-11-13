import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Pacientes from '../pacientes/index';
import AgendarConsulta from '../agendar_consulta';
import Consultas from '../calendario/consultas';
import AgendarFacial from '../agendar_facial';
import AgendarLaser from '../agendar_laser';
import AgendarAparatologia from '../agendar_aparatologia';
import Faciales from '../calendario/faciales';
import Laser from '../calendario/laser';
import Aparatologia from '../calendario/aparatologia';
import ModalDermapen from '../../components/modales/modal_dermapen';
import AgendarDermapen from '../agendar_dermapen';

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

export const MenuContainer = props => {
	const classes = useStyles();

	const {
		pacienteAgendado,
		setPacienteAgendado,
		onChangeTab,
		value,
		onClickAgendarFaciales,
		onClickAgendarConsulta,
		onClickAgendarLaser,
		onClickAgendarAparatologia,
		onClickAgendarDermapen,
		empleado,
		sucursal,
		history,
	} = props;

	return (
		<div className={classes.root}>
			<AppBar
				className={classes.bar}
				position="static"
			>
				<Tabs
					value={value}
					onChange={onChangeTab}
					aria-label="simple tabs"
					variant="scrollable"
					scrollButtons="on"
				>
					<Tab label="PACIENTES" {...a11yProps(0)} />
					<Tab label="CONSULTA" {...a11yProps(1)} />
					<Tab label="FACIALES" {...a11yProps(2)} />
					<Tab label="LÁSER" {...a11yProps(3)} />
					<Tab label="APARATOLOGÍA" {...a11yProps(4)} />
					<Tab label="DERMAPEN" {...a11yProps(5)} />
					<Tab label="VER CONSULTAS" {...a11yProps(6)} />
					<Tab label="VER FACIALES" {...a11yProps(7)} />
					<Tab label="VER LÁSER" {...a11yProps(8)} />
					<Tab label="VER APARATOLOGÍA" {...a11yProps(9)} />
					<Tab label="VER DERMAPEN" {...a11yProps(10)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Pacientes
					onClickAgendarFaciales={onClickAgendarFaciales}
					onClickAgendarConsulta={onClickAgendarConsulta}
					onClickAgendarLaser={onClickAgendarLaser}
					onClickAgendarAparatologia={onClickAgendarAparatologia}
					onClickAgendarDermapen={onClickAgendarDermapen}
					onChangeTab={onChangeTab} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<AgendarConsulta
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal}
					history={history} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<AgendarFacial
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<AgendarLaser
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={4}>
				<AgendarAparatologia
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={5}>
				<AgendarDermapen
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={6}>
				<Consultas
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={7}>
				<Faciales
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={8}>
				<Laser
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={9}>
				<Aparatologia
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={10}>
				<Faciales
					sucursal={sucursal._id} />
			</TabPanel>
		</div>
	);
}
