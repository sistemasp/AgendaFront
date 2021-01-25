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
import ReportesCirugias from './reportes/reportes_cirugias';
import ReportesBiopsias from './reportes/reportes_biopsias';
import ReportesFaciales from './reportes/reportes_faciales';
import ReportesLaser from './reportes/reportes_laser';
import ReportesAparatologia from './reportes/reportes_aparatologia';
import ReportesDetallesGeneral from './reportes/detalles_general';
import ReportesGastos from './reportes/gastos';
import ReportesIngresos from './reportes/ingresos';

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
		backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
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
					<Tab label="DETALLES GENERAL" {...a11yProps(0)} />
					<Tab label="INGRESOS" {...a11yProps(1)} />
					<Tab label="GASTOS" {...a11yProps(2)} />
					{/*
					<Tab label="APARATOLOGÍA" {...a11yProps(3)} />
					<Tab label="PAGOS" {...a11yProps(4)} />
					<Tab label="FACTURAS" {...a11yProps(5)} />
					<Tab label="CIRGIAS" {...a11yProps(6)} />
					<Tab label="BIOPSIAS" {...a11yProps(7)} />
					*/}
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<ReportesDetallesGeneral
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ReportesIngresos
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<ReportesGastos
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<ReportesAparatologia
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={4}>
				<ReportesPagos
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={5}>
				<ReportesFacturas
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={6}>
				<ReportesCirugias
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={7}>
				<ReportesBiopsias
					sucursal={sucursal} />
			</TabPanel>
		</div>
	);
}
