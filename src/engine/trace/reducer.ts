/**
 * 이벤트 → 상태 리듀서.
 *
 * 트레이스는 변경분(이벤트)만 담고, 화면에 필요한 전체 상태는 여기서 만든다.
 * `applyEvent`는 순수 함수여야 한다. 같은 (state, event)는 항상 같은 결과를
 * 내야 seek·keyframe 캐시가 성립한다.
 */

import type {
  Binding,
  ErrorState,
  FileState,
  Frame,
  HeapMapping,
  HeapObject,
  HeapSequence,
  HeapSet,
  ProgramState,
  TraceDocument,
  TraceEvent,
  Value,
} from "./types.ts";

export function initialState(doc: TraceDocument): ProgramState {
  return {
    step: 0,
    line: null,
    prevLine: null,
    completedLines: [],
    frames: [
      {
        id: "global",
        name: "global",
        parentId: null,
        bindings: [],
        returnLine: null,
        phase: "active",
      },
    ],
    heap: { ...(doc.initialHeap ?? {}) },
    loops: [],
    output: [],
    evaluating: [],
    files: Object.entries(doc.initialFiles ?? {}).map(([path, content]) => ({ path, content })),
    sourcePath: doc.source.path,
    tasks: [],
    status: "ready",
    error: null,
  };
}

// ── 작은 헬퍼 ────────────────────────────────────────────────

function cloneFrames(frames: Frame[]): Frame[] {
  return frames.map((f) => ({ ...f, bindings: f.bindings.map((b) => ({ ...b })) }));
}

function frameById(frames: Frame[], id: string): Frame | undefined {
  return frames.find((f) => f.id === id);
}

/**
 * 이벤트의 frameId가 가리키는 프레임. 없으면 최상단 활성 프레임으로 떨어진다.
 * (트레이스 생성기 버그로 조용히 틀린 프레임에 변수를 쓰는 것보다,
 *  개발 중에는 드러나는 편이 낫지만 재생 자체가 죽으면 안 되므로 fallback)
 */
function targetFrame(frames: Frame[], id: string): Frame {
  return frameById(frames, id) ?? frames[frames.length - 1]!;
}

function upsertBinding(
  frame: Frame,
  name: string,
  value: Value,
  step: number,
  origin?: Binding["origin"],
): void {
  const existing = frame.bindings.find((b) => b.name === name);
  if (existing) {
    existing.previous = existing.value;
    existing.value = value;
    existing.updatedAtStep = step;
    existing.retired = false;
    if (origin) existing.origin = origin;
    return;
  }
  frame.bindings.push({
    name,
    value,
    origin,
    createdAtStep: step,
    updatedAtStep: step,
  });
}

/** 현재 줄을 옮기면서 §3.1의 이전 줄 / 완료 줄 표시를 갱신한다. */
function moveTo(state: ProgramState, line: number): void {
  if (state.line === line) return;
  if (state.line !== null && !state.completedLines.includes(state.line)) {
    state.completedLines = [...state.completedLines, state.line];
  }
  state.prevLine = state.line;
  state.line = line;
  // 다시 실행되는 줄은 완료 표시를 걷어낸다 (반복문에서 매 회차 필요)
  state.completedLines = state.completedLines.filter((l) => l !== line);
}

function upsertFile(
  files: FileState[],
  path: string,
  step: number,
  update: (file: FileState) => FileState,
): FileState[] {
  const at = files.findIndex((f) => f.path === path);
  const base = at >= 0 ? files[at]! : { path, content: "" };
  const next = { ...update(base), updatedAtStep: step };
  if (at < 0) return [...files, next];
  return files.map((f, i) => (i === at ? next : f));
}

function heapSequence(heap: Record<string, HeapObject>, id: string): HeapSequence | null {
  const obj = heap[id];
  return obj && obj.kind === "sequence" ? obj : null;
}

// ── 리듀서 ───────────────────────────────────────────────────

export function applyEvent(
  prev: ProgramState,
  event: TraceEvent,
  /** 이벤트에 파일이 적혀 있지 않을 때의 기본 파일. 한 파일짜리 레슨의 경로다. */
  mainPath?: string,
): ProgramState {
  const state: ProgramState = {
    ...prev,
    step: event.step,
    frames: cloneFrames(prev.frames),
    heap: { ...prev.heap },
    loops: prev.loops.map((l) => ({ ...l })),
    output: prev.output,
    evaluating: prev.evaluating,
    files: prev.files,
    completedLines: prev.completedLines,
  };

  // §P20 §10-2 "실행 하이라이트를 main에서 imported module 첫 줄로 옮긴다".
  // 파일이 바뀌면 완료 줄 표시는 그 파일의 것이 아니므로 함께 비운다.
  const nextSource = event.source ?? mainPath ?? prev.sourcePath;
  if (nextSource !== state.sourcePath) {
    state.sourcePath = nextSource;
    state.completedLines = [];
    state.line = null;
  }

  if (state.status === "ready") state.status = "running";

  // FRAME_POP으로 retired 표시된 프레임은 한 단계만 흐리게 남았다가 사라진다.
  // §3.4: "범위를 벗어난 변수는 즉시 사라지게 하지 않고 흐려진 뒤 접는다"
  if (event.type !== "FRAME_POP") {
    state.frames = state.frames.filter((f) => f.phase !== "retired");
  }

  moveTo(state, event.line);

  switch (event.type) {
    case "LINE_ENTER": {
      state.evaluating = [];
      break;
    }

    case "LINE_EXIT":
      break;

    case "PROGRAM_END": {
      state.status = event.reason === "error" ? "error" : "done";
      state.evaluating = [];
      break;
    }

    case "EXPRESSION_EVAL": {
      const note = {
        step: event.step,
        line: event.line,
        expression: event.expression,
        substituted: event.substituted,
        result: event.result,
      };
      // pending이면 쌓고, 결과가 오면 같은 표현식의 노트를 갱신한다.
      const idx = state.evaluating.findIndex(
        (n) => n.expression === event.expression && n.result === undefined,
      );
      if (idx >= 0 && !event.pending) {
        const next = [...state.evaluating];
        next[idx] = note;
        state.evaluating = next;
      } else {
        state.evaluating = [...state.evaluating, note];
      }
      break;
    }

    case "VARIABLE_CREATE": {
      const frame = targetFrame(state.frames, event.frameId);
      upsertBinding(frame, event.name, event.value, event.step, event.origin);
      break;
    }

    case "VARIABLE_UPDATE": {
      const frame = targetFrame(state.frames, event.frameId);
      upsertBinding(frame, event.name, event.after, event.step, event.origin);
      break;
    }

    case "VARIABLE_DELETE": {
      const frame = targetFrame(state.frames, event.frameId);
      frame.bindings = frame.bindings.filter((b) => b.name !== event.name);
      break;
    }

    case "BRANCH_TEST": {
      state.evaluating = [
        ...state.evaluating,
        {
          step: event.step,
          line: event.line,
          expression: event.expression,
          substituted: event.substituted,
          result: { kind: "primitive", type: "bool", repr: String(event.result) },
        },
      ];
      break;
    }

    case "BRANCH_TAKEN":
      break;

    case "LOOP_START": {
      const existing = state.loops.find((l) => l.id === event.loopId);
      const fresh = {
        id: event.loopId,
        frameId: event.frameId,
        line: event.line,
        varNames: event.varNames,
        track: event.track,
        index: -1,
        parentLoopId: event.parentLoopId,
        status: "running" as const,
      };
      // 중첩 반복에서 안쪽 루프는 바깥 회차마다 새로 시작한다. §3.6의
      // "k 종료 → i 증가 → k 새로 시작"이 같은 loopId 재시작으로 표현된다.
      state.loops = existing
        ? state.loops.map((l) => (l.id === event.loopId ? fresh : l))
        : [...state.loops, fresh];
      break;
    }

    case "LOOP_ITERATION": {
      state.loops = state.loops.map((l) =>
        l.id === event.loopId ? { ...l, index: event.index, status: "running" } : l,
      );
      break;
    }

    case "LOOP_END": {
      state.loops = state.loops.map((l) =>
        l.id === event.loopId ? { ...l, status: "done" } : l,
      );
      break;
    }

    case "FUNCTION_DEFINE": {
      const frame = targetFrame(state.frames, event.frameId);
      state.heap[event.heapId] = {
        kind: "function",
        id: event.heapId,
        name: event.name,
        params: event.params,
        defLine: event.line,
      };
      upsertBinding(
        frame,
        event.name,
        { kind: "ref", id: event.heapId },
        event.step,
        { kind: "literal", label: "함수 정의" },
      );
      break;
    }

    case "FUNCTION_CALL": {
      state.evaluating = [
        ...state.evaluating,
        {
          step: event.step,
          line: event.line,
          expression: `${event.callee}(...)`,
          substituted: event.substituted,
        },
      ];
      break;
    }

    case "FUNCTION_ENTER": {
      const caller = targetFrame(state.frames, event.parentFrameId);
      caller.phase = "waiting";
      caller.returnLine = event.returnLine;
      state.frames = [
        ...state.frames,
        {
          id: event.frameId,
          name: event.name,
          kind: event.kind,
          callNumber: event.callNumber,
          parentId: event.parentFrameId,
          bindings: [],
          returnLine: null,
          callLine: event.returnLine,
          phase: "active",
        },
      ];
      break;
    }

    case "PARAMETER_BIND": {
      const frame = targetFrame(state.frames, event.frameId);
      upsertBinding(frame, event.name, event.value, event.step, {
        kind: "argument",
        from: event.from,
      });
      break;
    }

    case "FUNCTION_RETURN": {
      const frame = targetFrame(state.frames, event.frameId);
      frame.phase = "returning";
      state.evaluating = [
        ...state.evaluating,
        {
          step: event.step,
          line: event.line,
          expression: "return",
          result: event.value,
        },
      ];
      break;
    }

    case "FRAME_POP": {
      state.frames = state.frames.map((f) => {
        if (f.id === event.poppedFrameId) {
          return {
            ...f,
            phase: "retired" as const,
            bindings: f.bindings.map((b) => ({ ...b, retired: true })),
          };
        }
        if (f.id === event.frameId) return { ...f, phase: "active" as const, returnLine: null };
        return f;
      });
      break;
    }

    // 파일 (§P18). 내용은 언제나 이벤트가 실어 온 전체를 쓴다.
    case "FILE_OPEN": {
      state.files = upsertFile(state.files, event.path, event.step, (file) => ({
        ...file,
        content: event.content,
        open: { mode: event.mode, encoding: event.encoding, cursor: event.cursor },
      }));
      break;
    }

    case "FILE_WRITE": {
      state.files = upsertFile(state.files, event.path, event.step, (file) => ({
        ...file,
        content: event.content,
        open: file.open ? { ...file.open, cursor: event.cursor } : undefined,
      }));
      break;
    }

    case "FILE_READ": {
      state.files = upsertFile(state.files, event.path, event.step, (file) => ({
        ...file,
        open: file.open ? { ...file.open, cursor: event.cursor } : undefined,
      }));
      break;
    }

    case "FILE_CLOSE": {
      // 통로만 사라진다. 디스크의 내용과 바깥 변수는 그대로다 (§10-6).
      state.files = upsertFile(state.files, event.path, event.step, (file) => ({
        path: file.path,
        content: event.content,
        updatedAtStep: file.updatedAtStep,
      }));
      break;
    }

    case "GENERATOR_CREATE": {
      state.evaluating = [
        ...state.evaluating,
        {
          step: event.step,
          line: event.line,
          expression: `${event.name}(...)`,
          substituted: event.substituted,
        },
      ];
      break;
    }

    // yield는 반환이 아니다. 프레임은 지역 변수를 그대로 든 채 멈춘다.
    case "GENERATOR_YIELD": {
      state.frames = state.frames.map((f) => {
        if (f.id === event.frameId) return { ...f, phase: "paused" as const };
        if (f.id === event.toFrameId) return { ...f, phase: "active" as const, returnLine: null };
        return f;
      });
      state.evaluating = [
        ...state.evaluating,
        { step: event.step, line: event.line, expression: "yield", result: event.value },
      ];
      break;
    }

    case "GENERATOR_RESUME": {
      state.frames = state.frames.map((f) => {
        if (f.id === event.frameId) return { ...f, phase: "active" as const };
        if (f.id === event.fromFrameId) return { ...f, phase: "waiting" as const };
        return f;
      });
      break;
    }

    case "MODULE_IMPORT":
      // 카드는 HEAP_ALLOC이, 이름 연결은 뒤따르는 VARIABLE_* 가 만든다.
      // 이 이벤트가 남기는 것은 "언제 어느 모듈이 붙었는가"라는 사실뿐이다.
      break;

    case "CLASS_DEFINE": {
      const frame = targetFrame(state.frames, event.frameId);
      upsertBinding(frame, event.name, { kind: "ref", id: event.heapId }, event.step, {
        kind: "literal",
        label: "클래스 정의",
      });
      break;
    }

    // 빈 instance 카드는 HEAP_ALLOC이 이미 놓았다. 이 이벤트는 그 카드가 어느
    // 설계도에서 나왔는지를 잇는다 (§5의 `eq1 ─→ Instance A`).
    case "INSTANCE_CREATE":
      break;

    case "ATTR_READ":
      break;

    case "ATTR_WRITE": {
      const obj = state.heap[event.target];
      if (obj?.kind === "mapping") {
        const entries = [...obj.entries];
        const at = entries.findIndex((e) => e.key === event.attr);
        if (at >= 0) entries[at] = { key: event.attr, value: event.after };
        else entries.push({ key: event.attr, value: event.after });
        state.heap[event.target] = { ...obj, entries };
      } else if (obj?.kind === "class") {
        const attributes = [...obj.attributes];
        const at = attributes.findIndex((e) => e.key === event.attr);
        if (at >= 0) attributes[at] = { key: event.attr, value: event.after };
        else attributes.push({ key: event.attr, value: event.after });
        state.heap[event.target] = { ...obj, attributes };
      }
      break;
    }

    case "HEAP_ALLOC": {
      state.heap[event.object.id] = event.object;
      break;
    }

    case "ITEM_READ": {
      break;
    }

    case "ITEM_WRITE": {
      const obj = state.heap[event.target];
      if (obj?.kind === "sequence") {
        const items = [...obj.items];
        const idx = Number(event.key);
        if (Number.isInteger(idx) && idx >= 0 && idx < items.length) items[idx] = event.after;
        state.heap[event.target] = { ...obj, items };
      } else if (obj?.kind === "mapping") {
        const entries = [...obj.entries];
        const at = entries.findIndex((e) => e.key === event.key);
        if (at >= 0) entries[at] = { key: event.key, value: event.after };
        else entries.push({ key: event.key, value: event.after });
        state.heap[event.target] = { ...obj, entries };
      }
      break;
    }

    case "ITEM_APPEND": {
      const seq = heapSequence(state.heap, event.target);
      if (seq) state.heap[event.target] = { ...seq, items: [...seq.items, event.value] };
      const set = state.heap[event.target];
      if (set?.kind === "set") {
        const dup = set.items.some((v) => JSON.stringify(v) === JSON.stringify(event.value));
        if (!dup) state.heap[event.target] = { ...set, items: [...set.items, event.value] };
      }
      break;
    }

    case "ITEM_REMOVE": {
      const obj = state.heap[event.target];
      if (obj?.kind === "sequence") {
        const idx = Number(event.key);
        state.heap[event.target] = {
          ...obj,
          items: obj.items.filter((_, i) => i !== idx),
        };
      } else if (obj?.kind === "mapping") {
        state.heap[event.target] = {
          ...obj,
          entries: obj.entries.filter((e) => e.key !== event.key),
        };
      }
      break;
    }

    case "ITERATOR_MOVE":
      break;

    case "OUTPUT_APPEND": {
      state.output = [
        ...state.output,
        { step: event.step, line: event.line, stream: event.stream, text: event.text },
      ];
      break;
    }

    case "ERROR_THROW": {
      const err: ErrorState = {
        step: event.step,
        line: event.line,
        name: event.name,
        message: event.message,
        propagatedThrough: [event.frameId],
        caught: false,
      };
      state.error = err;
      state.status = "error";
      break;
    }

    case "ERROR_PROPAGATE": {
      if (state.error) {
        state.error = {
          ...state.error,
          propagatedThrough: [...state.error.propagatedThrough, event.toFrameId],
        };
      }
      break;
    }

    case "ERROR_CATCH": {
      if (state.error) {
        state.error = { ...state.error, caught: true, caughtAtLine: event.handlerLine };
      }
      // 처리된 예외는 실행을 계속한다
      state.status = "running";
      break;
    }

    case "TASK_CREATE": {
      state.tasks = [...state.tasks, { id: event.taskId, label: event.label, state: "pending" }];
      break;
    }

    case "PROMISE_STATE": {
      state.tasks = state.tasks.map((task) =>
        task.id === event.taskId
          ? { ...task, state: event.state, ...(event.value ? { value: event.value } : {}) }
          : task,
      );
      break;
    }

    // await는 반환이 아니다. 프레임은 지역 변수를 그대로 든 채 스택을 떠난다.
    case "AWAIT_SUSPEND": {
      state.frames = state.frames.map((f) =>
        f.id === event.frameId ? { ...f, phase: "paused" as const } : f,
      );
      state.tasks = state.tasks.map((task) =>
        task.id === event.taskId ? { ...task, awaitedBy: event.frameId } : task,
      );
      break;
    }

    case "AWAIT_RESUME": {
      state.frames = state.frames.map((f) =>
        f.id === event.frameId ? { ...f, phase: "active" as const } : f,
      );
      state.tasks = state.tasks.map((task) =>
        task.id === event.taskId ? { ...task, awaitedBy: undefined } : task,
      );
      break;
    }

    case "TASK_COMPLETE":
      // 상태는 PROMISE_STATE가 이미 적었다. 이 이벤트가 남기는 것은
      // "여기서 이 작업이 끝났다"는 시점뿐이다.
      break;

    default: {
      const _exhaustive: never = event;
      void _exhaustive;
    }
  }

  return state;
}

/** 참조를 따라가 힙 객체를 찾는다. 없으면 null. */
export function deref(
  state: ProgramState,
  value: Value,
): HeapObject | null {
  if (value.kind !== "ref") return null;
  return state.heap[value.id] ?? null;
}

export function heapLabel(obj: HeapObject): string {
  switch (obj.kind) {
    case "function":
      return `function ${obj.name}(${obj.params.map((p) => p.name).join(", ")})`;
    case "sequence":
      return obj.label;
    case "mapping":
      return obj.className ?? obj.label;
    case "set":
      return "set";
    case "class":
      return `class ${obj.name}`;
    case "module":
      return `module ${obj.name}`;
    case "range":
      return `range(${obj.start}, ${obj.stop}${obj.step !== 1 ? `, ${obj.step}` : ""})`;
  }
}

export type { HeapMapping, HeapSequence, HeapSet };
