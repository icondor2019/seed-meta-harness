# MHSDD-4: aceptación interactiva corregida

## Objetivo

Probar el ciclo completo desde OpenCode con contexto mínimo del Orchestrator,
aprobaciones exclusivamente textuales, corrección, commit local, memoria y archivo.
Leer MHSDD-4 y sus comentarios, [contrato](../../../docs/workflow.md) e
[interfaz](../../../docs/sdd-plugin.md). El protocolo corregido sustituye el anterior.

Rama: codex/mhsdd-4-plugin-determinista-workflow-sdd. Conservar cambios existentes
y commits de prueba. Nunca git add ., push, merge ni reversión automática.
Spec actual: mhsdd-4-acceptance. No crear otro encima ni sobrescribir sus artifacts.
El primer intento falló: conservar su evidencia y registrar la repetición aparte.

## Ejercicio

Fixture sin dependencias en tests/fixtures/sdd-demo/: stateLabel(state), con pruebas
node:test para exploring, implementing, archived y entrada no soportada.
Etiquetas iniciales: Explorando, Implementando, Archivado. En el rechazo final el
usuario pide Cerrado. Builder decide y aplica los cambios leyendo tasks/design;
Orchestrator nunca copia checklist ni implementación exacta a su prompt.

Archivos autorizados del ejemplo: tests/fixtures/sdd-demo/ y tests/capabilities/.
Correcciones del plugin deben delimitar su propio manifiesto. Preservar trabajo ajeno.

## Procedimiento

1. Registrar OpenCode/Node, rama, HEAD y archivos/versiones del plugin. No hashes
   de contenido. Probar /sdd-status: una línea, sin modelo ni transición.
2. En un ciclo nuevo, create → Explorer → planning → Planner. En el intento existente,
   consultar estado y reanudar al dueño. Los agentes leen sus artifacts en cada entrada,
   incluso tras interrupción. Orchestrator recibe solo informes breves y rutas.
3. Verificar que Builder está bloqueado antes de aprobación. Presentar resumen del
   Planner y enlaces; request_approval y esperar aprobación textual del usuario.
   Ningún comando humano, token, diálogo o terminal adicional.
4. Builder implementa desde artifacts y registra evidencia. Ejecutar:

   ```powershell
   node --test tests/fixtures/sdd-demo/state-label.test.mjs
   node --experimental-strip-types --test tests/sdd/*.test.mjs
   ```

5. ready_for_review → reviewing. Reviewer lee plan y cambios, escribe review.md y
   registra verdict. Pass conduce a changes_pending_approval, nunca a Archivist.
6. Presentar informe breve del Reviewer y solicitar aprobación final textual.
   El usuario rechaza y pide Cerrado. Verificar implementing, corrección, pruebas,
   nueva revisión y nueva aprobación explícita. Replan si cambia el alcance aprobado.
7. Solo tras aceptación de implementación, Archivist propone conocimiento en memory.md
   y registra prepare_closure. Sin aprendizajes: not-needed con razón. Con contenido
   permanente: presentarlo y esperar aprobación textual antes de publicar OKF/Engram.
   Preparar documentación aprobada y registrar closure.
8. Commit mediante controlador, con manifiesto explícito. Registrar SHA, exclusión
   de specs del índice, conservación local y preservación de archivos ajenos.
9. Archivist persiste solo aprendizajes aprobados después del commit; registrar IDs
   reales y verificar recuperación. Si no son necesarios, registrar razón verificable.
10. Archive: comprobar movimiento íntegro, estado archived y ausencia del origen.
11. Completar informe final. Las actualizaciones posteriores al commit quedan
    pendientes de commit documental; no atribuirlas al SHA anterior.

## Aceptación

- Agentes reales, artifacts persistidos y recuperación sin Orchestrator leyendo todo.
- Aprobaciones textuales efectivas; rechazo, corrección y nueva revisión observados.
- Archivist y persistencia bloqueados antes de aprobación humana.
- Pruebas satisfactorias, commit identificado, cambios ajenos conservados.
- Memoria verificable o not-needed justificado; archivado íntegro.
- Estado nativo inmediato, sin turno del modelo; interrupciones sin errores de hash.
- Informe con resultados, defectos y limitaciones reales.

Una ejecución bloqueada o parcial no acepta MHSDD-4. Detenerse en gates humanos y
bloqueos reales; nunca fabricar recibos, editar metadatos ni aprobar por el usuario.
Registrar cada repetición por separado y repetir las partes afectadas por defectos.
