from django.db import models

class Empleado(models.Model):
    nombre = models.CharField(max_length=255)
    documento_identidad = models.CharField(max_length=50, unique=True)
    area = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class ProveedorInvitado(models.Model):
    nombre = models.CharField(max_length=255)
    documento_identidad = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

class RegistroEntradaSalida(models.Model):
    TIPO_PERSONA_CHOICES = [
        ('Empleado', 'Empleado'),
        ('ProveedorInvitado', 'ProveedorInvitado'),
    ]

    MOTIVO_RETIRO_CHOICES = [
        ('Cita médica', 'Cita médica'),
        ('Calamidad', 'Calamidad'),
        ('Diligencia personal', 'Diligencia personal'),
        ('Otro', 'Otro'),
    ]

    persona_id = models.BigIntegerField()
    tipo_persona = models.CharField(max_length=20, choices=TIPO_PERSONA_CHOICES)
    hora_ingreso = models.DateTimeField()
    hora_salida = models.DateTimeField(null=True, blank=True)
    motivo_retiro = models.CharField(max_length=20, choices=MOTIVO_RETIRO_CHOICES, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_persona}: {self.persona_id}"
