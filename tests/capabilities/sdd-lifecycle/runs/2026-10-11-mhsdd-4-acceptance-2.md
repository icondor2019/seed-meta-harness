# MHSDD-4: aceptación interactiva corregida — segunda ejecución

Informe de la ejecución `mhsdd-4-acceptance-2`. Procedimiento:
[../scenario.md](../scenario.md). Ejecuciones anteriores conservadas sin sobrescribir:
[2026-10-11-mhsdd-4-acceptance.md](2026-10-11-mhsdd-4-acceptance.md) y
[2026-10-11-mhsdd-4-acceptance-repeat-1.md](2026-10-11-mhsdd-4-acceptance-repeat-1.md).

Propiedad del informe por secciones (scenario.md §Procedimiento):
Explorer crea entorno/exploración; Builder añade implementación y pruebas; Reviewer
añade verificación; Archivist consolida cierre y resultado final. Las secciones
inferiores quedan pendientes de sus roles.

## Entorno registrado (Explorer)

| Dato | Valor observado |
| --- | --- |
| Fecha de la exploración | 2026-10-11 (America/Bogota) |
| Versión OpenCode / Node | OpenCode 1.19.0 (npm global) / Node v24.14.1 |
| Rama | `codex/mhsdd-4-plugin-determinista-workflow-sdd` (verificada con `git rev-parse`) |
| HEAD | `f412f942057430fc104e0c601a7c796f85ccfc7e` — `[mhsdd-4-acceptance] Prueba de aceptación interactiva del ciclo SDD (MHSDD-4)` |
| Spec activo (controlador) | `mhsdd-4-acceptance-2`, estado `exploring` rev. 0 (creado por `sdd/create` del orquestador; único spec abierto) |
| Spec archivado preservado | `specs/archived/mhsdd-4-acceptance/` completo (state.json rev. 31, commit `f412f94…`) |

### Archivos del plugin bajo prueba (sin commitear; rutas y tamaños)

| Archivo | Bytes | Última escritura |
| --- | --- | --- |
| `.opencode/plugins/sdd.ts` | 5758 | 2026-10-11 19:47 |
| `.opencode/sdd/controller.mjs` | 18511 | 2026-10-11 19:46 |
| `.opencode/sdd/io.mjs` | 2372 | 2026-10-11 13:41 |
| `.opencode/sdd/user-decision.mjs` | 1142 | 2026-10-11 15:47 |
| `.opencode/tui/sdd-status.ts` | 849 | 2026-10-11 15:47 |
| `.opencode/commands/sdd-new.md` | 762 | 2026-10-11 19:46 |
| `.opencode/commands/sdd-validate.md` | 268 | 2026-10-11 13:39 |
| `tui.json` | registra `./.opencode/tui/sdd-status.ts` | — |

Sin huellas de contenido del plugin en este informe (consistencia con la ejecución
anterior); tamaños y marcas de tiempo como referencia operativa.

### Suites base antes de la implementación de esta ejecución

```text
node --test tests/fixtures/sdd-demo/state-label.test.mjs   → 4/4 pass
node --experimental-strip-types --test tests/sdd/*.test.mjs → 20/20 pass
```

Cobertura observada (nombres reales del TAP): creación con esquema tipado;
aprobación por texto real de usuario; handoff determinista sin copiar artifacts;
bloqueo de lectura de `specs/` al Orchestrator; `/sdd-status` nativo de una línea
sin modelo/sesión; hooks de persistencia prematura; rechazo→revisión renovada;
conocimiento propuesto/aprobado/publicado; gates por estado y rol (sin hashes de
contenido); migración v1; staging ajeno preservado; recuperación de commit
interrumpido; límite de 400 líneas y rutas inseguras.

## Exploración (Explorer)

### Comprobación `/sdd-status` (paso 2)

- Salida del controlador vía `status` + `statusLine` (misma ruta que usa el TUI):
  `mhsdd-4-acceptance-2: exploring (rev. 0)` — una sola línea, sin modelo ni
  transición. `status` es la única acción que no toma el lock ni ejecuta Git
  (comentario y camino de código en `controller.mjs`).
- `tui.json` registra `.opencode/tui/sdd-status.ts`; el plugin TUI solo llama
  `status()` y `api.ui.toast` (sin `session.*` ni llamadas al modelo).
- La prueba automatizada nº 19 ("native /sdd-status shows one line, calls no
  model/session and preserves state") pasa en la suite local (20/20).
- Limitación: como subagente no puedo seleccionar el comando nativo de TUI; la
  verificación en vivo PTY corresponde al usuario/coordinador (la ejecución
  anterior la registró en `docs/sdd-validation.md`).

### Hallazgos de arquitectura (protocolo v2 bajo prueba)

1. **Máquina de estados determinista** en `specs/open/<id>/state.json` (v2):
   `exploring → planning → plan_pending_approval → implementing →
   ready_for_review → reviewing → changes_pending_approval → preparing_closure →
   knowledge_pending_approval → publishing_knowledge → committing → archiving →
   archived`. Solo `status` se lee fuera del lock.
2. **Aprobaciones conversacionales**: `approve` exige `request_approval` previo y
   un mensaje real del usuario vía `user-decision.mjs` (SDK; rechaza sesiones hijas
   y texto sintético). Recibos `source: user-text` con messageID/sessionID.
3. **Handoff determinista**: el hook `task` reemplaza el prompt con orden, spec y
   contexto breve del coordinador; el Orchestrator no puede leer `specs/` (hook
   `read` bloqueado por rol).
4. **Corrección tras rechazo final**: rechazo en `changes_pending_approval` →
   `implementing` con feedback al Builder; un `pass` renovado lleva directo a
   `changes_pending_approval` (sin rehacer preparación de cierre).
5. **Persistencia separada**: Archivist solo tras `implementationApproved`;
   Engram solo en `archiving` con commit + `knowledgeApproved`; documentación solo
   en `publishing_knowledge` con rutas aprobadas (`documentationFiles`).
6. **Commit con manifiesto explícito**: `transition` a `ready_for_review` fija
   `files`; `commit` valida staging contra el manifiesto, excluye
   `specs/open/<id>/` del índice y preserva cambios ajenos. `safePath` prohíbe
   rutas `specs/` como implementación.
7. **Límite 400 líneas** (`lineCheck`) en validación, transición, commit y archivo.

### Estado del fixture (evidencia para planificación)

- `tests/fixtures/sdd-demo/state-label.mjs` actual (en HEAD `f412f94…`, sin
  diff local): etiquetas `exploring: Explorando`, `implementing: Implementando`,
  `archived: Cerrado` — resultado de la corrección T6 de la ejecución anterior.
- `state-label.test.mjs`: 4 pruebas (los tres estados + entrada no soportada);
  pasan 4/4.
- El escenario describe para esta ejecución "Etiquetas iniciales: Explorando,
  Implementando, Archivado. En el rechazo final el usuario pide Cerrado": el plan
  de esta ejecución debe partir del fixture comprometido (hoy con `Cerrado`) y
  definir sus propios cambios sin borrar la historia; decisión de planificación
  (Planner), no de Explorer.

### Áreas afectadas durante el ciclo

- Artefactos del spec: `specs/open/mhsdd-4-acceptance-2/{exploration,proposal,design,tasks,implementation,review,memory}.md`.
- Implementación autorizada del ejercicio: `tests/fixtures/sdd-demo/`.
- Informe: `tests/capabilities/sdd-lifecycle/runs/2026-10-11-mhsdd-4-acceptance-2.md`.
- `tests/sdd/*` solo si aparece un defecto real del plugin (correcciones deben
  delimitar su propio manifiesto).

### Restricciones verificadas

- Rama feature activa; `create` ya validó ausencia de otro spec abierto.
- Prohibido: `git add .`, push, merge, reversión automática; escribir el informe
  desde el Orchestrator; fabricar recibos de aprobación.
- Un informe existente se conserva y actualiza sin borrar evidencia.
- Interrupción real (Escape del usuario) durante una asignación en curso es el
  único sustituto válido de la comprobación de reanudación; una reinvocación de
  trabajo terminado no la acredita.

### Comprobación de interrupción (paso 2)

Pendiente: hasta el momento no se observó una interrupción real (Escape) de esta
asignación en curso; se registrará como pendiente salvo que ocurra y se reanude.
Una reinvocación posterior no sustituirá esta comprobación.

### Preguntas abiertas

1. (Para Planner) El fixture ya contiene `archived: 'Cerrado'` (corrección
   T6 comprometida en `f412f94…`); el escenario pide etiquetas iniciales
   `Archivado` y cambio final a `Cerrado`. El plan debe explicitar el baseline y
   los cambios de esta ejecución sin alterar la evidencia archivada.
2. (De proceso) La verificación en vivo de `/sdd-status` en TUI PTY queda fuera
   del alcance de Explorer (subagente); si el coordinador la requiere en esta
   ejecución, debe realizarla el usuario.

---

## Implementación y pruebas (Builder)

### Tarea T01 — Baseline hacia adelante

El fixture partía de HEAD `f412f94…` con `archived: 'Cerrado'` (corrección T6 de la
ejecución anterior). Se repusieron las etiquetas iniciales del escenario editando
solo la etiqueta del estado `archived` y su expectativa en el test:

- `tests/fixtures/sdd-demo/state-label.mjs`: `LABELS.archived` `'Cerrado'` → `'Archivado'`.
- `tests/fixtures/sdd-demo/state-label.test.mjs`: nombre del caso y aserto `'Cerrado'` → `'Archivado'`.

`Explorando` e `Implementando` permanecen intactos. El diff del árbol frente a
HEAD quedó limitado a esos dos cambios; no se tocaron `specs/archived/`, runs
previos ni `docs/`.

### Tarea T02 — Suite del fixture

```text
node --test tests/fixtures/sdd-demo/state-label.test.mjs
```

Resultado: **4/4 pass**.

```text
✔ stateLabel(exploring) returns Explorando (0.7527ms)
✔ stateLabel(implementing) returns Implementando (0.1097ms)
✔ stateLabel(archived) returns Archivado (0.0827ms)
✔ stateLabel(unknown) throws mentioning the state (0.3422ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 100.0794
```

### Tarea T03 — Suite SDD completa

```text
node --experimental-strip-types --test tests/sdd/*.test.mjs
```

Resultado: **20/20 pass**.

La suite crea ramas temporales (`codex/test`, `codex/other`) y al finalizar
restablece la rama activa original `codex/mhsdd-4-plugin-determinista-workflow-sdd`.

### Tarea T04 — implementation.md

Se creó `specs/open/mhsdd-4-acceptance-2/implementation.md` con los cambios,
validaciones y trabajo restante. No entra en el manifiesto de implementación.

### Tarea T05 — Reporte y manifiesto

Se reportó `completed` al controlador con el manifiesto de implementación:

```text
tests/fixtures/sdd-demo/state-label.mjs
tests/fixtures/sdd-demo/state-label.test.mjs
```

El controlador aceptó el reporte (revisión 7) y la transición a
`ready_for_review` queda a cargo del Orchestrator; el Builder no tiene permiso
para ejecutar `sdd/transition` (`Orchestrator required`).

### Tarea T06 — Corrección tras el rechazo final

Contexto del rechazo en `changes_pending_approval`: el usuario aprobó el plan con
`source: user-text`, la revisión inicial dio `pass`, y en la aprobación final
rechazó con mensaje real: "ah ok, perodn, no recoerde el guión, ok, voy a
rechazar para revisar el caso de uso definido en la prueba." El controlador
ruteó el rechazo a `implementing` con feedback al Builder, conforme al escenario
scripted (corrección sin replan porque el alcance aprobado sigue siendo
`'Cerrado'`).

Cambios:

- `tests/fixtures/sdd-demo/state-label.mjs`: `LABELS.archived` `'Archivado'` → `'Cerrado'`.
- `tests/fixtures/sdd-demo/state-label.test.mjs`: nombre del caso y aserto `'Archivado'` → `'Cerrado'`.

Validación tras la corrección:

```text
node --test tests/fixtures/sdd-demo/state-label.test.mjs
```

Resultado: **4/4 pass**.

```text
✔ stateLabel(exploring) returns Explorando (0.6601ms)
✔ stateLabel(implementing) returns Implementando (0.0944ms)
✔ stateLabel(archived) returns Cerrado (0.0805ms)
✔ stateLabel(unknown) throws mentioning the state (0.3335ms)
ℹ tests 4
ℹ pass 4
ℹ fail 0
```

```text
node --experimental-strip-types --test tests/sdd/*.test.mjs
```

Resultado: **20/20 pass**.

```text
ℹ tests 20
ℹ pass 20
ℹ fail 0
```

Tras T06, `git diff -- tests/fixtures/sdd-demo/` es vacío (solo advertencias de
normalización CRLF/LF); el contenido del fixture coincide con HEAD, como espera
el diseño D4.

### Tarea T07 — Preservación transversal

- `specs/archived/**`, runs previos y `docs/` sin diff atribuible a este spec.
- Plugin v2 permanece untracked/unstaged.
- Sin `git add .`, reset, revert ni rebase.

### Estado del Builder al reportar

- T01–T07 completadas por el Builder.
- Revisión renovada: pendiente de asignación del Reviewer tras transición a
  `ready_for_review` con el mismo manifiesto.
- Aprobación final textual y cierre: pendientes.

## Verificación (Reviewer)

Revisión independiente renovada tras el rechazo textual del usuario en
`changes_pending_approval` y la corrección T06. Veredicto completo y tabla de
criterios en `specs/open/mhsdd-4-acceptance-2/review.md`; resultado:
**pass** → `changes_pending_approval` (conforme a AC-3).

- **T06**: `LABELS.archived` restituido a `'Cerrado'` en el par función/test;
  ambas suites re-ejecutadas de forma independiente: fixture **4/4 pass**,
  suite SDD **20/20 pass**; `git diff -- tests/fixtures/sdd-demo/` vacío
  normalizado frente a HEAD; `implementation.md` con evidencia renovada.
- **T06/AC-4**: manifiesto = las dos rutas relativas del fixture, sin rutas
  bajo `specs/`.
- **T07/AC-5 y AC-4 (preservación transversal)**: sin diff en
  `specs/archived/`, runs previos (`2026-10-11-mhsdd-4-acceptance.md`,
  `-repeat-1.md`) ni `docs/` atribuible a este spec; el plugin v2
  (`.opencode/plugins/`, `.opencode/sdd/`, `.opencode/tui/`,
  `.opencode/commands/`, `tui.json`) permanece untracked/unstaged; sin
  `git add .`, reset, revert ni rebase.
- **Seguridad**: revisión scoped a los dos archivos del fixture; sin hallazgos
  (la función `stateLabel` no cambia; sin secretos ni trust boundaries nuevos).
- **Observaciones no bloqueantes**: RVE-001 (cambios ajenos preexistentes
  preservados fuera del manifiesto, sin stage); RVE-002 (PTY `/sdd-status` en
  vivo y interrupción Escape siguen pendientes; se registran como limitaciones).

## Cierre y resultado final (Archivist)

### Resultado de la ejecución

Segunda ejecución completada conforme al escenario: etiquetas iniciales
`Archivado` repuestas por edición hacia adelante sobre el fixture comprometido
(T01), rechazo final textual con `source: user-text` que rutó a `implementing`
(T06), corrección a `'Cerrado'` sin replan y revisión renovada `pass`.
Diff final del fixture frente a HEAD `f412f94…`: vacío normalizado. Suites
finales: fixture **4/4**, SDD **20/20**. Preservación transversal confirmada
(runs previos, `specs/archived/` y `docs/` intactos; plugin v2 sin stage).
Limitaciones honestas: la interrupción real (Escape) no se observó y el
comando `/sdd-status` en TUI PTY no se verificó en vivo (el probe del
controlador y la prueba nº 19 de la suite SDD cubren la funcionalidad).

### Conocimiento aprobado (publicación)

Propuesta consolidada y deduplicada en `specs/open/mhsdd-4-acceptance-2/memory.md`
(A1–A4; EXP2-L2+PLN2-L1 fusionadas en A1; EXP2-L4 excluida como limitación
datada de esta ejecución). **Aprobación textual del usuario: solo A2 y A4.**

- **A2** — Probe de `/sdd-status` sin TUI a nivel de controlador: `status(root)`
  + `statusLine(s)` devuelven la línea del toast del TUI; `status` es la única
  acción sin lock, sin Git y sin transición.
- **A4** — `tests/sdd/*.test.mjs` es el contrato ejecutable del protocolo v2
  (20 pruebas al cierre de esta ejecución; los cambios contractuales del
  protocolo deben reflejarse ahí).
- **A1 y A3**: no aprobados → no se persisten en Engram.

Documentación publicada (única `documentationFile` aprobada en el plan):
este informe. El bundle OKF 0.2 no existe en este repositorio; no se publica en
otras rutas (`tests/capabilities/README.md`, `scenario.md` ni
`tests/fixtures/sdd-demo/README.md` quedan fuera del alcance documental
aprobado de este spec).

### Persistencia Engram (pendiente del commit)

La persistencia en Engram ocurre tras el commit local del manifiesto (fase
`archiving`), con el SHA real del commit y los IDs observables, y **solo** para
A2 y A4. Engram espera al commit: sin IDs fabricados ni escritura prematura.
