from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from django.shortcuts import render
from django.db import connection
import json

def query(sql, params=None):
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.fetchall()

@csrf_exempt
def obtener_empleados(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT id, nombre, documento_identidad FROM public.Empleado")
        rows = cursor.fetchall()

    empleados = [{'id': row[0], 'nombre': row[1], 'documento_identidad': row[2]} for row in rows]
    return JsonResponse(empleados, safe=False)

@csrf_exempt
def obtener_proveedor_invitado(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT id, nombre, documento_identidad, tipo_persona FROM public.proveedorinvitado")
        rows = cursor.fetchall()

    empleados = [{'id': row[0], 'nombre': row[1], 'documento_identidad': row[2], 'tipo_persona': row[3]} for row in rows]
    return JsonResponse(empleados, safe=False)

@csrf_exempt
def registrar_entrada_salida(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            persona_id = data.get('persona_id')
            tipo_persona = data.get('tipo_persona')
            hora_ingreso = data.get('hora_ingreso')
            hora_salida = data.get('hora_salida', None)
            motivo_retiro = data.get('motivo_retiro', None)

            if not persona_id or not tipo_persona or not hora_ingreso:
                return HttpResponseBadRequest("Faltan datos necesarios.")

            try:
                hora_ingreso = parse_datetime(hora_ingreso)
                if hora_salida:
                    hora_salida = parse_datetime(hora_salida)
            except ValueError:
                return HttpResponseBadRequest("Formato de fecha inválido.")

            if tipo_persona not in ['Empleado', 'ProveedorInvitado']:
                return HttpResponseBadRequest("Tipo de persona inválido.")

            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id FROM registroentradasalida
                    WHERE persona_id = %s AND tipo_persona = %s AND hora_salida IS NULL
                """, [persona_id, tipo_persona])
                existing_record = cursor.fetchone()

                if existing_record:
                    cursor.execute("""
                        UPDATE registroentradasalida
                        SET hora_salida = %s, motivo_retiro = %s
                        WHERE id = %s
                    """, [hora_salida, motivo_retiro, existing_record[0]])
                else:
                    cursor.execute("""
                        INSERT INTO registroentradasalida (persona_id, tipo_persona, hora_ingreso, hora_salida, motivo_retiro)
                        VALUES (%s, %s, %s, %s, %s)
                    """, [persona_id, tipo_persona, hora_ingreso, hora_salida, motivo_retiro])

            return JsonResponse({'status': 'success'})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Formato JSON inválido.")
    
    return HttpResponseBadRequest("Método no permitido.")

@csrf_exempt
def crear_proveedor_invitado(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nombre = data.get('nombre')
            documento_identidad = data.get('documento_identidad')
            tipo_persona = data.get('tipo_persona')

            if not nombre or not documento_identidad:
                return HttpResponseBadRequest("Faltan datos necesarios.")

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO proveedorinvitado (nombre, documento_identidad, tipo_persona)
                    VALUES (%s, %s, %s)
                """, [nombre, documento_identidad, tipo_persona])

            return JsonResponse({'status': 'success'})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Formato de JSON inválido.")
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {str(e)}")

    return HttpResponseBadRequest("Método no permitido.")

@csrf_exempt
def modificar_proveedor_invitado(request, pk):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nombre = data.get('nombre')
            documento_identidad = data.get('documento_identidad')
            tipo_persona = data.get('tipo_persona')

            if not nombre or not documento_identidad:
                return HttpResponseBadRequest("Faltan datos necesarios.")

            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id FROM proveedorinvitado WHERE id = %s
                """, [pk])
                if not cursor.fetchone():
                    return HttpResponseBadRequest("Proveedor o invitado no encontrado.")

                cursor.execute("""
                    UPDATE proveedorinvitado
                    SET nombre = %s, documento_identidad = %s, tipo_persona = %s
                    WHERE id = %s
                """, [nombre, documento_identidad, tipo_persona, pk])

            return JsonResponse({'status': 'success'})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Formato de JSON inválido.")
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {str(e)}")

    return HttpResponseBadRequest("Método no permitido.")

@csrf_exempt
def eliminar_proveedor_invitado(request, pk):
    if request.method == 'POST':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id FROM proveedorinvitado WHERE id = %s
                """, [pk])
                if not cursor.fetchone():
                    return HttpResponseBadRequest("Proveedor o invitado no encontrado.")
                cursor.execute("""
                    DELETE FROM proveedorinvitado WHERE id = %s
                """, [pk])

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {str(e)}")

    return HttpResponseBadRequest("Método no permitido.")

@csrf_exempt
def reportar_horas_empleado(request, pk, periodo):
    if request.method == 'GET':
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        if not start_date or not end_date:
            return HttpResponseBadRequest("Parámetros 'start_date' y 'end_date' son necesarios.")

        query = """
            SELECT fecha, nombre_empleado, horas_trabajadas, horas_extra
            FROM public.ReporteHorasEmpleado
            WHERE empleado_id = %s AND fecha BETWEEN %s AND %s;
        """

        try:
            with connection.cursor() as cursor:
                cursor.execute(query, [pk, start_date, end_date])
                rows = cursor.fetchall()
                
                result = []
                for row in rows:
                    result.append({
                        'fecha': row[0],
                        'nombre_empleado': row[1],
                        'horas_trabajadas': row[2],
                        'horas_extra': row[3],
                    })
                
                return JsonResponse(result, safe=False)
        except Exception as e:
            print(f"Error: {e}")
            return HttpResponseBadRequest("Error en la consulta.")

    return HttpResponseBadRequest("Método no permitido.")


def reportar_horas_area(request, area, periodo):
    if request.method == 'GET':
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        if not start_date or not end_date:
            return HttpResponseBadRequest("Parámetros 'start_date' y 'end_date' son necesarios.")

        query = """
            SELECT fecha, area_trabajo AS area, horas_trabajadas
            FROM public.ReporteHorasArea
            WHERE area_trabajo = %s AND fecha BETWEEN %s AND %s;
        """

        try:
            with connection.cursor() as cursor:
                cursor.execute(query, [area, start_date, end_date])
                rows = cursor.fetchall()
                
                reportes = [{'fecha': row[0], 'area': row[1], 'horas_trabajadas': row[2]} for row in rows]
                
                return JsonResponse(reportes, safe=False)
        except Exception as e:
            print(f"Error: {e}")
            return HttpResponseBadRequest("Error en la consulta.")
    
    return HttpResponseBadRequest("Método no permitido.")

def reporte_personas_dentro(request):
    if request.method == 'GET':
        query = """
            SELECT tipo_persona, persona_id, nombre_persona
            FROM public.PersonasEnEdificio;
        """
        
        try:
            with connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
                personas_dentro = [{'tipo_persona': row[0], 'persona_id': row[1], 'nombre': row[2]} for row in rows]
                
                return JsonResponse(personas_dentro, safe=False)
        except Exception as e:
            print(f"Error: {e}")
            return HttpResponseBadRequest("Error en la consulta.")
    
    return HttpResponseBadRequest("Método no permitido.")

def obtener_fechas_periodo(periodo):
    from datetime import datetime, timedelta
    
    today = datetime.now()
    if periodo == 'dia':
        start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = today.replace(hour=23, minute=59, second=59, microsecond=999999)
    elif periodo == 'semana':
        start_date = today - timedelta(days=today.weekday())
        end_date = start_date + timedelta(days=6, hours=23, minutes=59, seconds=59)
    elif periodo == 'mes':
        start_date = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(microseconds=1)
    else:
        raise ValueError("Periodo inválido")
    
    return start_date, end_date
