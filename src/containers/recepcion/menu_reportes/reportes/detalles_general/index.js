import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesDetalleGeneralContainer } from "./reportes_detalle_general";
import { findConsultsByRangeDateAndSucursal } from "../../../../../services/consultas";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio } from "../../../../../utils/utils";
import { findFacialByRangeDateAndSucursal, findFacialByRangeDateAndSucursalAndService } from "../../../../../services/faciales";
import { findAparatologiaByRangeDateAndSucursal, findAparatologiaByRangeDateAndSucursalAndService } from "../../../../../services/aparatolgia";
import { findEsteticasByRangeDateAndSucursal } from "../../../../../services/esteticas";
import { findCirugiasByRangeDateAndSucursal } from "../../../../../services/cirugias";
import { findDermapenByRangeDateAndSucursal } from "../../../../../services/dermapens";
import { showAllBanco, showAllMetodoPago, showAllTipoTarjeta } from "../../../../../services";
import { findRazonSocialById } from "../../../../../services/razones_sociales";
import { ControlCamera } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesDetallesGeneral = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
	const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
	const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const formaPagoTarjetaId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const iva = process.env.REACT_APP_IVA;

	const [isLoading, setIsLoading] = useState(true);
	const [consultas, setConsultas] = useState([]);
	const [faciales, setFaciales] = useState([]);
	const [cirugias, setCirugias] = useState([]);
	const [dermapens, setDermapens] = useState([]);
	const [aparatologias, setAparatologias] = useState([]);
	const [esteticas, setEsteticas] = useState([]);
	const [datos, setDatos] = useState([]);

	const [bancos, setBancos] = useState([]);
	const [metodosPago, setMetodosPago] = useState([]);
	const [tiposTarjeta, setTiposTarjeta] = useState([]);

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [startDate, setStartDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const [endDate, setEndDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const columns = [
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'SUCURSAL', field: 'sucursal.nombre' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		{ title: 'HORA SALIDA', field: 'hora_salida' },
		{ title: 'RECEPCIONISTA', field: 'quien_agenda.nombre' },
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'FRECUENCIA', field: 'frecuencia.nombre' },
		{ title: 'TIPO', field: 'tipo_cita.nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'CANTIDAD SERVICIOS', field: 'cantidad_servicios' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'PRODUCTO', field: 'producto.nombre' },
		{ title: 'ZONA', field: 'area' },
		// { title: 'IMPORTE REAL', field: 'precio_real' },
		// { title: 'IMPORTE PRODUCTO', field: 'importe_producto' },
		// { title: 'IMPORTE ZONA', field: 'importe_zona' },
		{ title: 'IMPORTE 1', field: 'importe_1' },
		{ title: '% DESCUENTO CLINICA', field: 'descuento_porcentaje_clinica' },
		{ title: '$ DESCUENTO CLINICA', field: 'descuento_cantidad_clinica' },
		{ title: '% DESCUENTO DERMATÓLOGO', field: 'descuento_porcentaje_dermatologo' },
		{ title: '$ DESCUENTO DERMATÓLOGO', field: 'descuento_cantidad_dermatologo' },
		{ title: '% DESCUENTO', field: 'descuento_porcentaje' },
		{ title: '$ DESCUENTO', field: 'descuento_cantidad' },
		{ title: 'IMPORTE 2', field: 'importe_2' },
		{ title: '% IMPUESTO', field: 'impuesto_porcentaje' },
		{ title: '$ IMPUESTO', field: 'impuesto_cantidad' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'TOTAL DOCTOR', field: 'total_doctor' },
		{ title: 'TOTAL CLÍNICA', field: 'total_clinica' },
		{ title: 'METODO DE PAGO', field: 'metodo_pago_nombre' },
		{ title: 'FACTURA', field: 'requiere_factura' },
		{ title: 'TARJETA', field: 'tipo_tarjeta' },
		{ title: 'BANCO', field: 'banco_nombre' },
		{ title: 'DÍGITOS', field: 'digitos' },
		{ title: 'RAZÓN SOCIAL', field: 'razon_social_nombre' },
		{ title: 'RFC', field: 'rfc' },
		{ title: 'NO. DE FACTURA', field: 'no_factura' },
		{ title: 'FECHA FACTURACIÓN', field: 'fecha_facturacion' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },

	];

	const options = {
		/*rowStyle: rowData => {
			return { 
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? '#10CC88' : ''
			};
		},*/
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
	}

	const procesarConsulta = (consulta, datos) => {
		consulta.iva = false;

		consulta.pagos.forEach(pago => {
			const metodoPago = metodosPago.find(metodoPago => {
				return metodoPago._id === pago.forma_pago;
			});
			if (pago.forma_pago === formaPagoTarjetaId) {
				const banco = bancos.find(banco => {
					return banco._id === pago.banco;
				});
				const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
					return tipoTarjeta._id === pago.tipo_tarjeta;
				});
				pago.banco_nombre = banco ? banco.nombre : 'ERROR';
				pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
				pago.digitos = pago.digitos;
			} else {
				pago.banco_nombre = 'NO APLICA';
				pago.tipo_tarjeta_nombre = 'NO APLICA';
				pago.digitos = 'NO APLICA';
			}

			const impuestoPorcentaje = consulta.iva ? iva : 0;
			const importe2 = pago.total / (1 + (impuestoPorcentaje / 100));
			const impuesto = importe2 * (impuestoPorcentaje / 100);
			const descuentoPorcentaje = 100 - (pago.total * 100 / consulta.precio);
			const descuentoCantidad = (consulta.precio * descuentoPorcentaje / 100);
			const pagoDermatologo = pago.total * consulta.pago_dermatologo / consulta.total;
			const pagoClinica = pago.total - pagoDermatologo;
			const descuentoClinicaPorcentaje = consulta.porcentaje_descuento_clinica ? consulta.porcentaje_descuento_clinica : 0;
			const descuentoDermatologoPorcentaje = consulta.descuento_dermatologo ? consulta.descuento_dermatologo : 0;
			const descuentoClinica = descuentoClinicaPorcentaje * consulta.precio / 100;
			const descuentoDermatologo = descuentoDermatologoPorcentaje * (consulta.precio - descuentoClinica) / 100;
			const dato = {
				...consulta,
				metodo_pago_nombre: metodoPago.nombre,
				tipo_tarjeta: pago.tipo_tarjeta_nombre,
				banco_nombre: pago.banco_nombre,
				digitos: pago.digitos,
				importe_1: consulta.precio_moneda,
				area: "NO APLICA",
				descuento_porcentaje_clinica: `${descuentoClinicaPorcentaje}%`,
				descuento_cantidad_clinica: toFormatterCurrency(descuentoClinica),
				descuento_porcentaje_dermatologo: `${descuentoDermatologoPorcentaje}%`,
				descuento_cantidad_dermatologo: toFormatterCurrency(descuentoDermatologo),
				descuento_porcentaje: `${descuentoPorcentaje}%`,
				descuento_cantidad: toFormatterCurrency(descuentoCantidad),
				impuesto_porcentaje: `${impuestoPorcentaje}%`,
				importe_2: toFormatterCurrency(importe2),
				impuesto_cantidad: toFormatterCurrency(impuesto),
				cantidad_servicios: 1 / consulta.pagos.length,
				total_moneda: toFormatterCurrency(pago.total),
				total_doctor: toFormatterCurrency(pagoDermatologo),
				total_clinica: toFormatterCurrency(pagoClinica),
			}
			datos.push(dato);
		});
	}

	const procesarFacial = (facial, datos) => {
		facial.tratamientos.forEach(tratamiento => {
			const producto = tratamiento;
			let totalPagos = 0;
			facial.pagos.forEach(pago => {
				const metodoPago = metodosPago.find(metodoPago => {
					return metodoPago._id === pago.forma_pago;
				});
				if (pago.forma_pago === formaPagoTarjetaId) {
					const banco = bancos.find(banco => {
						return banco._id === pago.banco;
					});
					const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
						return tipoTarjeta._id === pago.tipo_tarjeta;
					});
					pago.banco_nombre = banco ? banco.nombre : 'ERROR';
					pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
					pago.digitos = pago.digitos;
				} else {
					pago.banco_nombre = 'NO APLICA';
					pago.tipo_tarjeta_nombre = 'NO APLICA';
					pago.digitos = 'NO APLICA';
				}
				producto.areasSeleccionadas.forEach(areaSeleccionada => {
					pago.cantidad = Number(pago.cantidad);
					areaSeleccionada.precio_real = Number(areaSeleccionada.precio_real);
					while (pago.cantidad !== 0 && areaSeleccionada.precio_real !== 0) {

						totalPagos++;
						let total = 0;
						if (pago.cantidad > areaSeleccionada.precio_real) {
							total = areaSeleccionada.precio_real;
							pago.cantidad -= areaSeleccionada.precio_real;
							areaSeleccionada.precio_real = 0;
						} else if (pago.cantidad < areaSeleccionada.precio_real) {
							total = pago.cantidad;
							areaSeleccionada.precio_real -= pago.cantidad;
							pago.cantidad = 0;
						} else {
							total = areaSeleccionada.precio_real;
							areaSeleccionada.precio_real = 0;
							pago.cantidad = 0;
						}

						const impuestoPorcentaje = areaSeleccionada.iva ? iva : 0;
						const importe2 = total / (1 + (impuestoPorcentaje / 100));
						const impuesto = importe2 * (impuestoPorcentaje / 100);
						const descuentoPorcentaje = 100 - (total * 100 / producto.importe1);
						const descuentoCantidad = (producto.importe1 * descuentoPorcentaje / 100);
						const pagoDermatologo = facial.dermatologo._id !== dermatologoDirectoId
							? (total * areaSeleccionada.comision_real / producto.importe1)
							: 0;
						const pagoClinica = total - pagoDermatologo;
						const descuentoClinicaPorcentaje = facial.porcentaje_descuento_clinica ? facial.porcentaje_descuento_clinica : 0;
						const descuentoDermatologoPorcentaje = facial.descuento_dermatologo ? facial.descuento_dermatologo : 0;
						const descuentoClinica = descuentoClinicaPorcentaje * producto.importe1 / 100;
						const descuentoDermatologo = descuentoDermatologoPorcentaje * (producto.importe1 - descuentoClinica) / 100;
						const dato = {
							...facial,
							metodo_pago_nombre: metodoPago.nombre,
							producto: producto,
							impuesto_porcentaje: `${impuestoPorcentaje}%`,
							impuesto_cantidad: toFormatterCurrency(impuesto),
							importe_1: toFormatterCurrency(producto.importe1),
							importe_2: toFormatterCurrency(importe2),
							descuento_porcentaje: `${descuentoPorcentaje}%`,
							descuento_cantidad: toFormatterCurrency(descuentoCantidad),
							descuento_porcentaje_clinica: `${descuentoClinicaPorcentaje}%`,
							descuento_porcentaje_dermatologo: `${descuentoDermatologoPorcentaje}%`,
							descuento_cantidad_dermatologo: toFormatterCurrency(descuentoDermatologo),
							descuento_cantidad_clinica: toFormatterCurrency(descuentoClinica),
							area: areaSeleccionada.nombre,
							tipo_tarjeta: pago.tipo_tarjeta_nombre,
							banco_nombre: pago.banco_nombre,
							digitos: pago.digitos,
							total_pagos: totalPagos,
							total_moneda: toFormatterCurrency(total),
							total_doctor: toFormatterCurrency(pagoDermatologo),
							total_clinica: toFormatterCurrency(pagoClinica),
						}
						datos.push(dato);
					}
				});
			});
		});
	}

	const procesarAparatologia = (aparatologia, datos) => {
		aparatologia.tratamientos.forEach(tratamiento => {
			const producto = tratamiento;
			let totalPagos = 0;
			aparatologia.pagos.forEach(pago => {
				const metodoPago = metodosPago.find(metodoPago => {
					return metodoPago._id === pago.forma_pago;
				});
				if (pago.forma_pago === formaPagoTarjetaId) {
					const banco = bancos.find(banco => {
						return banco._id === pago.banco;
					});
					const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
						return tipoTarjeta._id === pago.tipo_tarjeta;
					});
					pago.banco_nombre = banco ? banco.nombre : 'ERROR';
					pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
					pago.digitos = pago.digitos;
				} else {
					pago.banco_nombre = 'NO APLICA';
					pago.tipo_tarjeta_nombre = 'NO APLICA';
					pago.digitos = 'NO APLICA';
				}
				producto.areasSeleccionadas.forEach(areaSeleccionada => {
					pago.total = Number(pago.total);
					let precioReal = Number(areaSeleccionada.precio_real);
					while (pago.total !== 0 && precioReal !== 0) {

						totalPagos++;
						let total = 0;
						if (pago.total > precioReal) {
							total = precioReal;
							pago.total -= precioReal;
							precioReal = 0;
						} else if (pago.total < precioReal) {
							total = pago.total;
							precioReal -= pago.total;
							pago.total = 0;
						} else {
							total = precioReal;
							precioReal = 0;
							pago.total = 0;
						}

						const impuestoPorcentaje = areaSeleccionada.iva ? iva : 0;
						const importe2 = total / (1 + (impuestoPorcentaje / 100));
						const impuesto = importe2 * (impuestoPorcentaje / 100);
						const descuentoPorcentaje = 100 - (total * 100 / producto.importe1);
						const descuentoCantidad = (producto.importe1 * descuentoPorcentaje / 100);
						const pagoDermatologo = aparatologia.dermatologo._id !== dermatologoDirectoId
							? (total * areaSeleccionada.comision_real / areaSeleccionada.precio_real)
							: 0;
						const pagoClinica = total - pagoDermatologo;
						const descuentoClinicaPorcentaje = aparatologia.porcentaje_descuento_clinica ? aparatologia.porcentaje_descuento_clinica : 0;
						const descuentoDermatologoPorcentaje = aparatologia.descuento_dermatologo ? aparatologia.descuento_dermatologo : 0;
						const descuentoClinica = descuentoClinicaPorcentaje * producto.importe1 / 100;
						const descuentoDermatologo = descuentoDermatologoPorcentaje * (producto.importe1 - descuentoClinica) / 100;
						const dato = {
							...aparatologia,
							metodo_pago_nombre: metodoPago.nombre,
							producto: producto,
							impuesto_porcentaje: `${impuestoPorcentaje}%`,
							impuesto_cantidad: toFormatterCurrency(impuesto),
							//importe_servicio: aparatologia.precio_moneda,
							//importe_producto: toFormatterCurrency(producto.importe1),
							//precio_real: toFormatterCurrency(areaSeleccionada.precio_real),
							importe_1: toFormatterCurrency(producto.importe1),
							importe_2: toFormatterCurrency(importe2),
							descuento_porcentaje: `${descuentoPorcentaje}%`,
							descuento_cantidad: toFormatterCurrency(descuentoCantidad),
							descuento_porcentaje_clinica: `${descuentoClinicaPorcentaje}%`,
							descuento_porcentaje_dermatologo: `${descuentoDermatologoPorcentaje}%`,
							descuento_cantidad_dermatologo: toFormatterCurrency(descuentoDermatologo),
							descuento_cantidad_clinica: toFormatterCurrency(descuentoClinica),
							area: areaSeleccionada.nombre,
							tipo_tarjeta: pago.tipo_tarjeta_nombre,
							banco_nombre: pago.banco_nombre,
							digitos: pago.digitos,
							total_pagos: totalPagos,
							total_moneda: toFormatterCurrency(total),
							total_doctor: toFormatterCurrency(pagoDermatologo),
							total_clinica: toFormatterCurrency(pagoClinica),
						}
						datos.push(dato);
					}
				});
			});
		});
	}

	const procesarCirugia = (cirugia, datos) => {
		cirugia.iva = false;
		cirugia.pagos.forEach(pago => {
			let totalPago = Number(pago.total);
			let totalAplicacion = Number(cirugia.total_aplicacion);
			const metodoPago = metodosPago.find(metodoPago => {
				return metodoPago._id === pago.forma_pago;
			});
			if (pago.forma_pago === formaPagoTarjetaId) {
				const banco = bancos.find(banco => {
					return banco._id === pago.banco;
				});
				const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
					return tipoTarjeta._id === pago.tipo_tarjeta;
				});
				pago.banco_nombre = banco ? banco.nombre : 'ERROR';
				pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
				pago.digitos = pago.digitos;
			} else {
				pago.banco_nombre = 'NO APLICA';
				pago.tipo_tarjeta_nombre = 'NO APLICA';
				pago.digitos = 'NO APLICA';
			}

			while (totalPago !== 0 && totalAplicacion !== 0) {

				let total = 0;
				if (totalPago > totalAplicacion) {
					total = totalAplicacion;
					totalPago -= totalAplicacion;
					totalAplicacion = 0;
				} else if (totalPago < totalAplicacion) {
					total = totalPago;
					totalAplicacion -= totalPago;
					totalPago = 0;
				} else {
					total = totalAplicacion;
					totalAplicacion = 0;
					totalPago = 0;
				}

				const impuestoPorcentaje = cirugia.iva ? iva : 0;
				const importe2 = total / (1 + (impuestoPorcentaje / 100));
				const impuesto = importe2 * (impuestoPorcentaje / 100);
				const descuentoPorcentaje = 100 - (total * 100 / cirugia.total);
				const descuentoCantidad = (cirugia.total * descuentoPorcentaje / 100);
				const pagoDermatologo = total * cirugia.pago_dermatologo / cirugia.total_aplicacion;
				const pagoClinica = total - pagoDermatologo;
				const descuentoClinicaPorcentaje = cirugia.porcentaje_descuento_clinica ? cirugia.porcentaje_descuento_clinica : 0;
				const descuentoDermatologoPorcentaje = cirugia.descuento_dermatologo ? cirugia.descuento_dermatologo : 0;
				const descuentoClinica = descuentoClinicaPorcentaje * cirugia.total_aplicacion / 100;
				const descuentoDermatologo = descuentoDermatologoPorcentaje * (cirugia.total_aplicacion - descuentoClinica) / 100;

				const dato = {
					...cirugia,
					metodo_pago_nombre: metodoPago.nombre,
					tipo_tarjeta: pago.tipo_tarjeta_nombre,
					banco_nombre: pago.banco_nombre,
					digitos: pago.digitos,
					importe_1: toFormatterCurrency(cirugia.total),
					area: "NO APLICA",
					descuento_porcentaje_clinica: `${descuentoClinicaPorcentaje}%`,
					descuento_cantidad_clinica: toFormatterCurrency(descuentoClinica),
					descuento_porcentaje_dermatologo: `${descuentoDermatologoPorcentaje}%`,
					descuento_cantidad_dermatologo: toFormatterCurrency(descuentoDermatologo),
					descuento_porcentaje: `${descuentoPorcentaje}%`,
					descuento_cantidad: toFormatterCurrency(descuentoCantidad),
					impuesto_porcentaje: `${impuestoPorcentaje}%`,
					importe_2: toFormatterCurrency(importe2),
					impuesto_cantidad: toFormatterCurrency(impuesto),
					cantidad_servicios: 1 / cirugia.pagos.length,
					total_moneda: toFormatterCurrency(total),
					total_doctor: toFormatterCurrency(pagoDermatologo),
					total_clinica: toFormatterCurrency(pagoClinica),
				}
				datos.push(dato);
			}

			cirugia.materiales.forEach(material => {
				let precioMaterial = Number(material.precio);
				while (totalPago !== 0 && precioMaterial !== 0) {

					let total = 0;
					if (totalPago > precioMaterial) {
						total = precioMaterial;
						totalPago -= precioMaterial;
						precioMaterial = 0;
					} else if (totalPago < precioMaterial) {
						total = totalPago;
						precioMaterial -= totalPago;
						totalPago = 0;
					} else {
						total = precioMaterial;
						precioMaterial = 0;
						totalPago = 0;
					}

					const impuestoPorcentaje = iva;
					const descuentoPorcentaje = 100 - (total * 100 / cirugia.total);
					const descuentoCantidad = (cirugia.total * descuentoPorcentaje / 100);
					const importe2 = total / (1 + (impuestoPorcentaje / 100));
					const impuesto = importe2 * (impuestoPorcentaje / 100);

					const dato = {
						...cirugia,
						servicio: { nombre: "MATERIAL" },
						producto: { nombre: material.nombre },
						metodo_pago_nombre: metodoPago.nombre,
						tipo_tarjeta: pago.tipo_tarjeta_nombre,
						banco_nombre: pago.banco_nombre,
						digitos: pago.digitos,
						importe_1: toFormatterCurrency(cirugia.total),
						area: "NO APLICA",
						descuento_porcentaje_clinica: "NO APLICA",
						descuento_cantidad_clinica: "NO APLICA",
						descuento_porcentaje_dermatologo: "NO APLICA",
						descuento_cantidad_dermatologo: "NO APLICA",
						descuento_porcentaje: `${descuentoPorcentaje}%`,
						descuento_cantidad: toFormatterCurrency(descuentoCantidad),
						impuesto_porcentaje: `${impuestoPorcentaje}%`,
						importe_2: toFormatterCurrency(importe2),
						impuesto_cantidad: toFormatterCurrency(impuesto),
						cantidad_servicios: 1,
						total_moneda: toFormatterCurrency(total),
						total_doctor: "NO APLICA",
						total_clinica: toFormatterCurrency(total),
					}
					datos.push(dato);
				}
			});

			cirugia.biopsias.forEach(biopsia => {
				let precioBiopsias = Number(cirugia.costo_biopsias);
				while (totalPago !== 0 && precioBiopsias !== 0) {

					let total = 0;
					if (totalPago > precioBiopsias) {
						total = precioBiopsias;
						totalPago -= precioBiopsias;
						precioBiopsias = 0;
					} else if (totalPago < precioBiopsias) {
						total = totalPago;
						precioBiopsias -= totalPago;
						totalPago = 0;
					} else {
						total = precioBiopsias;
						precioBiopsias = 0;
						totalPago = 0;
					}

					const impuestoPorcentaje = 0;
					const descuentoPorcentaje = 100 - (total * 100 / cirugia.total);
					const descuentoCantidad = (cirugia.total * descuentoPorcentaje / 100);
					const importe2 = total / (1 + (impuestoPorcentaje / 100));
					const impuesto = importe2 * (impuestoPorcentaje / 100);

					const dato = {
						...cirugia,
						servicio: { nombre: "BIOPSIA" },
						producto: { nombre: cirugia.patologo.nombre },
						metodo_pago_nombre: metodoPago.nombre,
						tipo_tarjeta: pago.tipo_tarjeta_nombre,
						banco_nombre: pago.banco_nombre,
						digitos: pago.digitos,
						importe_1: toFormatterCurrency(cirugia.total),
						area: "NO APLICA",
						descuento_porcentaje_clinica: "NO APLICA",
						descuento_cantidad_clinica: "NO APLICA",
						descuento_porcentaje_dermatologo: "NO APLICA",
						descuento_cantidad_dermatologo: "NO APLICA",
						descuento_porcentaje: `${descuentoPorcentaje}%`,
						descuento_cantidad: toFormatterCurrency(descuentoCantidad),
						impuesto_porcentaje: `${impuestoPorcentaje}%`,
						importe_2: toFormatterCurrency(importe2),
						impuesto_cantidad: toFormatterCurrency(impuesto),
						cantidad_servicios: 1 / cirugia.biopsias.length,
						total_moneda: toFormatterCurrency(total),
						total_doctor: "NO APLICA",
						total_clinica: "NO APLICA",
					}
					datos.push(dato);
				}
			});

		});
	}

	const procesarDermapen = (dermapen, datos) => {
		let totalAplicacion = Number(dermapen.total_aplicacion) + Number(dermapen.costo);
		dermapen.pagos.forEach(pago => {
			let totalPago = Number(pago.total);
			const metodoPago = metodosPago.find(metodoPago => {
				return metodoPago._id === pago.forma_pago;
			});
			if (pago.forma_pago === formaPagoTarjetaId) {
				const banco = bancos.find(banco => {
					return banco._id === pago.banco;
				});
				const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
					return tipoTarjeta._id === pago.tipo_tarjeta;
				});
				pago.banco_nombre = banco ? banco.nombre : 'ERROR';
				pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
				pago.digitos = pago.digitos;
			} else {
				pago.banco_nombre = 'NO APLICA';
				pago.tipo_tarjeta_nombre = 'NO APLICA';
				pago.digitos = 'NO APLICA';
			}

			while (totalPago !== 0 && totalAplicacion !== 0) {

				let total = 0;
				if (totalPago > totalAplicacion) {
					total = totalAplicacion;
					totalPago -= totalAplicacion;
					totalAplicacion = 0;
				} else if (totalPago < totalAplicacion) {
					total = totalPago;
					totalAplicacion -= totalPago;
					totalPago = 0;
				} else {
					total = totalAplicacion;
					totalAplicacion = 0;
					totalPago = 0;
				}

				const impuestoPorcentaje = dermapen.iva ? iva : 0;
				const importe2 = total / (1 + (impuestoPorcentaje / 100));
				const impuesto = importe2 * (impuestoPorcentaje / 100);
				const descuentoPorcentaje = 100 - (total * 100 / dermapen.total);
				const descuentoCantidad = (dermapen.total * descuentoPorcentaje / 100);
				const pagoDermatologo = total / dermapen.total * dermapen.pago_dermatologo;
				const pagoClinica = total - pagoDermatologo;
				const descuentoClinicaPorcentaje = dermapen.porcentaje_descuento_clinica ? dermapen.porcentaje_descuento_clinica : 0;
				const descuentoDermatologoPorcentaje = dermapen.descuento_dermatologo ? dermapen.descuento_dermatologo : 0;
				const descuentoClinica = descuentoClinicaPorcentaje * dermapen.total_aplicacion / 100;
				const descuentoDermatologo = descuentoDermatologoPorcentaje * (dermapen.total_aplicacion - descuentoClinica) / 100;

				const dato = {
					...dermapen,
					metodo_pago_nombre: metodoPago.nombre,
					tipo_tarjeta: pago.tipo_tarjeta_nombre,
					banco_nombre: pago.banco_nombre,
					digitos: pago.digitos,
					importe_1: toFormatterCurrency(dermapen.total),
					area: "NO APLICA",
					descuento_porcentaje_clinica: `${descuentoClinicaPorcentaje}%`,
					descuento_cantidad_clinica: toFormatterCurrency(descuentoClinica),
					descuento_porcentaje_dermatologo: `${descuentoDermatologoPorcentaje}%`,
					descuento_cantidad_dermatologo: toFormatterCurrency(descuentoDermatologo),
					descuento_porcentaje: `${descuentoPorcentaje}%`,
					descuento_cantidad: toFormatterCurrency(descuentoCantidad),
					impuesto_porcentaje: `${impuestoPorcentaje}%`,
					importe_2: toFormatterCurrency(importe2),
					impuesto_cantidad: toFormatterCurrency(impuesto),
					cantidad_servicios: 1 / dermapen.pagos.length,
					total_moneda: toFormatterCurrency(total),
					total_doctor: toFormatterCurrency(pagoDermatologo),
					total_clinica: toFormatterCurrency(pagoClinica),
				}
				datos.push(dato);
			}

			dermapen.materiales.forEach(material => {
				let precioMaterial = Number(material.precio);
				while (totalPago !== 0 && precioMaterial !== 0) {

					let total = 0;
					if (totalPago > precioMaterial) {
						total = precioMaterial;
						totalPago -= precioMaterial;
						precioMaterial = 0;
					} else if (totalPago < precioMaterial) {
						total = totalPago;
						precioMaterial -= totalPago;
						totalPago = 0;
					} else {
						total = precioMaterial;
						precioMaterial = 0;
						totalPago = 0;
					}

					const impuestoPorcentaje = iva;
					const descuentoPorcentaje = 100 - (total * 100 / dermapen.total);
					const descuentoCantidad = (dermapen.total * descuentoPorcentaje / 100);
					const importe2 = total / (1 + (impuestoPorcentaje / 100));
					const impuesto = importe2 * (impuestoPorcentaje / 100);

					const dato = {
						...dermapen,
						servicio: { nombre: "MATERIAL" },
						producto: { nombre: material.nombre },
						metodo_pago_nombre: metodoPago.nombre,
						tipo_tarjeta: pago.tipo_tarjeta_nombre,
						banco_nombre: pago.banco_nombre,
						digitos: pago.digitos,
						importe_1: toFormatterCurrency(dermapen.total),
						area: "NO APLICA",
						descuento_porcentaje_clinica: "NO APLICA",
						descuento_cantidad_clinica: "NO APLICA",
						descuento_porcentaje_dermatologo: "NO APLICA",
						descuento_cantidad_dermatologo: "NO APLICA",
						descuento_porcentaje: `${descuentoPorcentaje}%`,
						descuento_cantidad: toFormatterCurrency(descuentoCantidad),
						impuesto_porcentaje: `${impuestoPorcentaje}%`,
						importe_2: toFormatterCurrency(importe2),
						impuesto_cantidad: toFormatterCurrency(impuesto),
						cantidad_servicios: 1,
						total_moneda: toFormatterCurrency(total),
						total_doctor: "NO APLICA",
						total_clinica: toFormatterCurrency(total),
					}
					datos.push(dato);
				}
			});
		});
	}

	const procesarEstetica = (estetica, datos) => {
		let totalAplicacion = Number(estetica.total_aplicacion);
		estetica.pagos.forEach(pago => {
			let totalPago = Number(pago.total);
			const metodoPago = metodosPago.find(metodoPago => {
				return metodoPago._id === pago.forma_pago;
			});
			if (pago.forma_pago === formaPagoTarjetaId) {
				const banco = bancos.find(banco => {
					return banco._id === pago.banco;
				});
				const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
					return tipoTarjeta._id === pago.tipo_tarjeta;
				});
				pago.banco_nombre = banco ? banco.nombre : 'ERROR';
				pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
				pago.digitos = pago.digitos;
			} else {
				pago.banco_nombre = 'NO APLICA';
				pago.tipo_tarjeta_nombre = 'NO APLICA';
				pago.digitos = 'NO APLICA';
			}

			while (totalPago !== 0 && totalAplicacion !== 0) {

				let total = 0;
				if (totalPago > totalAplicacion) {
					total = totalAplicacion;
					totalPago -= totalAplicacion;
					totalAplicacion = 0;
				} else if (totalPago < totalAplicacion) {
					total = totalPago;
					totalAplicacion -= totalPago;
					totalPago = 0;
				} else {
					total = totalAplicacion;
					totalAplicacion = 0;
					totalPago = 0;
				}

				const impuestoPorcentaje = estetica.iva ? iva : 0;
				const importe2 = total / (1 + (impuestoPorcentaje / 100));
				const impuesto = importe2 * (impuestoPorcentaje / 100);
				const descuentoPorcentaje = 100 - (total * 100 / estetica.total);
				const descuentoCantidad = (estetica.total * descuentoPorcentaje / 100);
				const pagoDermatologo = total / estetica.total * estetica.pago_dermatologo;
				const pagoClinica = total - pagoDermatologo;
				const descuentoClinicaPorcentaje = estetica.porcentaje_descuento_clinica ? estetica.porcentaje_descuento_clinica : 0;
				const descuentoDermatologoPorcentaje = estetica.descuento_dermatologo ? estetica.descuento_dermatologo : 0;
				const descuentoClinica = descuentoClinicaPorcentaje * estetica.total_aplicacion / 100;
				const descuentoDermatologo = descuentoDermatologoPorcentaje * (estetica.total_aplicacion - descuentoClinica) / 100;

				const dato = {
					...estetica,
					metodo_pago_nombre: metodoPago.nombre,
					tipo_tarjeta: pago.tipo_tarjeta_nombre,
					banco_nombre: pago.banco_nombre,
					digitos: pago.digitos,
					importe_1: toFormatterCurrency(estetica.total),
					area: "NO APLICA",
					descuento_porcentaje_clinica: `${descuentoClinicaPorcentaje}%`,
					descuento_cantidad_clinica: toFormatterCurrency(descuentoClinica),
					descuento_porcentaje_dermatologo: `${descuentoDermatologoPorcentaje}%`,
					descuento_cantidad_dermatologo: toFormatterCurrency(descuentoDermatologo),
					descuento_porcentaje: `${descuentoPorcentaje}%`,
					descuento_cantidad: toFormatterCurrency(descuentoCantidad),
					impuesto_porcentaje: `${impuestoPorcentaje}%`,
					importe_2: toFormatterCurrency(importe2),
					impuesto_cantidad: toFormatterCurrency(impuesto),
					total_moneda: toFormatterCurrency(total),
					total_doctor: toFormatterCurrency(pagoDermatologo),
					total_clinica: toFormatterCurrency(pagoClinica),
				}
				datos.push(dato);
			}

			estetica.materiales.forEach(material => {
				let precioMaterial = Number(material.precio);
				while (totalPago !== 0 && precioMaterial !== 0) {

					let total = 0;
					if (totalPago > precioMaterial) {
						total = precioMaterial;
						totalPago -= precioMaterial;
						precioMaterial = 0;
					} else if (totalPago < precioMaterial) {
						total = totalPago;
						precioMaterial -= totalPago;
						totalPago = 0;
					} else {
						total = precioMaterial;
						precioMaterial = 0;
						totalPago = 0;
					}

					const impuestoPorcentaje = iva;
					const descuentoPorcentaje = 100 - (total * 100 / estetica.total);
					const descuentoCantidad = (estetica.total * descuentoPorcentaje / 100);
					const importe2 = total / (1 + (impuestoPorcentaje / 100));
					const impuesto = importe2 * (impuestoPorcentaje / 100);

					const dato = {
						...estetica,
						servicio: { nombre: "MATERIAL" },
						producto: { nombre: material.nombre },
						metodo_pago_nombre: metodoPago.nombre,
						tipo_tarjeta: pago.tipo_tarjeta_nombre,
						banco_nombre: pago.banco_nombre,
						digitos: pago.digitos,
						importe_1: toFormatterCurrency(estetica.total),
						area: "NO APLICA",
						descuento_porcentaje_clinica: "NO APLICA",
						descuento_cantidad_clinica: "NO APLICA",
						descuento_porcentaje_dermatologo: "NO APLICA",
						descuento_cantidad_dermatologo: "NO APLICA",
						descuento_porcentaje: `${descuentoPorcentaje}%`,
						descuento_cantidad: toFormatterCurrency(descuentoCantidad),
						impuesto_porcentaje: `${impuestoPorcentaje}%`,
						importe_2: toFormatterCurrency(importe2),
						impuesto_cantidad: toFormatterCurrency(impuesto),
						cantidad_servicios: 1,
						total_moneda: toFormatterCurrency(total),
						total_doctor: "NO APLICA",
						total_clinica: toFormatterCurrency(total),
					}
					datos.push(dato);
				}
			});

			estetica.toxinas_rellenos.forEach(toxina_relleno => {
				let totalToxinaRelleno = Number(toxina_relleno.precio) * Number(toxina_relleno.unidades);
				while (totalPago !== 0 && totalToxinaRelleno !== 0) {

					let total = 0;
					if (totalPago > totalToxinaRelleno) {
						total = totalToxinaRelleno;
						totalPago -= totalToxinaRelleno;
						totalToxinaRelleno = 0;
					} else if (totalPago < totalToxinaRelleno) {
						total = totalPago;
						totalToxinaRelleno -= totalPago;
						totalPago = 0;
					} else {
						total = totalToxinaRelleno;
						totalToxinaRelleno = 0;
						totalPago = 0;
					}

					const impuestoPorcentaje = toxina_relleno.iva ? iva : 0;
					const descuentoPorcentaje = 100 - (total * 100 / estetica.total);
					const descuentoCantidad = (estetica.total * descuentoPorcentaje / 100);
					const importe2 = total / (1 + (impuestoPorcentaje / 100));
					const impuesto = importe2 * (impuestoPorcentaje / 100);

					const dato = {
						...estetica,
						servicio: { nombre: "TOXINAS Y RELLENOS" },
						producto: { nombre: toxina_relleno.nombre },
						metodo_pago_nombre: metodoPago.nombre,
						tipo_tarjeta: pago.tipo_tarjeta_nombre,
						banco_nombre: pago.banco_nombre,
						digitos: pago.digitos,
						importe_1: toFormatterCurrency(estetica.total),
						area: "NO APLICA",
						descuento_porcentaje_clinica: "NO APLICA",
						descuento_cantidad_clinica: "NO APLICA",
						descuento_porcentaje_dermatologo: "NO APLICA",
						descuento_cantidad_dermatologo: "NO APLICA",
						descuento_porcentaje: `${descuentoPorcentaje}%`,
						descuento_cantidad: toFormatterCurrency(descuentoCantidad),
						impuesto_porcentaje: `${impuestoPorcentaje}%`,
						importe_2: toFormatterCurrency(importe2),
						impuesto_cantidad: toFormatterCurrency(impuesto),
						cantidad_servicios: toxina_relleno.unidades,
						total_moneda: toFormatterCurrency(total),
						total_doctor: "NO APLICA",
						total_clinica: toFormatterCurrency(total),
					}
					datos.push(dato);
				}
			});
		});
	}

	const procesarDatos = async () => {
		const datosCompletos = [...consultas, ...faciales, ...dermapens, ...cirugias, ...esteticas, ...aparatologias];
		const consultasProcesadas = [];
		const facialesProcesadas = [];
		const dermapensProcesadas = [];
		const cirugiasProcesadas = [];
		const esteticasProcesadas = [];
		const aparatologiasProcesadas = [];

		datosCompletos.forEach(async (item) => {
			const fecha = new Date(item.fecha_hora);

			item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
			item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
			item.precio_moneda = toFormatterCurrency(item.precio);
			item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
			item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
			item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			item.observaciones = item.observaciones ? item.observaciones : "*";

			if (item.factura) {
				const fechaFactura = new Date(item.factura.fecha_hora);
				item.requiere_factura = "SI";
				item.fecha_facturacion = `${addZero(fechaFactura.getDate())}/${addZero(fechaFactura.getMonth() + 1)}/${fechaFactura.getFullYear()}`;
				item.razon_social_nombre = item.factura.razon_social.nombre_completo;
				item.rfc = item.factura.razon_social.rfc;
				item.no_factura = item.factura.no_factura;
			} else {
				item.requiere_factura = "NO";
				item.razon_social_nombre = "NO APLICA";
				item.rfc = "NO APLICA";
				item.no_factura = "NO APLICA";
				item.fecha_facturacion = "NO APLICA";
			}

			switch (item.servicio._id) {
				case servicioAparatologiaId:
					procesarAparatologia(item, aparatologiasProcesadas);
					break;
				case servicioFacialId:
					procesarFacial(item, facialesProcesadas);
					break;
				case servicioConsultaId:
					procesarConsulta(item, consultasProcesadas);
					break;
				case servicioCirugiaId:
					procesarCirugia(item, cirugiasProcesadas);
					break;
				case servicioEsteticaId:
					procesarEstetica(item, esteticasProcesadas);
					break;
				case servicioDermapenId:
					procesarDermapen(item, dermapensProcesadas);
					break;
			}
		});
		facialesProcesadas.forEach(falcial => {
			const coincidencias = facialesProcesadas.filter(facialProcesada => {
				return falcial._id === facialProcesada._id && falcial.producto === facialProcesada.producto;
			});
			falcial.cantidad_servicios = 1 / coincidencias.length;
		});
		aparatologiasProcesadas.forEach(aparatologia => {
			const coincidencias = aparatologiasProcesadas.filter(aparatologiaProcesada => {
				return aparatologia._id === aparatologiaProcesada._id && aparatologia.producto === aparatologiaProcesada.producto;
			});
			aparatologia.cantidad_servicios = 1 / coincidencias.length;
		});
		consultasProcesadas.forEach(consulta => {
			const coincidencias = consultasProcesadas.filter(consultaProcesada => {
				return consulta._id === consultaProcesada._id && consulta.producto === consultaProcesada.producto;
			});
			consulta.cantidad_servicios = 1 / coincidencias.length;
		});
		dermapensProcesadas.forEach(dermapen => {
			const coincidencias = dermapensProcesadas.filter(dermapenProcesada => {
				return dermapen._id === dermapenProcesada._id && dermapen.producto === dermapenProcesada.producto;
			});
			dermapen.cantidad_servicios = 1 / coincidencias.length;
		});
		cirugiasProcesadas.forEach(cirugia => {
			const coincidencias = cirugiasProcesadas.filter(cirugiaProcesada => {
				return cirugia._id === cirugiaProcesada._id && cirugia.producto === cirugiaProcesada.producto;
			});
			cirugia.cantidad_servicios = 1 / coincidencias.length;
		});
		esteticasProcesadas.forEach(estetica => {
			const coincidencias = esteticasProcesadas.filter(esteticaProcesada => {
				return estetica._id === esteticaProcesada._id && estetica.producto === esteticaProcesada.producto;
			});
			estetica.cantidad_servicios = 1 / coincidencias.length;
		});
		const datos = [...consultasProcesadas, ...facialesProcesadas, ...dermapensProcesadas, ...cirugiasProcesadas, ...esteticasProcesadas, ...aparatologiasProcesadas];
		datos.sort((a, b) => {
			if (a.consecutivo > b.consecutivo) return 1;
			if (a.consecutivo < b.consecutivo) return -1;
			return 0;
		});
		setDatos(datos);
		setIsLoading(false);
	}

	const loadConsultas = async (startDate, endDate) => {
		const response = await findConsultsByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setConsultas(response.data);
			procesarDatos();
		}
	}

	const loadFaciales = async (startDate, endDate) => {
		const response = await findFacialByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFaciales(response.data);
			await loadConsultas(startDate, endDate);
		}
	}

	const loadAparatologias = async (startDate, endDate) => {
		const response = await findAparatologiaByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setAparatologias(response.data);
			await loadFaciales(startDate, endDate);
		}
	}

	const loadEsteticas = async (startDate, endDate) => {
		const response = await findEsteticasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setEsteticas(response.data);
			await loadAparatologias(startDate, endDate);
		}
	}

	const loadCirugias = async (startDate, endDate) => {
		const response = await findCirugiasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCirugias(response.data);
			await loadEsteticas(startDate, endDate);
		}
	}

	const loadDermapens = async (startDate, endDate) => {
		const response = await findDermapenByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setDermapens(response.data);
			await loadCirugias(startDate, endDate);
		}
	}

	const handleChangeStartDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setStartDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		setIsLoading(false);
	};

	const handleChangeEndDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setEndDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});

		setIsLoading(false);
	};

	const loadMetodosPago = async () => {
		const response = await showAllMetodoPago();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setMetodosPago(response.data);
		}
	}

	const loadTipoTarjeta = async () => {
		const response = await showAllTipoTarjeta();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTiposTarjeta(response.data);
		}
	}

	const loadBancos = async () => {
		const response = await showAllBanco();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setBancos(response.data);
		}
	}

	const loadInfo = async (startDate, endDate) => {
		setIsLoading(true);
		await loadMetodosPago();
		await loadTipoTarjeta();
		await loadBancos();
		await loadDermapens(startDate, endDate);
	}

	const handleReportes = async () => {
		await loadInfo(startDate.fecha_show, endDate.fecha_show);
	}

	const actions = [
	];

	useEffect(() => {
		loadInfo(startDate.fecha_show, endDate.fecha_show);
	}, [startDate, endDate]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesDetalleGeneralContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES DETALLES GENERAL(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						datos={datos}
						actions={actions}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesDetallesGeneral;