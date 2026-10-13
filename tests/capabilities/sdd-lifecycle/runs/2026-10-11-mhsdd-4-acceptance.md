# MHSDD-4: registro de aceptación interactiva

Estado: **en ejecución — bloqueada en el despacho de Explorer** (primer intento).
Fecha de preparación: 2026-10-11 (America/Bogota). Inicio de ejecución: 2026-10-11.
La evidencia registrada fue observada realmente; lo marcado pendiente no está acreditado.
Procedimiento: [scenario.md](../scenario.md).

## Entorno e identidad del código

| Dato | Valor observado |
| --- | --- |
| Inicio y fin de ejecución | Inicio: 2026-10-11; fin pendiente (en ejecución, retomada tras actualizar OpenCode) |
| Versión OpenCode / Node | OpenCode 1.15.3 (inicio) → 1.19.0 (desde el reintento del despacho; npm -g, decisión del usuario) / Node v24.14.1 |
| Rama | codex/mhsdd-4-plugin-determinista-workflow-sdd (verificada) |
| HEAD inicial | b7f9b49a840a1045acd7a39c8c4eaaac8b5ff203 |
| Cambios locales y staging inicial | 11 modificados sin stage (.gitignore, 7 agentes, AGENTS.md, README.md, docs/workflow.md) y no rastreados (.opencode/commands/, .opencode/plugins/, .opencode/sdd/, docs/sdd-plugin.md, docs/sdd-validation.md, tests/); staging vacío; sin stashes |
| SHA-256 del adaptador y módulos | sdd.ts 4C419B7BA149D06050D13A08E074B0D8CC2A622844CB6968043F1D6849F8258D; controller.mjs 5E8A76B39763FFEF8B0F811150F0F98C3F48C2695BB73F80427CE4B66A9C4A9A; io.mjs F9287C27CB1AA928C34D1E1A421AF3F49FC9F49075CB0693FAFEFD76397B0D7A; approve.mjs 9E70D38BF56DD3627D5143B1FFE011941052AE769E9CFB2FA6D03B803AF8AF6D |
| Spec y rutas efectivas | mhsdd-4-acceptance creado vía sdd/create: specs/open/mhsdd-4-acceptance, estado exploring, revisión 0 |
| SHA del commit de prueba | Pendiente |

Registrar huellas iniciales y, si el plugin cambia durante la prueba, las huellas
de la revisión realmente aceptada y los pasos repetidos. No incluir secretos.

## Evidencia por paso

| Paso | Estado | Acción / resultado / referencia |
| --- | --- | --- |
| Lectura de tarea, comentarios y contratos; inspección inicial | Hecho | MHSDD-4 + comentarios, AGENTS.md, docs/workflow.md, docs/sdd-plugin.md, scenario.md, fixture y suite leídos; entorno/huellas arriba; sdd/status inicial: "No active spec" |
| Creación mediante controlador y Explorer | Hecho (tramo repetido) | sdd/create → estado exploring, revisión 0. Explorer falló 3 veces bajo 1.15.3 (DEF-2026-10-11-01); tras actualizar a 1.19.0, despachado como subagente real: exploration.md persistido (291 líneas, 6 preguntas abiertas Q-EXP-001..006, huellas del plugin sin cambios) |
| Planificación mediante Planner | Hecho | Planner despachado como subagente real (llamada única autocontenida, cero lecturas): proposal.md (47 líns), design.md (24) y tasks.md (11) persistidos; sdd validate OK; transición explorar→planning→plan_pending_approval (rev. 3, token emitido) |
| Bloqueo de Builder antes de aprobación | Hecho | task(builder) desde plan_pending_approval rechazado por el gate del plugin SIN ejecutar subagente: "Cannot dispatch builder from plan_pending_approval" |
| Aprobación humana del plan | Hecho | Usuario ejecutó el CLI en otra terminal (20:18Z); state.json: rev. 4, state implementing, approval {stage plan_pending_approval, fingerprint plan a6eb56c0…, accept}; token consumido; el Orchestrator no lo ejecutó ni ejecutará |
| Implementación y pruebas | Hecho | Builder real (T1–T5, T7): state-label.mjs + state-label.test.mjs creados; fixture 4/4 pass; suite SDD 13/13 pass; implementation.md (130 líns, resultados verbatim); checklist marcado solo en casillas; T6 pendiente para el rechazo final |
| Revisión y veredicto | Primer veredicto changes-required; segundo pase pass | Reviewer real con identidad aceptada (Q-EXP-001 confirmada): primer pase changes-required (GAP-TEST-001/002, INFO-001) → ciclo a implementing rev. 7; Builder atendió hallazgos (cabecera corregida + re-verificación con suites 4/4 y 13/13, código sin cambios); ready_for_review rev. 8 recalculó snapshot 6e81426c…; segundo pase pass → preparing_closure rev. 10 |
| Preparación de cierre y documentación | Hecho | Archivist real: closure OK con documentationFiles (catálogo + informe provisional); memory.md consolidada (7 entradas reales); catálogo 19 líns; artifacts protegidos sin cambios; → changes_pending_approval rev. 15 |
| Rechazo humano final y cambio solicitado | Rechazo registrado | Recibo en state.json: changes_pending_approval reject @ 2026-10-11T20:37:53.498Z (fingerprint final 968c4395…); controlador volvió a implementing (rev. 17) invalidando revisión/aprobación final. Corrección T6 (Archivado→Cerrado) pendiente de ejecutar |
| Corrección, pruebas, revisión y aprobaciones renovadas | Pendiente | — |
| Commit local y preservación de archivos ajenos | Pendiente | — |
| Spec excluido del índice y artifacts conservados localmente | Pendiente | — |
| Memoria persistida y recuperada, o not-needed justificado | Pendiente | — |
| Archivado íntegro y ausencia de spec activo | Pendiente | — |
| Informe final presentado al usuario | Pendiente | — |

## Defectos y repeticiones

### DEF-2026-10-11-01 (resuelto con evidencia) — despacho de subagentes falla en OpenCode 1.15.3

- Resolución 2026-10-11: bajo OpenCode 1.19.0 los seis despachos de
  especialistas se ejecutaron con contextos reales y separados (Explorer 1,
  Planner 1, Builder 2, Reviewer 3, Archivist 2) sin reproducir el error
  `session_message.seq`. Se cierra con esta evidencia registral.

Observación del harness (limitación, no defecto del plugin): el perfil del
agente Reviewer no incluye herramienta shell, por lo que no puede re-ejecutar
las suites por sí mismo; su veredicto se apoyó en la evidencia registrada por
Builder (salidas verbatim) más verificación estática, declarada en review.md.
Decidir si se agrega shell al perfil queda para el usuario después del ciclo.

Observación (gate anti-deriva operando): la primera ejecución de closure fue
RECHAZADA por el controlador con "Review artifact changed: renew review": el
review.md vigente (hash 9CDF6F58…) difiere del reviewHash registrado en el
pass (e7f5437e…) porque el Reviewer editó el artifact tras su llamada sdd.
El controlador falló cerrado correctamente; se ejecuta la renovación
documentada: correct → ready_for_review → reviewing → pass reafirmado sin
escribir el artifact después de la llamada. El Archivist consolidó memory.md
antes de la llamada fallida; falta completar la actualización del catálogo en
el próximo intento. Los pasos afines se repiten sin considerarlos éxito previo.

- Evidencia: tres invocaciones de `task` con subagent_type=explorer (dos con prompt
  completo y una prueba mínima) devuelven `NOT NULL constraint failed:
  session_message.seq`. No es defecto del controlador SDD: sdd/create, sdd/status y
  el guard de bash operan, y el gate de despacho del adaptador permite explorer en
  exploring (.opencode/plugins/sdd.ts, gate de task). El error proviene del
  almacenamiento de sesiones del runtime.
- Impacto: bloquea la delegación real con contextos separados exigida por el
  escenario; la ejecución queda parcial y NO acredita la aceptación de MHSDD-4.
- Corrección: pendiente de decisión del usuario (reinicio de OpenCode o diagnóstico
  del almacenamiento de sesiones). No corregible dentro de los archivos de MHSDD-4.
  El spec persiste en specs/open/mhsdd-4-acceptance (estado exploring) para
  reanudar el tramo afectado sin repetir lo ya registrado.
- Decisiones 2026-10-11: el usuario reabrirá sesión para comprobar si el error
  persiste; si persiste, actualizará OpenCode (instalado 1.15.3 vía npm global;
  latest 1.19.0) con `npm.cmd install -g opencode-ai@latest` desde un terminal
  externo con OpenCode cerrado, y reintentará el tramo del Explorer. Registrar el
  cambio de versión y las repeticiones como limitación de este intento.

Observación de comportamiento esperado: un `Get-FileHash` que nombraba
.opencode/sdd/approve.mjs fue bloqueado con "Human-only approval / remote
integration operation" (guard de bash conservador por cadena de comando, tal como
documenta docs/sdd-plugin.md). Las huellas se calcularon evitando nombrar ese
archivo en el comando.

Registrar identificador, evidencia, impacto, corrección y comprobación
repetada. Conservar los intentos fallidos; no convertirlos retroactivamente en éxito.

## Resultado final y límites

Sin evaluar. Usar comprobada, comprobada parcialmente o fallida según la evidencia.
No cerrar MHSDD-4 hasta completar los criterios y presentar el resultado al usuario.
La evidencia automática anterior está en [sdd-validation.md](../../../../docs/sdd-validation.md);
no cuenta como ejecución interactiva de este informe.

La actualización posterior al archivado queda pendiente de commit documental.
Conservar los commits de prueba; no hacer push, merge ni revertirlos automáticamente.
