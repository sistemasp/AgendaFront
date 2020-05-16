import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { FormControl, InputLabel, Select, makeStyles, MenuItem, Paper, Grid, InputAdornment, IconButton, OutlinedInput } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
	},
	margin: {
		margin: theme.spacing(1),
	},
	textField: {
		width: '25ch',
	},
}));

export const LoginContainer = (props) => {

	const classes = useStyles();

	const {
		values,
		errors,
		touched,
		handleSubmit,
		handleChangeNumber,
		handleChangePassword,
		isValid,
		sucursales,
		onChangeSucursal,
		handleClickShowPassword,
		handleMouseDownPassword,
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
				<Grid item xs={12}>
					<FormControl variant="outlined" className={classes.margin, classes.textField}>
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
				<Grid item xs={12}>
					<TextField
						name="employee_number"
						helperText={touched.employee_number ? errors.employee_number : ""}
						error={Boolean(errors.employee_number)}
						label="Numero de empleado"
						value={values.employee_number}
						onChange={handleChangeNumber}
						variant="outlined" />
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.margin, classes.textField} variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={values.showPassword ? 'text' : 'password'}
						value={values.password}
						onChange={handleChangePassword}
						endAdornment={
						<InputAdornment position="end">
							<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword}
							onMouseDown={handleMouseDownPassword}
							edge="end"
							>
							{values.showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
						}
						labelWidth={70}
					/>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Button
						className={classes.textField}
						type="submit"
						color="primary"
						variant="contained"
						onClick={handleSubmit}
						disabled={!isValid || !values.employee_number || !values.sucursal.nombre || !values.password} >
						Entrar
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};
