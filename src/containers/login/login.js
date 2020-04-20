import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { FormControl, InputLabel, Select, makeStyles, MenuItem, Paper, Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
    formControl: {
        minWidth: 120,
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        width: '100%',
    }
}));

export const LoginContainer = (props) => {

	const classes = useStyles();

	const {
		values,
		errors,
		touched,
		handleSubmit,
		handleChange,
		isValid,
		sucursales,
		onChangeSucursal,
		//setFieldTouched
	} = props;
	// console.table(props);
    /*
	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
    };*/
    
	return (
		<Paper>
			<Grid container className={classes.root} justify="center" spacing={3}>
				<Grid item xs={12} sm={2}>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="simple-select-outlined-sucursal">Sucursales</InputLabel>
						<Select
							labelId="simple-select-outlined-sucursal"
							id="simple-select-outlined-sucursal"
							value={values.sucursal}
							error={Boolean(errors.sucursal)}
							onChange={onChangeSucursal}
							label="Servicio" >
								{ sucursales 
									? sucursales.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)
									: '' }
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={2}>
					<TextField
						name="employee_number"
						helperText={touched.employee_number ? errors.employee_number : ""}
						error={Boolean(errors.employee_number)}
						label="Numero de empleado"
						value={values.employee_number}
						onChange={handleChange}
						variant="outlined" />
				</Grid>
				<Grid item xs={12} sm={2}>
					<Button
						type="submit"
						color="primary"
						variant="contained"
						onClick={handleSubmit}
						disabled={!isValid} >
						Entrar
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};
