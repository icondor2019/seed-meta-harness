# MHSDD-4: registro de la repetición corregida (aceptación interactiva)

Estado: **repetición completada** (2026-10-11, America/Bogota). El primer intento fallido
se conserva en [2026-10-11-mhsdd-4-acceptance.md](2026-10-11-mhsdd-4-acceptance.md)
sin sobrescribir. Procedimiento: [../scenario.md](../scenario.md).
Las correcciones del flujo están documentadas en [../../../../docs/sdd-validation.md](../../../../docs/sdd-validation.md);
la corrección del plugin se describe en [../../../../docs/sdd-plugin.md](../../../../docs/sdd-plugin.md).

## Entorno e identidad del código

| Dato | Valor observado |
| --- | --- |
| Inicio y fin de ejecución | Inicio: 2026-10-11 (reanudación desde rev. 18 v2); fin: 2026-10-11 (archiving rev. 31) |
| Versión OpenCode / Node | OpenCode 1.19.0 (npm -g) / Node v24.14.1 |
| Rama | codex/mhsdd-4-plugin-determinista-workflow-sdd (verificada) |
| HEAD antes del commit de prueba | b7f9b49a840a1045acd7a39c8c4eaaac8b5ff203 |
| Cambios locales y staging previos | 11 modificados sin stage (.gitignore, 7 agentes, AGENTS.md, README.md, docs/workflow.md) y no rastreados (.opencode/commands/, .opencode/plugins/, .opencode/sdd/, docs/sdd-plugin.md, docs/sdd-validation.md, tests/); staging vacío; sin stashes |
| Archivos del plugin corregidos | `.opencode/plugins/sdd.ts`, `.opencode/sdd/{controller.mjs,io.mjs,user-decision.mjs}` (con `approve.mjs` eliminado), `.opencode/tui/sdd-status.ts`, `.opencode/commands/{sdd-new.md,sdd-validate.md}` |
| Migración de state.json | v1 → v2; respaldo `state.v1.backup.json` conserva los metadatos originales; receipt del rechazo v1 conservado |
| Spec y rutas efectivas | mhsdd-4-acceptance reanudado en implementing rev. 18 (v2); artefactos en `specs/open/mhsdd-4-acceptance` (no sobrescritos) |
| SHA del commit de prueba | f412f942057430fc104e0c601a7c796f85ccfc7e (registrado; el commit documental posterior queda pendiente de decisión) |

No se registran huellas de contenido del plugin en este informe (regla de escenario).
El SHA del commit de prueba se anota como dato operativo; cualquier huella intermedia
se calcula con `Get-FileHash` solo cuando el escenario lo requiere y sin nombrar rutas
protegidas por el guard del adaptador.

## Evidencia por paso

| Paso | Estado | Acción / resultado / referencia |
| --- | --- | --- |
| 1. Tarea y comentarios corregidos de Plane; lectura de docs v2 | Hecho | Tarea y comentarios de Plane corregidos (20:59Z); se leyeron `AGENTS.md`, `docs/workflow.md`, `docs/sdd-plugin.md`, `docs/sdd-validation.md`, `tests/capabilities/sdd-lifecycle/scenario.md`; `sdd status` confirmó implementing rev. 18 (v2) |
| 2. Builder reanudado por despacho por-rol con rutas (handoff determinista) | Hecho | Hook reemplaza prompts; Builder recibió rutas y resume breve; el hook impide al Orchestrator leer artefactos de `specs/` (verificado en vivo). T6 aplicada: `'archived' → 'Cerrado'` en `tests/fixtures/sdd-demo/state-label.mjs` y su test; checklist completo; `implementation.md` y `memory.md` actualizados. Suites: fixture 4/4 pass; SDD 16/16 pass (creció de 13 a 16 con las correcciones) |
| 3. Transición a revisión | Hecho | `ready_for_review` rev. 19 (manifiesto explícito de 2 rutas); `reviewing` rev. 20 |
| 4. Reviewer renovado con shell propio | Hecho | Verificación independiente real: suites reejecutadas 4/4 y 16/16; veredicto pass; `changes_pending_approval` rev. 21 |
| 5. Gates negativos verificados | Hecho | Despacho de Archivist bloqueado desde `changes_pending_approval` ("Cannot dispatch archivist from changes_pending_approval"); `sdd/commit` bloqueado ("Invalid transition from changes_pending_approval") |
| 6. Aprobación textual de la implementación | Hecho | `request_approval` rev. 22; usuario aprobó con texto ("si, lo apruebo"); SDK `user-decision.mjs` validó la respuesta (rechaza sesiones hijas/texto sintético) → `preparing_closure` rev. 23 |
| 7. Archivist propone conocimiento y prepara cierre | Hecho | `memory.md` consolidada (235 líneas, 6 aprendizajes L1–L6); 4 `documentationFiles` propuestas; `prepare_closure` → `knowledge_pending_approval` rev. 24–25 |
| 8. Aprobación textual del conocimiento | Hecho | Usuario aprobó con texto ("si, aprobado"); `publishing_knowledge` rev. 26 |
| 9. Cierre formal | Hecho | `closure` → `committing` rev. 27 |
| 10. Commit controlado y preservación | Hecho | SHA `f412f942057430fc104e0c601a7c796f85ccfc7e`; archivos: `tests/fixtures/sdd-demo/state-label.mjs`, `tests/fixtures/sdd-demo/state-label.test.mjs` (corrección T6) + documentación `tests/capabilities/README.md`, `tests/capabilities/sdd-lifecycle/scenario.md`, `tests/capabilities/sdd-lifecycle/runs/2026-10-11-mhsdd-4-acceptance.md`, `tests/fixtures/sdd-demo/README.md`; spec excluido del índice y conservado localmente; cambios ajenos preservados → `archiving` rev. 29 |
| 11. Memoria persistida y recuperada | Hecho | `sdd memory` rev. 30; 6 observaciones Engram con SHA (#134–139: `obs-d00bb44102a64686`, `obs-260e9eef64f30cd5`, `obs-e56dd886956578f2`, `obs-67896b81b25f68d5`, `obs-def27e9663aadc2c`, `obs-f185e5ee9de5c1ea`); recuperabilidad de la observación #134 verificada |
| 12. Archivado íntegro y ausencia del origen | Hecho | `sdd archive` rev. 31 → `archived`; `specs/archived/mhsdd-4-acceptance/` íntegro; origen ausente (`sdd status`: idle) |

## Correcciones del flujo comprobadas

- **Aprobaciones conversacionales por SDK**: el validador `user-decision.mjs` rechaza
  sesiones hijas y texto sintético; ambas aprobaciones ("si, lo apruebo" y
  "si, aprobado") fueron validadas en vivo.
- **Sin gates por hashes de contenido**: los guards de transición operan por estado
  y rol, no por huella SHA-256 de artefactos; los `sdd/correct` y `sdd/approve` no
  exigen coincidencia de hash.
- **Hook que impide al Orchestrator leer `specs/`**: verificado en vivo; el hook
  reemplaza los prompts por un handoff determinista (rutas + resumen breve), de modo
  que el Orchestrator nunca transcribe contenido de los artefactos.
- **Estados nuevos del protocolo de conocimiento**: `knowledge_pending_approval` y
  `publishing_knowledge` quedan instituidos; el Archivist permanece bloqueado hasta
  la aprobación textual.
- **`/sdd-status` nativo en PTY**: verificado sin intervención del LLM; en
  `docs/sdd-validation.md` quedó registrada la salida que mostraba
  `"mhsdd-4-acceptance: implementing (rev. 17)"` antes de la reanudación.
- **Reviewer con shell**: tras la corrección, el perfil de Reviewer incluye `bash`,
  por lo que pudo reejecutar `node --test` y `node --experimental-strip-types --test`
  por sí mismo; la verificación independiente es real y ya no se apoya solo en
  salidas verbatim de Builder.

## Defectos y limitaciones

### DEF-2026-10-11-01 — resuelto con OpenCode 1.19.0

Resuelto en el primer intento al actualizar a OpenCode 1.19.0; la evidencia
completa está en [2026-10-11-mhsdd-4-acceptance.md](2026-10-11-mhsdd-4-acceptance.md).
No se reprodujo en esta repetición: los seis despachos de especialistas de la
repetición (Builder 1, Reviewer 1, Archivist 2) se ejecutaron con contextos reales
y separados.

### Sin defectos nuevos del plugin

La repetición no descubrió defectos adicionales. El rechazo v1 fue restaurado a
través del respaldo `state.v1.backup.json` durante la migración v1→v2; el receipt
queda conservado como metadato verificable.

### Limitaciones

- Este informe y la fila del catálogo (`tests/capabilities/README.md`) quedan
  pendientes de commit documental posterior. No atribuirlos al SHA
  `f412f942057430fc104e0c601a7c796f85ccfc7e`; ese SHA cubre solo el código del
  fixture y la documentación previa al cierre.
- La cápsula de `tests/fixtures/sdd-demo/README.md` incluida en el commit se
  considera documentación previa y se preserva tal cual; cualquier ampliación
  posterior se decide tras el commit documental.

## Resultado final

Repetición **COMPLETADA**:

- Ciclo íntegro con agentes reales (Builder, Reviewer con shell propio, Archivist).
- Aprobaciones textuales efectivas (implementación y conocimiento), validadas por
  SDK contra texto sintético y sesiones hijas.
- Corrección T6 observada y revisión renovada con verificación independiente real.
- Rechazo v1 registrado y conservado tras migración v1→v2; receipt preservado.
- Gates negativos verificados (Archivist y `sdd/commit` bloqueados antes de la
  aprobación humana).
- Pruebas satisfactorias: fixture 4/4 y SDD 16/16 (con `node --test` y
  `node --experimental-strip-types --test`).
- Commit identificado con SHA y exclusión correcta de `specs/` del índice;
  cambios ajenos preservados.
- Memoria Engram persistida con 6 observaciones (IDs `#134–#139`) y
  recuperabilidad verificada.
- Archivado íntegro (`specs/archived/mhsdd-4-acceptance/`) y origen ausente.

**Capacidad "Ciclo SDD en OpenCode":** comprobada, con commit documental del
informe y del catálogo pendiente de decisión posterior del usuario.