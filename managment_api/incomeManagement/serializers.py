from rest_framework import serializers
from .models import Empleado, ProveedorInvitado, RegistroEntradaSalida

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'

class ProveedorInvitadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProveedorInvitado
        fields = '__all__'

class RegistroEntradaSalidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroEntradaSalida
        fields = '__all__'
