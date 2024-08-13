from django.urls import path
from . import views

urlpatterns = [
    path('registrar_entrada_salida/', views.registrar_entrada_salida, name='registrar_entrada_salida'),
    path('crear_proveedor_invitado/', views.crear_proveedor_invitado, name='crear_proveedor_invitado'),
    path('modificar_proveedor_invitado/<int:pk>/', views.modificar_proveedor_invitado, name='modificar_proveedor_invitado'),
    path('eliminar_proveedor_invitado/<int:pk>/', views.eliminar_proveedor_invitado, name='eliminar_proveedor_invitado'),
    path('reportar_horas_empleado/<int:pk>/<str:periodo>/', views.reportar_horas_empleado, name='reportarhorasempleado'),
    path('reportar_horas_area/<str:area>/<str:periodo>/', views.reportar_horas_area, name='reportar_horas_area'),
    path('reporte_personas_dentro/', views.reporte_personas_dentro, name='reporte_personas_dentro'),
]
