-- Crear la tabla 'Area' si no existe
CREATE TABLE IF NOT EXISTS public.Area (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL UNIQUE -- Nombre del área
);

-- Crear la tabla 'Empleado' si no existe
CREATE TABLE IF NOT EXISTS public.Empleado (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    documento_identidad VARCHAR(50) NOT NULL,
    area_id BIGINT NOT NULL, -- Relacionada con la tabla 'Area'
    CONSTRAINT fk_area
    FOREIGN KEY (area_id) REFERENCES public.Area(id)
);

-- Crear la tabla 'ProveedorInvitado' si no existe
DO $$ BEGIN
    CREATE TYPE tipo_persona_enum AS ENUM ('Empleado', 'Proveedor', 'Invitado');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

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
    empleado_id BIGINT,
    proveedorinvitado_id BIGINT,
    CONSTRAINT fk_empleado 
    FOREIGN KEY (empleado_id) REFERENCES public.Empleado(id),
    CONSTRAINT fk_proveedorinvitado 
    FOREIGN KEY (proveedorinvitado_id) REFERENCES public.ProveedorInvitado(id),
    CHECK (
        (tipo_persona = 'Empleado' AND empleado_id IS NOT NULL AND proveedorinvitado_id IS NULL)
        OR (tipo_persona = 'ProveedorInvitado' AND proveedorinvitado_id IS NOT NULL AND empleado_id IS NULL)
    )
);

-- Insertar los valores en la tabla 'Area'
INSERT INTO public.Area (nombre) VALUES
('Recursos Humanos'),
('Tecnología'),
('Finanzas'),
('Marketing'),
('Ventas'),
('Administración'),
('Atención al Cliente'),
('Legal'),
('Operaciones'),
('Compras'),
('Producción'),
('Investigación y Desarrollo'),
('Calidad'),
('Logística'),
('Desarrollo de Negocios');

-- Insertar datos de ejemplo en la tabla 'Empleado'
INSERT INTO Empleado (nombre, area_id, documento_identidad)
VALUES
('Ana González', 1, '12345678'),
('Luis Pérez', 2, '23456789'),
('Marta Fernández', 3, '34567890'),
('Carlos Rodríguez', 4, '45678901'),
('Elena Martínez', 5, '56789012'),
('Pedro López', 6, '67890123'),
('Isabel Romero', 7, '78901234'),
('Jorge Díaz', 8, '89012345'),
('Laura Morales', 9, '90123456'),
('Francisco Jiménez', 10, '01234567'),
('Verónica Gómez', 11, '12345679'),
('David Sánchez', 12, '23456780'),
('Sofía Ruiz', 13, '34567891'),
('Raúl Castillo', 14, '45678902'),
('Claudia Vargas', 15, '56789013'),
('Antonio Ortega', 1, '67890124'),
('Carmen Morales', 2, '78901235'),
('José Martínez', 3, '89012346'),
('Patricia López', 4, '90123457'),
('Ricardo Fernández', 5, '01234568'),
('María González', 6, '12345680');

-- Crear las vistas de reporte, usando las relaciones actualizadas

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
    JOIN public.Empleado e ON r.empleado_id = e.id
WHERE
    r.tipo_persona = 'Empleado'
GROUP BY
    e.id, e.nombre, DATE(r.hora_ingreso);

CREATE VIEW public.ReporteHorasArea AS
SELECT
    a.nombre AS area_trabajo,
    DATE(r.hora_ingreso) AS fecha,
    SUM(EXTRACT(EPOCH FROM (r.hora_salida - r.hora_ingreso)) / 3600) AS horas_trabajadas
FROM
    public.RegistroEntradaSalida r
    JOIN public.Empleado e ON r.empleado_id = e.id
    JOIN public.Area a ON e.area_id = a.id
WHERE
    r.tipo_persona = 'Empleado'
GROUP BY
    a.nombre, DATE(r.hora_ingreso);

CREATE VIEW public.PersonasEnEdificio AS
SELECT
    r.persona_id,
    CASE r.tipo_persona
        WHEN 'Empleado' THEN e.nombre
        WHEN 'ProveedorInvitado' THEN p.nombre
    END AS nombre_persona,
    r.tipo_persona,
    r.hora_ingreso,
    CASE r.tipo_persona
        WHEN 'Empleado' THEN a.nombre
        WHEN 'ProveedorInvitado' THEN NULL
    END AS area
FROM
    public.RegistroEntradaSalida r
    LEFT JOIN public.Empleado e ON r.empleado_id = e.id
    LEFT JOIN public.Area a ON e.area_id = a.id
    LEFT JOIN public.ProveedorInvitado p ON r.proveedorinvitado_id = p.id
WHERE
    r.hora_salida IS NULL;
