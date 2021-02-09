import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PacientesForCosmetologas from '../pacientes/index_cosmetologas';
import AgendarFacial from '../agendar_facial';
import Faciales from '../calendario/faciales';
import Laser from '../calendario/laser';
import Aparatologia from '../calendario/aparatologia';

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

export const MenuCosmetologaContainer = props => {
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
			<AppBar className={classes.bar} position="static">
				<Tabs value={value} onChange={onChangeTab} aria-label="simple tabs">
					<Tab label="PACIENTES" {...a11yProps(0)} />
					<Tab label="BUSCAR CITAS" {...a11yProps(1)} />
					<Tab label="FACIALES" {...a11yProps(2)} />
					<Tab label="LÁSER" {...a11yProps(3)} />
					<Tab label="APARATOLOGÍA" {...a11yProps(4)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<PacientesForCosmetologas
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<AgendarFacial
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Faciales
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<Laser
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={4}>
				<Aparatologia
					sucursal={sucursal._id} />
			</TabPanel>
		</div>
	);
}
