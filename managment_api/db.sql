-- Crear la tabla 'Empleado' si no existe
CREATE TABLE IF NOT EXISTS public.Empleado (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    documento_identidad VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL -- Área de trabajo del empleado (sistemas, mercadeo, producción, etc.)
);

-- Crear la tabla 'ProveedorInvitado' si no existe
CREATE TABLE IF NOT EXISTS public.ProveedorInvitado (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    documento_identidad VARCHAR(50) NOT NULL
);

-- Crear el tipo ENUM para 'tipo_persona' si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_persona_enum') THEN 
        CREATE TYPE tipo_persona_enum AS ENUM ('Empleado', 'ProveedorInvitado'); 
    END IF; 
END $$;

-- Crear el tipo ENUM para 'motivo_retiro' si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motivo_retiro_enum') THEN 
        CREATE TYPE motivo_retiro_enum AS ENUM ('Cita médica', 'Calamidad', 'Diligencia personal', 'Otro'); 
    END IF; 
END $$;

-- Crear la tabla 'RegistroEntradaSalida' si no existe
CREATE TABLE IF NOT EXISTS public.RegistroEntradaSalida (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    persona_id BIGINT NOT NULL,
    tipo_persona tipo_persona_enum NOT NULL,
    hora_ingreso TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_salida TIMESTAMP WITH TIME ZONE,
    motivo_retiro motivo_retiro_enum, -- Solo se usa si tipo_persona es 'Empleado'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_persona 
    FOREIGN KEY (persona_id, tipo_persona) 
    REFERENCES (CASE tipo_persona 
                 WHEN 'Empleado' THEN public.Empleado(id)
                 WHEN 'ProveedorInvitado' THEN public.ProveedorInvitado(id)
               END)
);


CREATE VIEW public.ReporteHorasEmpleado AS
SELECT
    e.id AS empleado_id,
    e.nombre AS nombre_empleado,
    DATE(r.hora_ingreso) AS fecha,
    SUM(EXTRACT(EPOCH FROM (r.hora_salida - r.hora_ingreso)) / 3600) AS horas_trabajadas,
    CASE 
        WHEN SUM(EXTRACT(EPOCH FROM (r.hora_salida - r.hora_ingreso)) / 3600) > 8 
        THEN SUM(EXTRACT(EPOCH FROM (r.hora_salida - r.hora_ingreso)) / 3600) - 8 
        ELSE 0 
    END AS horas_extra
FROM
    public.RegistroEntradaSalida r
    JOIN public.Empleado e ON r.persona_id = e.id
WHERE
    r.tipo_persona = 'Empleado'
GROUP BY
    e.id, e.nombre, DATE(r.hora_ingreso);


CREATE VIEW public.ReporteHorasArea AS
SELECT
    e.area AS area_trabajo,
    DATE(r.hora_ingreso) AS fecha,
    SUM(EXTRACT(EPOCH FROM (r.hora_salida - r.hora_ingreso)) / 3600) AS horas_trabajadas
FROM
    public.RegistroEntradaSalida r
    JOIN public.Empleado e ON r.persona_id = e.id
WHERE
    r.tipo_persona = 'Empleado'
GROUP BY
    e.area, DATE(r.hora_ingreso);


CREATE VIEW public.PersonasEnEdificio AS
SELECT
    r.persona_id,
    CASE r.tipo_persona
        WHEN 'Empleado' THEN e.nombre
        WHEN 'ProveedorInvitado' THEN p.nombre
    END AS nombre_persona,
    r.tipo_persona,
    r.hora_ingreso
FROM
    public.RegistroEntradaSalida r
    LEFT JOIN public.Empleado e ON r.persona_id = e.id
    LEFT JOIN public.ProveedorInvitado p ON r.persona_id = p.id
WHERE
    r.hora_salida IS NULL;
