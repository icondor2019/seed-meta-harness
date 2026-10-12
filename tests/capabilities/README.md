# Catálogo de pruebas de capacidades

Este catálogo documenta escenarios repetibles y evidencia observada del meta-harness.
Las pruebas automáticas del controlador permanecen en `../sdd/`.

| Capacidad | Estado | Escenario | Ejecución |
| --- | --- | --- | --- |
| Ciclo SDD anterior (v2) | comprobada (repetición corregida completada 2026-10-11; commit documental pendiente) | [Procedimiento](sdd-lifecycle/scenario.md) | [Intento original](sdd-lifecycle/runs/2026-10-11-mhsdd-4-acceptance.md), [repetición corregida](sdd-lifecycle/runs/2026-10-11-mhsdd-4-acceptance-repeat-1.md) |

| Ciclo SDD simplificado (v3) | comprobada parcialmente (22 pruebas automáticas; nueva aceptación dispensada por el usuario para esta entrega) | [Procedimiento](sdd-lifecycle/scenario.md) | Sin ejecución nueva |

Estados: pendiente, comprobada parcialmente, comprobada, fallida. Un procedimiento
escrito o una ejecución bloqueada no acreditan una capacidad comprobada.
Cada ejecución debe registrar entorno, revisión y archivos/versiones del código probado,
acciones, resultados reales, evidencias, limitaciones y defectos encontrados.
Los informes no sustituyen los artifacts temporales de `specs/open/` ni la memoria
operativa de Engram. Mantener cada Markdown en un máximo de 400 líneas.

Conservar escenarios e informes en Git. Conservar commits de prueba como evidencia;
no hacer push, merge ni revertir automáticamente. Cualquier limpieza se decide
explícitamente después de registrar el resultado.
