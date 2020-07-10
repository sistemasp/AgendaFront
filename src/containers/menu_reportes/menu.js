import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ReportesConsultas from './reportes/reportes_consultas';
import ReportesTratamientos from './reportes/reportes_tratamientos';
import ReportesPagos from './reportes/reportes_pagos';
import ReportesFacturas from './reportes/reportes_facturas';

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
		onChangeTab,
		value,
		sucursal,
	} = props;

	return (
		<div className={classes.root}>
			<AppBar className={classes.bar} position="static">
				<Tabs value={value} onChange={onChangeTab} aria-label="simple tabs">
					<Tab label="Reportes Consulta" {...a11yProps(0)} />
					<Tab label="Reportes Tratamiento" {...a11yProps(1)} />
					<Tab label="Reportes Pagos" {...a11yProps(2)} />
					<Tab label="Reportes Facturas" {...a11yProps(3)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<ReportesConsultas
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ReportesTratamientos
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<ReportesPagos
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<ReportesFacturas
					sucursal={sucursal} />
			</TabPanel>
		</div>
	);
}
