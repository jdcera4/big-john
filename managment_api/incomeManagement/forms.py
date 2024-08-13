from django import forms
from .models import ProveedorInvitado

class ProveedorInvitadoForm(forms.ModelForm):
    class Meta:
        model = ProveedorInvitado
        fields = ['nombre', 'documento_identidad']
