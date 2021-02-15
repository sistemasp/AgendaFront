import React from "react";
import TextField from "@material-ui/core/TextField";
import {
	makeStyles,
	Paper,
	Grid,
} from "@material-ui/core";

import { Fragment } from "react";
import myStyles from "../../../css";

export const InicioContainer = (props) => {

	const classes = myStyles();

	const {
		dermatologo,
		sucursal,
		consultorio,
	} = props;

	return (
		<Fragment>
			<Paper className={classes.paper_principal}>
				<Grid container spacing={3}>
					<Grid item xs={12} className={classes.gridItem}>
						<h1>{consultorio.nombre}</h1>
					</Grid>
				</Grid>
			</Paper>

			<Paper className={classes.paper_principal}>
				<Grid container spacing={3}>
					<Grid item xs={12} className={classes.gridItem}>
						<p>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</p>
					</Grid>
				</Grid>
			</Paper>
		</Fragment>
	);
};
