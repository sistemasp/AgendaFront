import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// PACIENTES

export const getAllPatients = async() => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllPatients', error);
    }
}

export const findPatientByPhoneNumber = async(telefono) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/phonenumber/${telefono}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPatientByPhoneNumber', error);
    }
}

export const updatePatient = async(pacienteId, paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/${pacienteId}`,
            method: 'PUT',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('updatePatient', error);
    }
}

export const createPatient = async(paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'POST',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('createPatient', error);
    }
}

// SERVICIOS

export const getAllServices = async() => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllServices', error);
    }
}

// TRATAMIENTOS

export const getAllTreatments = async() => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getTreatments', error);
    }
}

export const findTreatmentByServicio = async(servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento/servicio/${servicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTreatmentByServicio', error);
    }
}
// HORARIO

export const getAllSchedules = async() => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllSchedules', error);
    }
}

export const findScheduleByDate = async(dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDate', error);
    }
}

export const findScheduleByDateAndSucursalAndService = async(dia, mes, anio, sucursalId, servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}/${sucursalId}/${servicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDateAndSucursalAndService', error);
    }
}

// CITAS

export const getAllDates = async() => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDates', error);
    }
}

export const getAllDatesBySucursal = async(sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDatesBySucursal', error);
    }
}

export const showAllDatesBySucursalAsistio = async(sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDatesBySucursalAsistio', error);
    }
}

export const findDatesByDate = async(dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDate', error);
    }
}

export const findDatesByDateAndSucursal = async(dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursal = async(diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursal', error);
    }
}

export const findHistoricByPaciente = async(pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/histotic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPaciente', error);
    }
}

export const createDate = async(cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'POST',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('createDate', error);
    }
}

export const updateDate = async(dateId, cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dateId}`,
            method: 'PUT',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('updateDate', error);
    }
}

// RECEPCIONISTAS

export const findRecepcionistByEmployeeNumber = async(employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/recepcionista/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecepcionistByEmployeeNumber', error);
    }
}

// EMPLEADOS

export const findEmployeeByEmployeeNumber = async(employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeeByEmployeeNumber', error);
    }
}

export const loginEmployee = async(employeeNumber, password) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/login/${employeeNumber}/${password}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('loginEmployee', error);
    }
}

export const findEmployeesByRolId = async(rolId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/rol/${rolId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeesByRolId', error);
    }
}

export const updateEmployee = async(employeeId, employee) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/${employeeId}`,
            method: 'PUT',
            data: employee
        });
        return response;
    } catch (error) {
        console.log('updateEmployee', error);
    }
}

// SUCURSALES

export const showAllOffices = async() => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllOffices', error);
    }
}

// CONSULTORIOS

export const findSurgeryBySucursalId = async(sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalId', error);
    }
}

export const createSurgery = async(consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSurgery', error);
    }
}