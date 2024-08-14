const BASE_URL = 'http://localhost:8000';

async function fetchData(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
}

// Obtener empleados
export async function getEmpleados() {
    return fetchData('/obtener_empleados');
}

// Obtener proveedores o invitados
export async function getProveedorInvitado() {
    return fetchData('/obtener_proveedor_invitado');
}

//Crear proveedor o invitado
export async function createProveedorInvitado(data: {
    nombre: string;
    documento_identidad: string;
    tipo_persona: string;
}){
    return fetchData('/crear_proveedor_invitado/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

//Actualizar Proveedor o invitado
export async function updatedProveedorInvitado(data: {
    nombre: string;
    documento_identidad: string;
    tipo_persona: string;
}, id: number){
    return fetchData(`/modificar_proveedor_invitado/${id}/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function deleteProveedorInvitado (id: number){
    return fetchData(`/eliminar_proveedor_invitado/${id}/`, {
        method: 'POST'
    });
}

// Obtener reporte de horas de un empleado
export async function getReporteHorasEmpleado(id: number, periodo: string, startDate: string, endDate: string) {
    return fetchData(`/reportar_horas_empleado/${id}/${periodo}/?start_date=${startDate}&end_date=${endDate}`);
}

// Obtener reporte de horas por área
export async function getReporteHorasArea(area: string, startDate: string, endDate: string) {
    return fetchData(`/reportar_horas_area/${area}/?start_date=${startDate}&end_date=${endDate}`);
}

// Obtener personas en el edificio
export async function getPersonasEnEdificio() {
    return fetchData('/personas_en_edificio');
}

// Registrar entrada o salida
export async function registrarEntradaSalida(data: {
    persona_id: number;
    tipo_persona: string;
    hora_ingreso: string;
    hora_salida?: string;
    motivo_retiro?: string;
}) {
    return fetchData('/registrar_entrada_salida', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Obtener listado de áreas
export async function getAreas() {
    return fetchData('/areas');
}
