/**
 * JavaScript 실행 트레이서 — acorn 계측 방식.
 *
 * tracer.py와 같은 결정을 따른다. 인터프리터를 새로 만들지 않고 **진짜
 * JavaScript 엔진**으로 실행한 뒤, 원본 AST에 심어 둔 프로브가 남긴 이벤트
 * 배열을 트레이스로 넘긴다. `0.1 + 0.2`, `"1" + 1`, `[] == false` 같은 것이
 * 전부 실제 엔진의 답과 같다. 흉내 낸 언어를 가르치는 문제가 생기지 않는다.
 *
 * 같은 파일이 두 곳에서 돌아간다.
 *   · 빌드 타임: Node   → content/lessons/**\/trace.*.golden.json
 *   · 브라우저:   Web Worker → 레슨 화면의 "직접 실행"
 * Python 쪽이 CPython ↔ Pyodide로 성립시킨 것과 같은 구조다.
 *
 * ── tracer.py와 다른 점 ────────────────────────────────────────
 * 1. 줄 번호는 생성된 코드가 아니라 statics 표에서 온다. astring이 코드를
 *    다시 찍어내므로 생성 코드의 줄 번호는 원본과 다르다. 대신 모든 프로브가
 *    원본 위치를 인수로 들고 다니고, 오류 줄 번호는 마지막 `line` 프로브가
 *    기록한 위치를 쓴다. 결과적으로 문장 단위 정확도는 트레이스백과 같다.
 * 2. 안전 실행은 `__builtins__` 교체 대신 `with (Proxy)` 스코프다. 모든 자유
 *    식별자 조회가 프록시를 지나므로 화이트리스트 밖의 이름은 fetch든
 *    XMLHttpRequest든 ReferenceError가 된다 (§3.10).
 */

import { parse } from "acorn";
import { generate } from "astring";

import type {
  AwaitResumeEvent,
  AwaitSuspendEvent,
  BranchTakenEvent,
  BranchTestEvent,
  ClassDefineEvent,
  ErrorCatchEvent,
  ErrorPropagateEvent,
  ErrorThrowEvent,
  ExpressionEvalEvent,
  FramePopEvent,
  FunctionCallEvent,
  FunctionDefineEvent,
  FunctionEnterEvent,
  FunctionReturnEvent,
  HeapAllocEvent,
  HeapModule,
  HeapObject,
  ItemAppendEvent,
  ItemReadEvent,
  ItemRemoveEvent,
  InstanceCreateEvent,
  ItemWriteEvent,
  LineEnterEvent,
  LoopEndEvent,
  LoopIterationEvent,
  LoopStartEvent,
  ModuleImportEvent,
  OutputAppendEvent,
  OutputEntry,
  ParamSpec,
  ParameterBindEvent,
  PrimitiveType,
  PrimitiveValue,
  ProgramEndEvent,
  PromiseStateEvent,
  TaskCompleteEvent,
  TaskCreateEvent,
  TraceDocument,
  TraceEvent,
  TraceSource,
  Value,
  ValueOrigin,
  VariableCreateEvent,
  VariableDeleteEvent,
  VariableUpdateEvent,
} from "../trace/types.ts";

const TRACER = "__trace__";
const SCOPE = "__scope__";

export interface Limits {
  maxEvents: number;
  maxSeconds: number;
  maxTrack: number;
  maxItems: number;
}

export const DEFAULT_LIMITS: Limits = {
  maxEvents: 20000, // §3.10 실행 상한
  maxSeconds: 5,
  maxTrack: 200,
  maxItems: 200,
};

/** 연산자는 실제 연산자로 그대로 넘긴다. 강제 변환 규칙까지 진짜와 같아야 한다. */
type Binary = (a: any, b: any) => any;
const BIN_OPS: Record<string, Binary> = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  "**": (a, b) => a ** b,
  "==": (a, b) => a == b, // eslint-disable-line eqeqeq
  "!=": (a, b) => a != b, // eslint-disable-line eqeqeq
  "===": (a, b) => a === b,
  "!==": (a, b) => a !== b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "&": (a, b) => a & b,
  "|": (a, b) => a | b,
  "^": (a, b) => a ^ b,
  "<<": (a, b) => a << b,
  ">>": (a, b) => a >> b,
  ">>>": (a, b) => a >>> b,
  in: (a, b) => a in b,
  instanceof: (a, b) => a instanceof b,
};

const UNARY_OPS: Record<string, (a: any) => any> = {
  "-": (a) => -a,
  "+": (a) => +a,
  "!": (a) => !a,
  "~": (a) => ~a,
  typeof: (a) => typeof a,
};

/** §3.4의 힙 그림이 바뀌는 배열 메서드 */
const MUTATORS = new Set(["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill", "add", "delete", "set", "clear"]);

export class TraceLimit extends Error {}

// ─────────────────────────────────────────────────────────────
// 결정적 이벤트 루프 (J21~J23)
// ─────────────────────────────────────────────────────────────

/**
 * 비동기를 눈으로 보려면 실행이 **결정적**이어야 한다.
 *
 * 진짜 타이머와 진짜 microtask 큐를 쓰면 트레이스가 실행할 때마다 달라질 수
 * 있고, 무엇보다 `traceSource`가 동기 함수라 프로그램이 끝나기 전에 돌아와
 * 버린다. 그래서 큐를 직접 들고 마지막에 한 번에 비운다. 시계도 가상이라
 * `setTimeout(fn, 1000)`이 실제로 1초를 기다리지 않는다.
 *
 * 순서 규칙은 진짜 엔진과 같다. microtask를 먼저 전부 비우고, 그다음 가장
 * 이른 타이머 하나를 돌린다. 같은 시각이면 등록 순서를 따른다. 이 규칙이
 * 맞는지는 빌드가 매번 검사한다 — 계측 실행과 진짜 node 실행의 출력을
 * 대조하기 때문이다.
 */
class Scheduler {
  private micro: (() => void)[] = [];
  private timers: { at: number; seq: number; fn: () => void }[] = [];
  private clock = 0;
  private seq = 0;

  queueMicro(fn: () => void): void {
    this.micro.push(fn);
  }

  setTimer(fn: () => void, ms: unknown): number {
    const delay = Number(ms);
    this.seq += 1;
    this.timers.push({ at: this.clock + (Number.isFinite(delay) ? Math.max(0, delay) : 0), seq: this.seq, fn });
    return this.seq;
  }

  clearTimer(id: unknown): void {
    const at = this.timers.findIndex((timer) => timer.seq === id);
    if (at >= 0) this.timers.splice(at, 1);
  }

  /** 큐가 빌 때까지 돌린다. `guard`가 상한 검사를 던져 무한 루프를 끊는다. */
  drain(guard: () => void): void {
    for (;;) {
      while (this.micro.length > 0) {
        guard();
        this.micro.shift()!();
      }
      if (this.timers.length === 0) return;
      this.timers.sort((a, b) => a.at - b.at || a.seq - b.seq);
      const timer = this.timers.shift()!;
      this.clock = Math.max(this.clock, timer.at);
      guard();
      timer.fn();
    }
  }
}

type Settle = (value: unknown) => void;

/**
 * 이 스케줄러 위에서 도는 Promise.
 *
 * 진짜 Promise를 쓸 수 없는 이유는 하나다. 진짜 `.then`은 진짜 microtask 큐에
 * 콜백을 넣고, 그 큐는 `traceSource`가 돌아간 **뒤에야** 돈다. 그러면 트레이스에
 * 비동기 부분이 통째로 빠진다. 규칙(상태는 한 번만 정해진다, then은 언제나
 * 다음 microtask에서 돈다)은 그대로 따른다.
 */
class TinyPromise {
  state: "pending" | "fulfilled" | "rejected" = "pending";
  value: unknown = undefined;
  /** 추적 중인 작업이면 id가 붙는다. 붙은 것만 화면의 작업 목록에 나온다. */
  taskId?: string;
  private handlers: { onOk?: Settle; onErr?: Settle }[] = [];
  // 파라미터 프로퍼티는 Node의 타입 제거 전용 모드가 다루지 못한다.
  private readonly scheduler: Scheduler;

  constructor(scheduler: Scheduler, executor?: (resolve: Settle, reject: Settle) => void) {
    this.scheduler = scheduler;
    if (!executor) return;
    try {
      executor(
        (value) => this.settle("fulfilled", value),
        (reason) => this.settle("rejected", reason),
      );
    } catch (error) {
      this.settle("rejected", error);
    }
  }

  /** 상태는 한 번만 정해진다. 두 번째 resolve는 조용히 무시된다. */
  settle(state: "fulfilled" | "rejected", value: unknown): void {
    if (this.state !== "pending") return;
    // resolve(promise)는 그 promise를 따라간다
    if (state === "fulfilled" && value instanceof TinyPromise) {
      value.subscribe(
        (inner) => this.settle("fulfilled", inner),
        (inner) => this.settle("rejected", inner),
      );
      return;
    }
    this.state = state;
    this.value = value;
    this.onSettled?.(state, value);
    const handlers = this.handlers;
    this.handlers = [];
    for (const handler of handlers) this.dispatch(handler);
  }

  /** Recorder가 PROMISE_STATE를 낼 자리 */
  onSettled?: (state: "fulfilled" | "rejected", value: unknown) => void;

  private dispatch(handler: { onOk?: Settle; onErr?: Settle }): void {
    this.scheduler.queueMicro(() => {
      if (this.state === "fulfilled") handler.onOk?.(this.value);
      else handler.onErr?.(this.value);
    });
  }

  private subscribe(onOk?: Settle, onErr?: Settle): void {
    if (this.state === "pending") this.handlers.push({ onOk, onErr });
    else this.dispatch({ onOk, onErr });
  }

  then(onOk?: (v: unknown) => unknown, onErr?: (e: unknown) => unknown): TinyPromise {
    const next = new TinyPromise(this.scheduler);
    this.subscribe(
      (value) => {
        try {
          next.settle("fulfilled", onOk ? onOk(value) : value);
        } catch (error) {
          next.settle("rejected", error);
        }
      },
      (reason) => {
        if (!onErr) {
          next.settle("rejected", reason);
          return;
        }
        try {
          next.settle("fulfilled", onErr(reason));
        } catch (error) {
          next.settle("rejected", error);
        }
      },
    );
    return next;
  }

  catch(onErr: (e: unknown) => unknown): TinyPromise {
    return this.then(undefined, onErr);
  }

  finally(fn: () => void): TinyPromise {
    return this.then(
      (value) => {
        fn();
        return value;
      },
      (reason) => {
        fn();
        throw reason;
      },
    );
  }
}

/** 안전 스코프에 놓이는 Promise. 정적 메서드까지 같은 스케줄러 위에 있어야 한다. */
function promiseClass(scheduler: Scheduler, onNew: (p: TinyPromise) => void) {
  const wrap = (value: unknown): TinyPromise => {
    if (value instanceof TinyPromise) return value;
    const promise = new TinyPromise(scheduler);
    promise.settle("fulfilled", value);
    return promise;
  };

  class ScopedPromise extends TinyPromise {
    constructor(executor: (resolve: Settle, reject: Settle) => void) {
      super(scheduler, executor);
      onNew(this);
    }

    static resolve(value: unknown): TinyPromise {
      return wrap(value);
    }

    static reject(reason: unknown): TinyPromise {
      const promise = new TinyPromise(scheduler);
      promise.settle("rejected", reason);
      return promise;
    }

    static all(list: Iterable<unknown>): TinyPromise {
      const items = [...list];
      const result = new TinyPromise(scheduler);
      const values: unknown[] = new Array(items.length);
      let left = items.length;
      if (left === 0) result.settle("fulfilled", []);
      items.forEach((item, index) => {
        wrap(item).then(
          (value) => {
            values[index] = value;
            left -= 1;
            if (left === 0) result.settle("fulfilled", values);
          },
          (reason) => result.settle("rejected", reason),
        );
      });
      return result;
    }

    static allSettled(list: Iterable<unknown>): TinyPromise {
      const items = [...list];
      const result = new TinyPromise(scheduler);
      const values: unknown[] = new Array(items.length);
      let left = items.length;
      if (left === 0) result.settle("fulfilled", []);
      items.forEach((item, index) => {
        wrap(item).then(
          (value) => {
            values[index] = { status: "fulfilled", value };
            left -= 1;
            if (left === 0) result.settle("fulfilled", values);
          },
          (reason) => {
            values[index] = { status: "rejected", reason };
            left -= 1;
            if (left === 0) result.settle("fulfilled", values);
          },
        );
      });
      return result;
    }

    static race(list: Iterable<unknown>): TinyPromise {
      const result = new TinyPromise(scheduler);
      for (const item of list) {
        wrap(item).then(
          (value) => result.settle("fulfilled", value),
          (reason) => result.settle("rejected", reason),
        );
      }
      return result;
    }
  }

  return ScopedPromise;
}

// ─────────────────────────────────────────────────────────────
// 안전 스코프
// ─────────────────────────────────────────────────────────────

/**
 * 화이트리스트. 여기 없는 이름은 ReferenceError가 난다.
 *
 * Math.random과 Date가 빠져 있는 것은 실수가 아니다. 골든 트레이스는 매
 * 빌드에서 같아야 검증이 성립하므로, 비결정적인 API는 애초에 닿을 수 없다.
 */
function safeGlobals(scheduler: Scheduler, onNewPromise: (p: TinyPromise) => void): Record<string, unknown> {
  const math: Record<string, unknown> = {};
  for (const key of Object.getOwnPropertyNames(Math)) {
    if (key === "random") continue;
    math[key] = (Math as unknown as Record<string, unknown>)[key];
  }

  const refuse = (name: string) => () => {
    throw new Error(`console.${name}는 호출 위치를 알 수 없어 지원하지 않습니다. console.log(...)를 직접 쓰세요.`);
  };
  const console = new Proxy({}, { get: (_t, key) => refuse(String(key)) });

  return {
    Math: Object.freeze(math),
    Number, String, Boolean, Array, Object, JSON, Symbol, Map, Set,
    Error, TypeError, RangeError, ReferenceError, SyntaxError,
    isNaN, isFinite, parseInt, parseFloat,
    NaN, Infinity, undefined,
    console,
    // 비동기 (J21~J23). 진짜가 아니라 이 트레이서의 결정적 큐 위에서 돈다.
    Promise: promiseClass(scheduler, onNewPromise),
    setTimeout: (fn: () => void, ms?: unknown) => scheduler.setTimer(fn, ms),
    clearTimeout: (id: unknown) => scheduler.clearTimer(id),
    queueMicrotask: (fn: () => void) => scheduler.queueMicro(fn),
  };
}

/**
 * `with`가 모든 자유 식별자를 이 프록시에서 찾게 만든다.
 * `has`가 항상 true이므로 바깥 스코프(전역, 워커의 fetch 등)로 새 나가지 않는다.
 */
function safeScope(recorder: Recorder): Record<string, unknown> {
  const table = safeGlobals(recorder.scheduler, (promise) => recorder.trackPromise(promise, "new Promise"));
  table[TRACER] = recorder;
  return new Proxy(table, {
    has: () => true,
    get(target, key) {
      if (key === Symbol.unscopables) return undefined;
      if (key in target) return target[key as string];
      throw new ReferenceError(`${String(key)} is not defined`);
    },
    set(target, key, value) {
      target[key as string] = value;
      return true;
    },
  });
}

// ─────────────────────────────────────────────────────────────
// 값 인코딩
// ─────────────────────────────────────────────────────────────

const prim = (type: PrimitiveType, repr: string): PrimitiveValue => ({ kind: "primitive", type, repr });

export interface Static {
  line: number;
  col?: number;
  endCol?: number;
  text?: string;
  op?: string;
  fn?: Binary;
  unary?: (a: any) => any;
  emit?: boolean;
  core?: boolean;
  names?: string[];
  origin?: ValueOrigin;
  name?: string;
  params?: ParamSpec[];
  callee?: string;
  argNames?: (string | null)[];
  method?: string;
  loopId?: string;
  parentLoop?: string;
  sourceLabel?: string;
  thenLine?: number;
  elseLine?: number;
  thenLabel?: string;
  elseLabel?: string;
  texts?: string[];
  stream?: OutputEntry["stream"];
  declare?: boolean;
  /** class 설계도 카드에 적을 method 목록과 초기 상태 규칙 (§P21 §10-1) */
  methods?: { name: string; params: string[] }[];
  initRule?: string[];
  /** 이 정적 정보가 어느 파일에서 왔는가. 여러 파일이 도는 레슨에서만 찬다. */
  src?: string;
  /** async 함수인가. 프레임 정리를 드라이버가 맡는다 (§J22). */
  isAsync?: boolean;
  /** import 문장 정보 (§J19) */
  module?: string;
  binds?: string[];
  importKind?: "named" | "namespace";
}

interface FrameRecord {
  id: string;
  name: string;
  callLine: number | null;
  bindings: Map<string, Value>;
  returned: boolean;
  line: number;
  /** 호출부 프로브가 없는 프레임(빌트인이 부른 콜백)은 스스로 정리한다. */
  selfPop?: boolean;
  /** 이 프레임의 코드가 있는 파일. main이면 비어 있다. */
  source?: string;
}

// ─────────────────────────────────────────────────────────────
// Recorder — 계측 코드가 `__trace__`라는 이름으로 부르는 객체
// ─────────────────────────────────────────────────────────────

export class Recorder {
  readonly events: TraceEvent[] = [];
  truncated = false;
  /** 계측 실행이 낸 stdout. 계측 없는 실행과 같아야 한다 (빌드에서 대조). */
  readonly stdout: string[] = [];

  private readonly t0 = Date.now();
  private frames: FrameRecord[] = [
    { id: "global", name: "global", callLine: null, bindings: new Map(), returned: true, line: 1 },
  ];
  private callCounts = new Map<string, number>();
  private loopIndex = new Map<string, number>();
  private loopEnded = new Set<string>();

  // 힙: 객체 identity → HeapId. Map이 강한 참조를 쥐고 있으므로 같은 객체가
  // 항상 같은 칸을 쓴다.
  private heapIds = new Map<object, string>();
  private heapSnapshots = new Map<string, string>();
  private heapSeq = 0;
  private expanding = new Set<object>();

  private pendingCall: {
    frameId: string; name: string; number: number; returnLine: number;
    parent: string; froms: (string | undefined)[];
  } | null = null;
  private lastPopped: string | null = null;
  /** 이미 실행한 module의 namespace. 두 번째 import는 최상위 코드를 다시 돌지 않는다. */
  private modules = new Map<string, Record<string, unknown>>();
  /** 아직 실행하지 않은 module의 계측된 소스. traceSource가 채운다. */
  moduleSources = new Map<string, { source: string; path: string; exports: string[] }>();
  private pendingSub: [string, string] | null = null;
  private reportedErrors = new Set<unknown>();

  private readonly statics: Static[];
  private readonly limits: Limits;
  /** module 파일도 같은 안전 스코프에서 돈다. traceSource가 넣어 준다. */
  scope: unknown = null;
  /** 비동기 실행의 결정적 큐 (J21~J23) */
  readonly scheduler = new Scheduler();
  /** await에서 멈춘 프레임. 깨어날 때 다시 스택에 올린다. */
  private suspended = new Map<string, FrameRecord>();
  private lastSuspended: string | null = null;
  private taskSeq = 0;
  /**
   * 계측한 함수의 이름과 매개변수.
   *
   * 함수 값이 힙에서 참조되는데 카드가 없으면 화면에 "가리키는 대상이 없는
   * 참조"가 남는다. `return function check(...)`처럼 선언이 아닌 자리에서
   * 만들어진 함수가 그렇다. 정의 시점에 여기 적어 두고 필요할 때 카드를 만든다.
   */
  private fnMeta = new WeakMap<object, { name: string; params: ParamSpec[]; line: number }>();

  // 파라미터 프로퍼티는 Node의 타입 제거 전용 모드가 다루지 못한다.
  constructor(statics: Static[], limits: Limits) {
    this.statics = statics;
    this.limits = limits;
  }

  // ── 이벤트 ──────────────────────────────────────────────────

  private emit<T extends TraceEvent>(event: Omit<T, "step">): T {
    if (this.events.length >= this.limits.maxEvents) {
      this.truncated = true;
      throw new TraceLimit("이벤트 상한");
    }
    if (Date.now() - this.t0 > this.limits.maxSeconds * 1000) {
      this.truncated = true;
      throw new TraceLimit("시간 상한");
    }
    const full = { ...event, step: this.events.length + 1 } as T;
    this.events.push(full);
    return full;
  }

  /** 이벤트 공통 필드. frame을 주지 않으면 현재 프레임. */
  private at(line: number, detail: "core" | "expression" = "expression", frame?: string) {
    const top = this.frames[this.frames.length - 1]!;
    return {
      line, detail, frameId: frame ?? top.id,
      // 여러 파일이 도는 레슨에서 하이라이트가 엉뚱한 파일을 가리키지 않도록,
      // 이벤트마다 그 코드가 있는 파일을 들고 다닌다 (§J19 §10-2).
      ...(top.source ? { source: top.source } : {}),
    };
  }

  private span(st: Static) {
    if (st.col === undefined) return undefined;
    return { startCol: st.col, endCol: st.endCol ?? st.col };
  }

  private get top(): FrameRecord {
    return this.frames[this.frames.length - 1]!;
  }

  /** 마지막 `line` 프로브가 기록한 위치. 계측 밖에서 잡은 오류의 줄 번호가 된다. */
  get currentLine(): number {
    return this.top.line;
  }

  // ── 값 ──────────────────────────────────────────────────────

  value(obj: unknown): Value {
    if (obj === undefined) return prim("undefined", "undefined");
    if (obj === null) return prim("null", "null");
    switch (typeof obj) {
      case "boolean":
        return prim("bool", obj ? "true" : "false");
      case "number":
        if (Number.isNaN(obj)) return prim("nan", "NaN");
        // JS는 수 타입이 하나지만 화면에서는 정수/실수를 구분해 보여 준다.
        return Number.isInteger(obj) ? prim("int", numberRepr(obj)) : prim("float", numberRepr(obj));
      case "bigint":
        return prim("bigint", `${obj}n`);
      case "string":
        return prim("str", quote(obj));
      case "symbol":
        return prim("str", String(obj));
      case "function":
      case "object":
        return { kind: "ref", id: this.heap(obj as object) };
      default:
        return prim("str", String(obj));
    }
  }

  private heap(obj: object): string {
    let id = this.heapIds.get(obj);
    if (id === undefined) {
      id = this.newHeapId(obj);
      this.heapIds.set(obj, id);
    }
    this.sync(id, obj);
    return id;
  }

  private newHeapId(obj: object): string {
    if (typeof obj === "function") return `fn:${(obj as { name?: string }).name || "anonymous"}`;
    this.heapSeq += 1;
    // 안전 스코프의 Promise는 내부 클래스 이름을 갖는다. 화면에는 학습자가
    // 코드에 적은 이름이 보여야 한다.
    if (obj instanceof TinyPromise) return `Promise@${this.heapSeq}`;
    return `${obj.constructor?.name ?? "Object"}@${this.heapSeq}`;
  }

  /**
   * 힙 객체의 현재 내용을 스냅샷과 비교해 달라졌으면 HEAP_ALLOC을 다시 낸다.
   * 모든 변형을 계측하는 대신 값을 읽을 때 맞춰 넣으므로, 계측하지 못한
   * 변형이 있어도 화면의 힙이 조용히 틀리는 일이 없다.
   */
  private sync(id: string, obj: object): void {
    if (this.expanding.has(obj)) return;
    this.expanding.add(obj);
    let snapshot: HeapObject | null;
    try {
      snapshot = this.describe(id, obj);
    } finally {
      this.expanding.delete(obj);
    }
    if (!snapshot) return;
    const serialized = JSON.stringify(snapshot);
    if (this.heapSnapshots.get(id) === serialized) return;
    this.heapSnapshots.set(id, serialized);
    this.emit<HeapAllocEvent>({ type: "HEAP_ALLOC", ...this.at(this.top.line), object: snapshot });
  }

  private describe(id: string, obj: object): HeapObject | null {
    const cap = this.limits.maxItems;
    if (typeof obj === "function") {
      // 선언에는 FUNCTION_DEFINE이 카드를 만든다. 그 밖의 자리에서 만들어진
      // 함수는 여기서 처음 카드를 얻는다.
      const meta = this.fnMeta.get(obj);
      if (!meta) return null;
      return { kind: "function", id, name: meta.name, params: meta.params, defLine: meta.line };
    }
    // Promise는 안쪽이 아니라 **상태**를 보여 줘야 한다 (§J21 §5).
    if (obj instanceof TinyPromise)
      return {
        kind: "mapping", id, label: "instance", className: "Promise",
        entries: [
          { key: "상태", value: prim("str", obj.state) },
          ...(obj.state === "pending" ? [] : [{ key: "값", value: this.value(obj.value) }]),
        ],
      };
    if (Array.isArray(obj))
      return { kind: "sequence", id, label: "array", items: obj.slice(0, cap).map((v) => this.value(v)) };
    if (obj instanceof Set)
      return { kind: "set", id, items: [...obj].slice(0, cap).map((v) => this.value(v)) };
    if (obj instanceof Map)
      return {
        kind: "mapping", id, label: "object", className: "Map",
        entries: [...obj].slice(0, cap).map(([k, v]) => ({ key: keyText(k), value: this.value(v) })),
      };
    const className = obj.constructor?.name ?? "Object";
    return {
      kind: "mapping", id,
      label: className === "Object" ? "object" : "instance",
      ...(className === "Object" ? {} : { className }),
      entries: Object.entries(obj).slice(0, cap).map(([k, v]) => ({ key: k, value: this.value(v) })),
    };
  }

  show(obj: unknown): string {
    const v = this.value(obj);
    return v.kind === "primitive" ? v.repr : this.label(v.id);
  }

  private label(id: string): string {
    const raw = this.heapSnapshots.get(id);
    if (!raw) return `<${id}>`;
    const snap = JSON.parse(raw) as HeapObject;
    const repr = (v: Value) => (v.kind === "primitive" ? v.repr : "…");
    if (snap.kind === "sequence") return `[${snap.items.slice(0, 6).map(repr).join(", ")}]`;
    if (snap.kind === "mapping")
      return `{${snap.entries.slice(0, 4).map((e) => `${e.key}: ${repr(e.value)}`).join(", ")}}`;
    if (snap.kind === "set") return `Set(${snap.items.length})`;
    return `<${id}>`;
  }

  private bind(frame: FrameRecord, name: string, value: Value): Value | undefined {
    const before = frame.bindings.get(name);
    frame.bindings.set(name, value);
    return before;
  }

  // ───────────────────────────────────────────────────────────
  // 프로브 (계측 코드가 호출하는 지점)
  // ───────────────────────────────────────────────────────────

  line(sid: number): void {
    const st = this.statics[sid]!;
    this.top.line = st.line;
    this.emit<LineEnterEvent>({ type: "LINE_ENTER", ...this.at(st.line), span: this.span(st) });
  }

  /** 함수 값의 이름·매개변수를 적어 둔다. 이벤트는 내지 않는다. */
  fnmeta<T>(sid: number, fn: T): T {
    const st = this.statics[sid]!;
    this.fnMeta.set(fn as object, { name: st.name!, params: st.params!, line: st.line });
    return fn;
  }

  define(sid: number, fn: unknown): void {
    const st = this.statics[sid]!;
    this.fnMeta.set(fn as object, { name: st.name!, params: st.params!, line: st.line });
    const heapId = this.heap(fn as object);
    this.emit<FunctionDefineEvent>({
      type: "FUNCTION_DEFINE", ...this.at(st.line, "core"),
      name: st.name!, heapId, params: st.params!, span: this.span(st),
    });
    this.bind(this.top, st.name!, { kind: "ref", id: heapId });
  }

  /**
   * `class Wafer { ... }` — 설계도 카드를 힙에 놓는다.
   *
   * 값이 아니라 **만드는 규칙**이 여기 있다는 것이 J20의 요점이라, instance
   * 카드와 다른 모양으로 그려져야 한다. 그래서 함수가 아니라 class 종류의
   * 힙 객체로 등록한다.
   */
  class_(sid: number, ctor: unknown): void {
    const st = this.statics[sid]!;
    const heapId = `class:${st.name}`;
    const snapshot: HeapObject = {
      kind: "class", id: heapId, name: st.name!,
      methods: st.methods!, attributes: [],
      ...(st.initRule?.length ? { initRule: st.initRule } : {}),
    };
    // 설계도는 함수 객체이기도 하다. describe가 함수를 건너뛰므로 카드를
    // 여기서 직접 넣어 둔다. 이후 heap()은 같은 id를 돌려준다.
    this.heapIds.set(ctor as object, heapId);
    this.heapSnapshots.set(heapId, JSON.stringify(snapshot));
    this.emit<HeapAllocEvent>({ type: "HEAP_ALLOC", ...this.at(st.line), object: snapshot });
    this.emit<ClassDefineEvent>({
      type: "CLASS_DEFINE", ...this.at(st.line, "core"),
      name: st.name!, heapId, methods: st.methods!.map((m) => m.name), span: this.span(st),
    });
    this.bind(this.top, st.name!, { kind: "ref", id: heapId });
  }

  /**
   * `new Wafer("W01", 94.2)` — 설계도를 불러 실물을 만든다.
   *
   * 프레임 관리는 call()과 같다. 다른 것은 만들어진 instance가 어느 설계도에서
   * 나왔는지를 잇는 INSTANCE_CREATE 한 줄이다.
   */
  construct(sid: number, ctor: any, ...args: unknown[]): unknown {
    const st = this.statics[sid]!;
    const name = st.callee!;
    const number = (this.callCounts.get(name) ?? 0) + 1;
    this.callCounts.set(name, number);
    const frameId = `${name}#${number}`;
    const caller = this.top.id;

    this.emit<FunctionCallEvent>({
      type: "FUNCTION_CALL", ...this.at(st.line, "core"),
      callee: `new ${name}`, substituted: `new ${name}(${args.map((a) => this.show(a)).join(", ")})`,
      args: args.map((a) => ({ value: this.value(a) })),
      targetFrameId: frameId, span: this.span(st),
    });

    this.pendingCall = { frameId, name, number, returnLine: st.line, parent: caller, froms: [] };
    const depth = this.frames.length;
    let instance: unknown;
    try {
      instance = new ctor(...args);
    } catch (exc) {
      if (exc instanceof TraceLimit) throw exc;
      this.pendingCall = null;
      this.thrownAt(exc, this.top.line || st.line);
      if (this.frames.length > depth) {
        const frame = this.frames.pop()!;
        this.lastPopped = frame.id;
        this.emit<ErrorPropagateEvent>({
          type: "ERROR_PROPAGATE", ...this.at(frame.line, "expression", frame.id),
          fromFrameId: frame.id, toFrameId: this.top.id,
        });
        this.emit<FramePopEvent>({ type: "FRAME_POP", ...this.at(st.line), poppedFrameId: frame.id });
      }
      throw exc;
    }
    this.pendingCall = null;

    const value = this.value(instance);
    if (this.frames.length > depth) {
      const frame = this.top;
      if (!frame.returned) {
        this.emit<FunctionReturnEvent>({
          type: "FUNCTION_RETURN", ...this.at(frame.line),
          value, toLine: frame.callLine ?? st.line,
        });
      }
      this.frames.pop();
      this.lastPopped = frame.id;
      this.emit<FramePopEvent>({ type: "FRAME_POP", ...this.at(st.line), poppedFrameId: frame.id });
    }
    if (value.kind === "ref") {
      this.emit<InstanceCreateEvent>({
        type: "INSTANCE_CREATE", ...this.at(st.line),
        heapId: value.id, className: name, classHeapId: `class:${name}`,
      });
    }
    return instance;
  }

  /**
   * `import { parseValue } from "./utils.js"` 를 대신한다.
   *
   * 진짜 ESM 로더를 열지 않는 이유는 §P20과 같다. 무엇이든 들어올 수 있게
   * 되는 것도 문제지만, 그보다 **module의 최상위 코드가 자기 프레임에서
   * 도는 장면**을 만들 수 없다. 그 실행 순서가 이 레슨의 내용 그 자체다.
   */
  import_(sid: number): Record<string, unknown> {
    const st = this.statics[sid]!;
    const name = st.module!;
    const cached = this.modules.has(name);
    const namespace = this.loadModule(name, st.line);
    const heapId = this.moduleCard(name, namespace);

    this.emit<ModuleImportEvent>({
      type: "MODULE_IMPORT", ...this.at(st.line, "core"),
      module: name, heapId, binds: st.binds!,
      ...(st.importKind === "named" ? { names: st.binds! } : {}),
      cached, span: this.span(st),
    });

    const frame = this.top;
    const origin: ValueOrigin = { kind: "import", label: name };
    for (const bind of st.binds!) {
      const value = this.value(st.importKind === "namespace" ? namespace : namespace[bind]);
      const before = this.bind(frame, bind, value);
      if (before === undefined) {
        this.emit<VariableCreateEvent>({
          type: "VARIABLE_CREATE", ...this.at(st.line), name: bind, value, origin,
        });
      } else {
        this.emit<VariableUpdateEvent>({
          type: "VARIABLE_UPDATE", ...this.at(st.line), name: bind, before, after: value, origin,
        });
      }
    }
    return namespace;
  }

  /** module namespace 카드. 이름이 가리키는 것은 함수의 사본이 아니라 이 카드다. */
  private moduleCard(name: string, namespace: Record<string, unknown>): string {
    const id = `module:${name}`;
    const snapshot: HeapModule = {
      kind: "module", id, name,
      names: Object.keys(namespace).map((key) => ({ key, value: this.value(namespace[key]) })),
    };
    const serialized = JSON.stringify(snapshot);
    if (this.heapSnapshots.get(id) !== serialized) {
      this.heapSnapshots.set(id, serialized);
      this.emit<HeapAllocEvent>({ type: "HEAP_ALLOC", ...this.at(this.top.line), object: snapshot });
    }
    return id;
  }

  /** module의 최상위 코드를 자기 프레임에서 실행한다 (§J19 §9 Step 1). */
  private loadModule(name: string, line: number): Record<string, unknown> {
    const done = this.modules.get(name);
    if (done) return done;
    const entry = this.moduleSources.get(name);
    if (!entry) throw new Error(`이 사이트에서 열 수 있는 모듈이 아닙니다: '${name}'`);

    const frameId = `module:${name}`;
    const parent = this.top.id;
    // 프레임을 먼저 쌓아야 이 뒤의 이벤트가 module 파일의 줄로 기록된다
    this.frames.push({
      id: frameId, name, callLine: line, bindings: new Map(),
      returned: true, line: 1, source: entry.path,
    });
    this.emit<FunctionEnterEvent>({
      type: "FUNCTION_ENTER", ...this.at(1, "core", frameId),
      kind: "module", name, callNumber: 1, parentFrameId: parent, returnLine: line,
    });

    let namespace: Record<string, unknown>;
    try {
      const run = new Function(
        SCOPE,
        `with (${SCOPE}) {\n${entry.source}\nreturn { ${entry.exports.join(", ")} };\n}`,
      ) as (scope: unknown) => Record<string, unknown>;
      namespace = run(this.scope);
    } finally {
      this.frames.pop();
      this.lastPopped = frameId;
    }
    this.emit<FramePopEvent>({ type: "FRAME_POP", ...this.at(line), poppedFrameId: frameId });
    this.modules.set(name, namespace);
    return namespace;
  }

  // ── 비동기 (J21~J23) ────────────────────────────────────────

  /** 화면의 작업 목록에 올릴 promise. 내부에서 생기는 중간 promise는 올리지 않는다. */
  trackPromise(promise: TinyPromise, label: string, line = this.top.line): string {
    if (promise.taskId) return promise.taskId;
    this.taskSeq += 1;
    const taskId = `task${this.taskSeq}`;
    promise.taskId = taskId;
    this.emit<TaskCreateEvent>({ type: "TASK_CREATE", ...this.at(line, "core"), taskId, label });
    this.emit<PromiseStateEvent>({ type: "PROMISE_STATE", ...this.at(line), taskId, state: "pending" });
    promise.onSettled = (state, value) => {
      this.emit<PromiseStateEvent>({
        type: "PROMISE_STATE", ...this.at(this.top.line, "core"),
        taskId, state, value: this.value(value),
      });
      // 힙에 카드가 이미 있으면 내용을 맞춰 준다. 그러지 않으면 작업 목록은
      // "완료"인데 카드는 "pending"인 채로 남는다.
      const heapId = this.heapIds.get(promise);
      if (heapId) this.sync(heapId, promise);
      this.emit<TaskCompleteEvent>({ type: "TASK_COMPLETE", ...this.at(this.top.line), taskId });
    };
    return taskId;
  }

  /**
   * `async function f() {...}` 를 감싼다.
   *
   * 계측기가 async 함수를 generator로 바꿔 두었다. 여기서 그 generator를
   * 돌리며 `yield`(= 원래의 `await`)마다 결과를 기다렸다 다시 넣어 준다.
   * 진짜 엔진이 하는 일과 같은 일을 우리 큐 위에서 하는 것이다.
   */
  asyncfn(sid: number, generator: (...args: unknown[]) => Iterator<unknown>): (...args: unknown[]) => TinyPromise {
    const st = this.statics[sid]!;
    const recorder = this;
    const wrapped = function (this: unknown, ...args: unknown[]): TinyPromise {
      const result = new TinyPromise(recorder.scheduler);
      recorder.trackPromise(result, `${st.name}()`, st.line);
      const iterator = generator.apply(this, args);

      const step = (input: unknown, thrown: boolean): void => {
        let outcome: IteratorResult<unknown>;
        try {
          outcome = thrown ? iterator.throw!(input) : iterator.next(input);
        } catch (error) {
          if (error instanceof TraceLimit) throw error;
          result.settle("rejected", error);
          return;
        }
        if (outcome.done) {
          result.settle("fulfilled", outcome.value);
          return;
        }
        // yield된 값이 곧 await한 값이다. 그것이 정해지면 프레임을 다시 올린다.
        const frameId = recorder.lastSuspended;
        const awaited = outcome.value;
        const settled = awaited instanceof TinyPromise
          ? awaited
          : (() => {
              const p = new TinyPromise(recorder.scheduler);
              p.settle("fulfilled", awaited);
              return p;
            })();
        settled.then(
          (value) => {
            recorder.wake(frameId, value, awaited);
            step(value, false);
          },
          (reason) => {
            recorder.wake(frameId, reason, awaited);
            step(reason, true);
          },
        );
      };

      step(undefined, false);
      return result;
    };
    Object.defineProperty(wrapped, "name", { value: st.name });
    return wrapped;
  }

  /** `await X` — 여기서 프레임이 스택을 떠난다. 다른 코드가 그 사이에 돈다. */
  await_<T>(sid: number, value: T): T {
    const st = this.statics[sid]!;
    const frame = this.top;
    frame.line = st.line;
    this.emit<AwaitSuspendEvent>({
      type: "AWAIT_SUSPEND", ...this.at(st.line, "core"),
      taskId: value instanceof TinyPromise ? this.trackPromise(value, "await", st.line) : "즉시",
    });
    this.frames.pop();
    this.suspended.set(frame.id, frame);
    this.lastSuspended = frame.id;
    return value;
  }

  /** 기다리던 값이 정해졌다. 멈춰 있던 프레임을 다시 스택에 올린다. */
  private wake(frameId: string | null, value: unknown, awaited: unknown): void {
    const frame = frameId ? this.suspended.get(frameId) : undefined;
    if (frame) {
      this.frames.push(frame);
      this.suspended.delete(frameId!);
    }
    this.emit<AwaitResumeEvent>({
      type: "AWAIT_RESUME", ...this.at(frame?.line ?? this.top.line, "core"),
      taskId: awaited instanceof TinyPromise ? (awaited.taskId ?? "즉시") : "즉시",
      value: this.value(value),
    });
  }

  /**
   * 이벤트 루프가 콜백을 부르는 중인가.
   *
   * 그때는 "호출한 줄"이 사용자 코드에 없다. 타이머 콜백의 호출 줄을 global의
   * 마지막 줄로 적으면 엉뚱한 곳이 강조된다.
   */
  draining = false;

  /** 큐를 비운다. 프로그램의 동기 부분이 끝난 뒤에 부른다. */
  runQueue(): void {
    this.draining = true;
    this.scheduler.drain(() => {
      if (this.events.length >= this.limits.maxEvents) {
        this.truncated = true;
        throw new TraceLimit("이벤트 상한");
      }
      if (Date.now() - this.t0 > this.limits.maxSeconds * 1000) {
        this.truncated = true;
        throw new TraceLimit("시간 상한");
      }
    });
  }

  arg<T>(sid: number, value: T): T {
    const st = this.statics[sid]!;
    this.emit<ExpressionEvalEvent>({
      type: "EXPRESSION_EVAL", ...this.at(st.line),
      expression: st.text!, result: this.value(value), span: this.span(st),
    });
    return value;
  }

  call(sid: number, fn: (...a: unknown[]) => unknown, ...args: unknown[]): unknown {
    const st = this.statics[sid]!;
    const name = fn?.name || st.callee!;
    const number = (this.callCounts.get(name) ?? 0) + 1;
    this.callCounts.set(name, number);
    const frameId = `${name}#${number}`;

    const caller = this.top.id;
    const origins = st.argNames ?? [];
    const argSpecs = args.map((a, i) => {
      const from = origins[i];
      return { value: this.value(a), ...(from ? { from: `${caller}.${from}` } : {}) };
    });

    this.emit<FunctionCallEvent>({
      type: "FUNCTION_CALL", ...this.at(st.line, "core"),
      callee: st.callee!, substituted: `${st.callee}(${args.map((a) => this.show(a)).join(", ")})`,
      args: argSpecs, targetFrameId: frameId, span: this.span(st),
    });

    this.pendingCall = {
      frameId, name, number, returnLine: st.line, parent: caller,
      froms: argSpecs.map((spec) => spec.from),
    };

    const depth = this.frames.length;
    let result: unknown;
    try {
      result = fn(...args);
    } catch (exc) {
      if (exc instanceof TraceLimit) throw exc;
      // 예외로 빠져나가는 길은 정상 반환과 다르다. 반환값도, 복귀도 없다.
      // §3.9 "호출 스택을 거슬러 올라가는 오류 경로"가 여기서 만들어진다.
      this.pendingCall = null;
      this.thrownAt(exc, this.top.line || st.line);
      if (this.frames.length > depth) {
        const frame = this.frames.pop()!;
        this.lastPopped = frame.id;
        this.emit<ErrorPropagateEvent>({
          type: "ERROR_PROPAGATE", ...this.at(frame.line, "expression", frame.id),
          fromFrameId: frame.id, toFrameId: this.top.id,
        });
        this.emit<FramePopEvent>({ type: "FRAME_POP", ...this.at(st.line), poppedFrameId: frame.id });
      }
      throw exc;
    }

    this.pendingCall = null;
    if (this.frames.length > depth) {
      const frame = this.top;
      if (!frame.returned) {
        // 명시적 return이 없는 함수도 undefined를 돌려준다 (§3.5)
        this.emit<FunctionReturnEvent>({
          type: "FUNCTION_RETURN", ...this.at(frame.line),
          value: prim("undefined", "undefined"), toLine: frame.callLine ?? st.line,
        });
      }
      this.frames.pop();
      this.lastPopped = frame.id;
      this.emit<FramePopEvent>({ type: "FRAME_POP", ...this.at(st.line), poppedFrameId: frame.id });
    }
    return result;
  }

  /**
   * 함수 몸통의 첫 줄. 프레임이 여기서 생긴다.
   *
   * 호출부 프로브(`call`)를 지나온 호출이면 `pendingCall`에 프레임 정보가
   * 놓여 있다. 그렇지 않은 경우가 **콜백**이다 — `map`이나 `sort`가 부르면
   * 호출식이 사용자 코드에 없으므로 지날 프로브도 없다. 그 사실 자체가
   * J12~J14의 내용이라, 여기서 호출 이벤트를 대신 만들고 프레임에
   * `selfPop` 표시를 남긴다. 정리는 몸통의 `finally`가 한다.
   */
  enter(sid: number, ...values: unknown[]): void {
    const st = this.statics[sid]!;
    let pending = this.pendingCall;
    this.pendingCall = null;
    // async 함수의 프레임은 await에서 스택을 떠났다 돌아온다. 호출부 프로브가
    // 정리할 수 없으므로 언제나 스스로 정리한다 (§J22 §9).
    let selfPop = !!st.isAsync;

    if (!pending) {
      selfPop = true;
      const name = st.name!;
      const number = (this.callCounts.get(name) ?? 0) + 1;
      this.callCounts.set(name, number);
      const frameId = `${name}#${number}`;
      // 호출한 줄은 함수가 **적힌** 줄이 아니라 지금 돌고 있는 줄이다.
      // `values.map(double)`에서 콜백을 부른 자리는 map이 있는 줄이다.
      // 다만 이벤트 루프가 부른 콜백은 호출한 줄이 사용자 코드에 없다.
      const callLine = this.draining && this.top.id === "global" ? st.line : this.top.line;
      this.emit<FunctionCallEvent>({
        type: "FUNCTION_CALL", ...this.at(callLine, "core"),
        callee: name, substituted: `${name}(${values.map((v) => this.show(v)).join(", ")})`,
        args: values.map((v) => ({ value: this.value(v) })),
        targetFrameId: frameId, span: this.span(st),
      });
      pending = { frameId, name, number, returnLine: callLine, parent: this.top.id, froms: [] };
    }

    const parent = pending.parent;
    const frameId = pending.frameId;
    const number = pending.number;
    const returnLine = pending.returnLine;
    const froms = pending.froms;

    // frame: frameId가 중요하다. reducer는 이 값을 **새 프레임의 id**로 쓴다.
    // 프레임을 쌓기 전이라 at()이 호출한 쪽의 파일을 붙인다. 이 이벤트가
    // 가리키는 줄은 **함수가 적힌 파일**이므로 여기서 바로잡는다.
    const enterAt = this.at(st.line, "expression", frameId);
    this.emit<FunctionEnterEvent>({
      type: "FUNCTION_ENTER", ...enterAt,
      ...(st.src ? { source: st.src } : { source: undefined }),
      name: st.name!, callNumber: number, parentFrameId: parent, returnLine,
    });
    const frame: FrameRecord = {
      id: frameId, name: st.name!, callLine: returnLine,
      bindings: new Map(), returned: false, line: st.line, selfPop,
      ...(st.src ? { source: st.src } : {}),
    };
    this.frames.push(frame);

    const params = st.params!;
    params.forEach((param, index) => {
      const value = index < values.length ? this.value(values[index]) : prim("undefined", "undefined");
      const from = froms[index];
      // 마지막 바인딩만 core: 프레임 생성 + 인수 연결 전체가 한 단계다.
      this.emit<ParameterBindEvent>({
        type: "PARAMETER_BIND",
        ...this.at(st.line, index === params.length - 1 ? "core" : "expression"),
        name: param.name, value, ...(from ? { from } : {}),
      });
      this.bind(frame, param.name, value);
    });
  }

  /**
   * 함수 몸통을 정상적으로 빠져나갔다. 호출부 프로브가 정리하는 프레임이면
   * 아무것도 하지 않는다 — 두 번 걷어내면 프레임 수지가 맞지 않는다.
   */
  leave(sid: number): void {
    const st = this.statics[sid]!;
    const frame = this.top;
    if (!frame.selfPop) return;
    if (!frame.returned) {
      // 명시적 return이 없는 함수도 undefined를 돌려준다 (§3.5)
      this.emit<FunctionReturnEvent>({
        type: "FUNCTION_RETURN", ...this.at(frame.line),
        value: prim("undefined", "undefined"), toLine: frame.callLine ?? st.line,
      });
    }
    this.frames.pop();
    this.lastPopped = frame.id;
    this.emit<FramePopEvent>({
      type: "FRAME_POP", ...this.at(frame.callLine ?? st.line), poppedFrameId: frame.id,
    });
  }

  /** 예외로 빠져나가는 길. 반환값도 복귀도 없다 (§3.9의 오류 경로). */
  leave_throw(sid: number, exc: unknown): void {
    if (exc instanceof TraceLimit) throw exc;
    const frame = this.top;
    if (!frame.selfPop) return;
    this.thrownAt(exc, frame.line);
    this.frames.pop();
    this.lastPopped = frame.id;
    this.emit<ErrorPropagateEvent>({
      type: "ERROR_PROPAGATE", ...this.at(frame.line, "expression", frame.id),
      fromFrameId: frame.id, toFrameId: this.top.id,
    });
    this.emit<FramePopEvent>({ type: "FRAME_POP", ...this.at(frame.line), poppedFrameId: frame.id });
  }

  ret<T>(sid: number, value: T): T {
    const st = this.statics[sid]!;
    const frame = this.top;
    frame.returned = true;
    this.emit<FunctionReturnEvent>({
      type: "FUNCTION_RETURN", ...this.at(st.line),
      value: this.value(value), toLine: frame.callLine ?? st.line,
    });
    return value;
  }

  assign(sid: number, ...values: unknown[]): void {
    const st = this.statics[sid]!;
    const frame = this.top;
    frame.line = st.line;
    const origin: ValueOrigin = { ...st.origin! };
    if (origin.kind === "return" && this.lastPopped) origin.from = this.lastPopped;

    st.names!.forEach((name, index) => {
      const value = this.value(values[index]);
      const before = this.bind(frame, name, value);
      if (before === undefined) {
        this.emit<VariableCreateEvent>({
          type: "VARIABLE_CREATE", ...this.at(st.line, "core"),
          name, value, origin, span: this.span(st),
        });
      } else {
        this.emit<VariableUpdateEvent>({
          type: "VARIABLE_UPDATE", ...this.at(st.line, "core"),
          name, before, after: value, origin, span: this.span(st),
        });
      }
    });
  }

  /**
   * for 헤더의 `let i = 0`처럼 뒤에 문장을 붙일 수 없는 자리의 선언.
   * 값을 그대로 돌려주면서 VARIABLE_CREATE만 남긴다.
   */
  declare<T>(sid: number, value: T): T {
    const st = this.statics[sid]!;
    const frame = this.top;
    frame.line = st.line;
    const encoded = this.value(value);
    const before = this.bind(frame, st.names![0]!, encoded);
    if (before === undefined) {
      this.emit<VariableCreateEvent>({
        type: "VARIABLE_CREATE", ...this.at(st.line, "core"),
        name: st.names![0]!, value: encoded, origin: st.origin, span: this.span(st),
      });
    } else {
      this.emit<VariableUpdateEvent>({
        type: "VARIABLE_UPDATE", ...this.at(st.line, "core"),
        name: st.names![0]!, before, after: encoded, origin: st.origin, span: this.span(st),
      });
    }
    return value;
  }

  delete(sid: number, name: string): void {
    const st = this.statics[sid]!;
    this.top.bindings.delete(name);
    this.emit<VariableDeleteEvent>({ type: "VARIABLE_DELETE", ...this.at(st.line, "core"), name });
  }

  // ── 표현식 ──────────────────────────────────────────────────

  binop(sid: number, left: unknown, right: unknown): unknown {
    const st = this.statics[sid]!;
    const result = st.fn!(left, right);
    this.recordExpr(st, `${this.show(left)} ${st.op} ${this.show(right)}`, result);
    return result;
  }

  unaryop(sid: number, operand: unknown): unknown {
    const st = this.statics[sid]!;
    const result = st.unary!(operand);
    const gap = st.op === "typeof" ? " " : "";
    this.recordExpr(st, `${st.op}${gap}${this.show(operand)}`, result);
    return result;
  }

  /** 단축 평가를 보존한다 (§P05). 실행되지 않은 항은 `skipped`로 남는다. */
  boolop(sid: number, ...thunks: (() => unknown)[]): unknown {
    const st = this.statics[sid]!;
    const op = st.op!;
    let result: unknown;
    let used = 0;
    for (const thunk of thunks) {
      result = thunk();
      used += 1;
      const stop =
        op === "&&" ? !result : op === "||" ? Boolean(result) : result !== null && result !== undefined;
      if (stop) break;
    }
    const parts = st.texts!.slice(0, used);
    const skipped = st.texts!.slice(used);
    const event = this.emit<ExpressionEvalEvent>({
      type: "EXPRESSION_EVAL", ...this.at(st.line),
      expression: st.text!, substituted: parts.length ? parts.join(` ${op} `) : st.text!,
      result: this.value(result),
    });
    if (skipped.length) {
      event.message =
        `${st.line}번 줄의 \`${st.text}\`에서 앞쪽 결과만으로 값이 정해져 ` +
        `\`${skipped.join("`, `")}\`은 계산하지 않았습니다.`;
    }
    return result;
  }

  private recordExpr(st: Static, substituted: string, result: unknown): void {
    if (!st.emit) {
      // if/while의 조건식이면 BRANCH_TEST가 대신 보여 준다. 중복 방지.
      this.pendingSub = [st.text!, substituted];
      return;
    }
    this.emit<ExpressionEvalEvent>({
      type: "EXPRESSION_EVAL", ...this.at(st.line, st.core ? "core" : "expression"),
      expression: st.text!, substituted, result: this.value(result), span: this.span(st),
    });
  }

  getitem(sid: number, target: any, key: any): unknown {
    const st = this.statics[sid]!;
    const result = target[key];
    const container = this.value(target);
    if (container.kind === "ref") {
      this.emit<ItemReadEvent>({
        type: "ITEM_READ", ...this.at(st.line),
        target: container.id, key: keyText(key), value: this.value(result),
      });
    }
    return result;
  }

  /**
   * `row.value` — 점으로 읽는 속성.
   *
   * 배열의 `length`나 문자열의 method까지 읽기 사건으로 그리면 화면이 의미
   * 없는 줄로 덮인다. §3.4의 칸으로 그려지는 것, 즉 object만 보여 준다.
   */
  getprop(sid: number, target: any): unknown {
    const st = this.statics[sid]!;
    const key = st.method!;
    const result = target[key];
    const container = this.value(target);
    if (container.kind === "ref" && this.isMapping(container.id)) {
      this.emit<ItemReadEvent>({
        type: "ITEM_READ", ...this.at(st.line),
        target: container.id, key, value: this.value(result),
      });
    }
    return result;
  }

  /** `row.value = 9.8` — 점으로 쓰는 속성. 없던 키면 새로 생긴다. */
  setprop(sid: number, target: any, item: unknown): unknown {
    const st = this.statics[sid]!;
    const key = st.method!;
    const container = this.value(target);
    const current = target[key];
    const before = current === undefined ? undefined : this.value(current);
    target[key] = item;
    if (container.kind === "ref") {
      this.emit<ItemWriteEvent>({
        type: "ITEM_WRITE", ...this.at(st.line, "core"),
        target: container.id, key, before, after: this.value(item),
      });
      this.sync(container.id, target);
    }
    return item;
  }

  private isMapping(id: string): boolean {
    const raw = this.heapSnapshots.get(id);
    return !!raw && (JSON.parse(raw) as HeapObject).kind === "mapping";
  }

  setitem(sid: number, target: any, key: any, item: unknown): unknown {
    const st = this.statics[sid]!;
    const container = this.value(target);
    let before: Value | undefined;
    try {
      const current = target[key];
      if (current !== undefined) before = this.value(current);
    } catch {
      /* getter가 던지면 이전 값은 없는 것으로 둔다 */
    }
    target[key] = item;
    if (container.kind === "ref") {
      this.emit<ItemWriteEvent>({
        type: "ITEM_WRITE", ...this.at(st.line, "core"),
        target: container.id, key: keyText(key), before, after: this.value(item),
      });
      this.sync(container.id, target);
    }
    return item;
  }

  /** push / pop / splice 처럼 §3.4의 힙 그림이 바뀌는 호출 */
  method(sid: number, target: any, ...args: unknown[]): unknown {
    const st = this.statics[sid]!;
    const name = st.method!;
    const container = this.value(target);
    const result = target[name](...args);
    // `stats.add(3)`처럼 사용자 object의 method 이름이 겹칠 수 있다. 진짜
    // 배열·Set·Map일 때만 §3.4의 칸이 바뀌는 사건으로 그린다.
    const collection = Array.isArray(target) || target instanceof Set || target instanceof Map;
    if (container.kind === "ref" && collection) {
      const id = container.id;
      if ((name === "push" || name === "unshift" || name === "add") && args.length) {
        this.emit<ItemAppendEvent>({
          type: "ITEM_APPEND", ...this.at(st.line, "core"), target: id, value: this.value(args[0]),
        });
      } else if (name === "pop" || name === "shift" || name === "delete") {
        this.emit<ItemRemoveEvent>({
          type: "ITEM_REMOVE", ...this.at(st.line, "core"),
          target: id, key: args.length ? keyText(args[0]) : name === "shift" ? "0" : "-1",
        });
      }
      this.sync(id, target);
    } else if (container.kind === "ref") {
      this.sync(container.id, target);
    }
    return result;
  }

  print_(sid: number, ...args: unknown[]): void {
    const st = this.statics[sid]!;
    const text = `${args.map(formatTop).join(" ")}\n`;
    this.stdout.push(text);
    this.emit<OutputAppendEvent>({
      type: "OUTPUT_APPEND", ...this.at(st.line, "core"),
      stream: st.stream ?? "stdout", text: text.replace(/\n+$/, ""),
    });
  }

  // ── 흐름 ────────────────────────────────────────────────────

  test<T>(sid: number, value: T): T {
    const st = this.statics[sid]!;
    const result = Boolean(value);
    const pending = this.pendingSub;
    const substituted = pending && pending[0] === st.text ? pending[1] : undefined;
    this.pendingSub = null;
    this.emit<BranchTestEvent>({
      type: "BRANCH_TEST", ...this.at(st.line, "core"),
      expression: st.text!, substituted, result, span: this.span(st),
    });
    const target = result ? st.thenLine : st.elseLine;
    if (target) {
      this.emit<BranchTakenEvent>({
        type: "BRANCH_TAKEN", ...this.at(st.line),
        label: (result ? st.thenLabel : st.elseLabel)!, targetLine: target,
      });
    }
    return value;
  }

  loop_iter<T>(sid: number, iterable: T): T {
    const st = this.statics[sid]!;
    this.loopIndex.set(st.loopId!, -1);
    this.loopEnded.delete(st.loopId!);
    this.emit<LoopStartEvent>({
      type: "LOOP_START", ...this.at(st.line, "core"),
      loopId: st.loopId!, varNames: st.names!, track: this.preview(iterable),
      parentLoopId: st.parentLoop, span: this.span(st),
    });
    return iterable;
  }

  loop_step(sid: number, ...values: unknown[]): void {
    const st = this.statics[sid]!;
    const frame = this.top;
    frame.line = st.line;
    st.names!.forEach((name, index) => {
      const value = this.value(values[index]);
      const before = this.bind(frame, name, value);
      const origin: ValueOrigin = { kind: "iteration", label: st.sourceLabel };
      if (before === undefined) {
        this.emit<VariableCreateEvent>({ type: "VARIABLE_CREATE", ...this.at(st.line), name, value, origin });
      } else {
        this.emit<VariableUpdateEvent>({
          type: "VARIABLE_UPDATE", ...this.at(st.line), name, before, after: value, origin,
        });
      }
    });
    const index = (this.loopIndex.get(st.loopId!) ?? -1) + 1;
    this.loopIndex.set(st.loopId!, index);
    this.emit<LoopIterationEvent>({
      type: "LOOP_ITERATION", ...this.at(st.line, "core"), loopId: st.loopId!, index,
    });
  }

  while_start(sid: number): void {
    const st = this.statics[sid]!;
    this.loopIndex.set(st.loopId!, -1);
    this.loopEnded.delete(st.loopId!);
    this.emit<LoopStartEvent>({
      type: "LOOP_START", ...this.at(st.line, "core"),
      loopId: st.loopId!, varNames: st.names ?? [], track: [], parentLoopId: st.parentLoop,
    });
  }

  while_test<T>(sid: number, value: T): T {
    const st = this.statics[sid]!;
    const result = Boolean(value);
    const pending = this.pendingSub;
    const substituted = pending && pending[0] === st.text ? pending[1] : undefined;
    this.pendingSub = null;
    this.emit<BranchTestEvent>({
      type: "BRANCH_TEST", ...this.at(st.line), expression: st.text!, substituted, result,
    });
    if (result) {
      const index = (this.loopIndex.get(st.loopId!) ?? -1) + 1;
      this.loopIndex.set(st.loopId!, index);
      this.emit<LoopIterationEvent>({
        type: "LOOP_ITERATION", ...this.at(st.line, "core"), loopId: st.loopId!, index,
      });
    }
    return value;
  }

  /**
   * 반복이 끝났다. JS에는 for/else가 없으므로 반복문 **뒤에** 붙인다.
   * break로 이미 닫혔으면 두 번 내지 않는다.
   */
  loop_done(sid: number): void {
    const st = this.statics[sid]!;
    if (this.loopEnded.has(st.loopId!)) return;
    this.loopEnded.add(st.loopId!);
    this.emit<LoopEndEvent>({
      type: "LOOP_END", ...this.at(st.line, "core"), loopId: st.loopId!, reason: "exhausted",
    });
  }

  loop_break(sid: number): void {
    const st = this.statics[sid]!;
    if (this.loopEnded.has(st.loopId!)) return;
    this.loopEnded.add(st.loopId!);
    this.emit<LoopEndEvent>({
      type: "LOOP_END", ...this.at(st.line, "core"), loopId: st.loopId!, reason: "break",
    });
  }

  // ── 오류 ────────────────────────────────────────────────────

  raising<T>(sid: number, exc: T): T {
    this.thrown(sid, exc);
    return exc;
  }

  /**
   * try 블록을 지나가는 모든 예외를 한 번 본다. 줄 번호는 try 문이 적힌
   * 줄이 아니라 **실패한 줄**이어야 한다. 마지막 `line` 프로브가 그것이다.
   */
  thrown(sid: number, exc: unknown): void {
    if (exc instanceof TraceLimit) throw exc;
    void sid;
    this.thrownAt(exc, this.top.line);
  }

  /**
   * 오류를 한 번만 기록한다. 프레임을 거슬러 올라가며 여러 번 지나가므로
   * 같은 예외 객체에 대해서는 가장 깊은 지점의 기록만 남긴다.
   *
   * 줄 번호는 호출한 쪽이 정한다. Python은 트레이스백에서 얻지만 JS에는
   * 그것이 없으므로, throw 문은 자기 위치를, 호출 실패는 실행 중이던
   * 프레임의 현재 줄을 넘긴다.
   */
  thrownAt(exc: unknown, line: number): void {
    if (exc instanceof TraceLimit) throw exc;
    if (this.reportedErrors.has(exc)) return;
    this.reportedErrors.add(exc);
    const error = exc as { name?: string; message?: string };
    this.emit<ErrorThrowEvent>({
      type: "ERROR_THROW", ...this.at(line, "core"),
      name: (exc instanceof Error ? error.name : undefined) || "Error",
      message: exc instanceof Error ? error.message ?? "" : String(exc),
    });
  }

  caught(sid: number): void {
    const st = this.statics[sid]!;
    this.emit<ErrorCatchEvent>({ type: "ERROR_CATCH", ...this.at(st.line, "core"), handlerLine: st.line });
  }

  /** 계측 밖에서 풀린 프레임 정리 */
  unwind(to: string): void {
    while (this.frames.length > 1 && this.top.id !== to) {
      const frame = this.frames.pop()!;
      this.emit<ErrorPropagateEvent>({
        type: "ERROR_PROPAGATE", ...this.at(frame.line),
        fromFrameId: frame.id, toFrameId: this.top.id,
      });
    }
  }

  end(reason: ProgramEndEvent["reason"]): void {
    const last = this.events[this.events.length - 1];
    try {
      this.emit<ProgramEndEvent>({
        type: "PROGRAM_END", line: last?.line ?? 1, frameId: "global", detail: "core", reason,
      });
    } catch {
      /* 상한에 걸렸으면 그대로 둔다 */
    }
  }

  // ── 반복 트랙 미리보기 ───────────────────────────────────────

  /**
   * 반복 트랙에 미리 보여 줄 값들.
   *
   * 다시 순회할 수 있는 것만 훑는다. 제너레이터를 미리 읽으면 그 값이 본
   * 반복에서 사라지므로, 미리 볼 수 없는 것은 빈 트랙으로 둔다.
   */
  private preview(iterable: unknown): string[] {
    if (typeof iterable !== "string" && !Array.isArray(iterable) &&
        !(iterable instanceof Set) && !(iterable instanceof Map)) {
      return [];
    }
    const items = [...(iterable as Iterable<unknown>)];
    const cap = this.limits.maxTrack;
    const shown = items.slice(0, cap).map((v) => this.show(v));
    return items.length > cap ? [...shown, "…"] : shown;
  }
}

// ─────────────────────────────────────────────────────────────
// 표기
// ─────────────────────────────────────────────────────────────

function numberRepr(n: number): string {
  return Object.is(n, -0) ? "-0" : String(n);
}

/** Node의 util.inspect와 같은 작은따옴표 표기 */
function quote(s: string): string {
  const body = JSON.stringify(s).slice(1, -1).replace(/\\"/g, '"').replace(/'/g, "\\'");
  return `'${body}'`;
}

function keyText(key: unknown): string {
  return typeof key === "string" ? key : String(key);
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * console.log의 출력 표기.
 *
 * 빌드는 이 결과를 계측 없이 돌린 실행의 출력과 대조한다. Node의 util.inspect를
 * 그대로 쓸 수 없는 이유는 브라우저 워커에는 그것이 없기 때문이다. 두 곳에서
 * 같은 문자열이 나와야 "같은 트레이서"라는 주장이 성립한다.
 */
function formatTop(value: unknown): string {
  return typeof value === "string" ? value : inspect(value, 0);
}

function inspect(value: unknown, depth: number): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  switch (typeof value) {
    case "string":
      return quote(value);
    case "number":
      return numberRepr(value);
    case "bigint":
      return `${value}n`;
    case "boolean":
      return String(value);
    case "symbol":
      return String(value);
    case "function":
      return value.name ? `[Function: ${value.name}]` : "[Function (anonymous)]";
  }
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  // node의 표기와 같아야 한다. 빌드가 두 출력을 대조하기 때문이다.
  if (value instanceof TinyPromise) {
    if (value.state === "pending") return "Promise { <pending> }";
    if (value.state === "rejected") return `Promise { <rejected> ${inspect(value.value, depth + 1)} }`;
    return `Promise { ${inspect(value.value, depth + 1)} }`;
  }
  if (depth > 3) return Array.isArray(value) ? "[Array]" : "[Object]";

  if (Array.isArray(value)) {
    return value.length ? `[ ${value.map((v) => inspect(v, depth + 1)).join(", ")} ]` : "[]";
  }
  if (value instanceof Set) {
    const items = [...value].map((v) => inspect(v, depth + 1));
    return items.length ? `Set(${items.length}) { ${items.join(", ")} }` : "Set(0) {}";
  }
  if (value instanceof Map) {
    const items = [...value].map(([k, v]) => `${inspect(k, depth + 1)} => ${inspect(v, depth + 1)}`);
    return items.length ? `Map(${items.length}) { ${items.join(", ")} }` : "Map(0) {}";
  }
  const name = (value as object).constructor?.name;
  const prefix = name && name !== "Object" ? `${name} ` : "";
  const entries = Object.entries(value as object).map(
    ([k, v]) => `${IDENTIFIER.test(k) ? k : quote(k)}: ${inspect(v, depth + 1)}`,
  );
  return entries.length ? `${prefix}{ ${entries.join(", ")} }` : `${prefix}{}`;
}

// ─────────────────────────────────────────────────────────────
// AST 계측
// ─────────────────────────────────────────────────────────────

/* ESTree 노드는 종류마다 형태가 달라 any로 다룬다. 대신 만들어 낸 코드가
   실제로 도는지는 골든 트레이스와 브라우저 실행이 매번 검증한다. */
type N = any;

/** 재귀해 들어갈 노드 종류. 여기 없는 것(클래스식)은 그대로 둔다. */
const EXPRESSIONS = new Set([
  "Identifier", "Literal", "ArrayExpression", "ObjectExpression", "Property",
  "BinaryExpression", "UnaryExpression", "LogicalExpression", "MemberExpression",
  "CallExpression", "NewExpression", "ConditionalExpression", "SequenceExpression",
  "TemplateLiteral", "TaggedTemplateExpression", "UpdateExpression",
  "AssignmentExpression", "SpreadElement", "ChainExpression",
  "ArrowFunctionExpression", "FunctionExpression", "AwaitExpression",
]);

/**
 * 함수 값. JavaScript에서 함수는 값이므로 선언만 계측하면 절반만 보인다.
 * `arr.map(n => n * 2)`의 화살표도, `const double = ...`의 오른쪽도 몸통이
 * 도는 순간 프레임이 보여야 J10~J14가 성립한다.
 */
const FUNCTION_NODES = new Set(["ArrowFunctionExpression", "FunctionExpression"]);
const isFunctionNode = (node: N): boolean => isNode(node) && FUNCTION_NODES.has(node.type);

/** 이 자리의 자식은 값이 아니라 **이름**이므로 계측하지 않는다. */
const SKIP: Record<string, string[]> = {
  MemberExpression: ["property"],
  Property: ["key"],
  VariableDeclarator: ["id"],
  AssignmentExpression: ["left"],
  UpdateExpression: ["argument"],
  LabeledStatement: ["label"],
  BreakStatement: ["label"],
  ContinueStatement: ["label"],
  CatchClause: ["param"],
};

const ident = (name: string): N => ({ type: "Identifier", name });
const num = (value: number): N => ({ type: "Literal", value });
const block = (body: N[]): N => ({ type: "BlockStatement", body });

function isNode(value: unknown): value is N {
  return !!value && typeof value === "object" && typeof (value as N).type === "string";
}

export class Instrumenter {
  readonly statics: Static[];
  /** `export`가 붙은 이름들. module wrapper가 이것만 돌려준다. */
  readonly exports: string[] = [];
  private readonly path?: string;
  private userFunctions = new Set<string>();
  private userClasses = new Set<string>();
  private loopStack: { loopId: string; breakSid: number }[] = [];
  /** 다음에 만나는 함수 값이 쓸 이름. `const double = ...`의 왼쪽에서 온다. */
  private pendingName: string | null = null;
  /** 방금 계측한 함수의 static id. `define` 프로브가 이것을 쓴다. */
  private lastFunctionSid = -1;

  private readonly source: string;

  /**
   * `statics`를 넘기면 그 배열에 이어 쓴다. 여러 파일이 도는 레슨에서 Recorder
   * 하나가 모든 파일의 정적 정보를 같은 표로 보기 때문이다 (§J19).
   */
  constructor(source: string, statics?: Static[], path?: string) {
    this.source = source;
    this.statics = statics ?? [];
    this.path = path;
  }

  // ── 헬퍼 ────────────────────────────────────────────────────

  private add(fields: Static): number {
    this.statics.push(this.path ? { ...fields, src: this.path } : fields);
    return this.statics.length - 1;
  }

  private text(node: N): string {
    return this.source.slice(node.start, node.end);
  }

  private pos(node: N): Static {
    return { line: node.loc.start.line, col: node.loc.start.column, endCol: node.loc.end.column };
  }

  private probe(method: string, sid: number, args: N[] = []): N {
    return {
      type: "CallExpression", optional: false,
      callee: { type: "MemberExpression", computed: false, optional: false,
                object: ident(TRACER), property: ident(method) },
      arguments: [num(sid), ...args],
    };
  }

  private stmt(expression: N): N {
    return { type: "ExpressionStatement", expression };
  }

  private loads(names: string[]): N[] {
    return names.map(ident);
  }

  /**
   * 이 자리에서 값을 받는 이름들. 구조 분해는 이름이 여럿이다.
   *
   * `const { id, status = "UNKNOWN" } = wafer`에서 `status`도 이름이 생기는
   * 자리다(J15). 기본값이 붙었다고 이름이 아닌 것은 아니다.
   */
  private namesOf(target: N): string[] | null {
    if (!target) return null;
    if (target.type === "Identifier") return [target.name];
    if (target.type === "AssignmentPattern") return this.namesOf(target.left);
    if (target.type === "RestElement") return this.namesOf(target.argument);
    if (target.type === "ArrayPattern") {
      const out: string[] = [];
      for (const element of target.elements) {
        if (!element) continue; // `const [, second] = ...`의 빈 자리
        const names = this.namesOf(element);
        if (!names) return null;
        out.push(...names);
      }
      return out;
    }
    if (target.type === "ObjectPattern") {
      const out: string[] = [];
      for (const property of target.properties) {
        const names = this.namesOf(property.type === "RestElement" ? property : property.value);
        if (!names) return null;
        out.push(...names);
      }
      return out;
    }
    return null;
  }

  /**
   * 매개변수 자리에서 실제로 생기는 이름들.
   *
   * `function label({ id, measurement })`는 매개변수가 하나처럼 보이지만
   * 프레임에 생기는 이름은 둘이다. 화면의 카드도 둘이어야 하고, `enter`
   * 프로브가 읽을 수 있는 이름도 그 둘이다.
   */
  private paramsOf(fn: N): ParamSpec[] {
    const out: ParamSpec[] = [];
    for (const param of fn.params) {
      if (param.type === "RestElement") {
        const names = this.namesOf(param.argument);
        out.push({ name: names?.length === 1 ? `...${names[0]}` : this.text(param) });
        continue;
      }
      const names = this.namesOf(param);
      if (names) out.push(...names.map((name) => ({ name })));
      else out.push({ name: this.text(param) });
    }
    return out;
  }

  /** 값의 출처 (§1.2-3). 반드시 **계측 전** 노드로 판단해야 한다. */
  private origin(value: N): ValueOrigin {
    if (!value) return { kind: "literal" };
    if (value.type === "CallExpression") {
      const callee = value.callee;
      if (callee.type === "Identifier" && this.userFunctions.has(callee.name)) return { kind: "return" };
      return { kind: "expression" };
    }
    if (value.type === "Literal" || value.type === "ArrayExpression" ||
        value.type === "ObjectExpression" || value.type === "TemplateLiteral" ||
        isFunctionNode(value))
      return { kind: "literal" };
    return { kind: "expression" };
  }

  private firstLine(node: N): number | undefined {
    if (!node) return undefined;
    if (node.type === "BlockStatement") return node.body[0]?.loc.start.line;
    return node.loc.start.line;
  }

  // ── 진입점 ──────────────────────────────────────────────────

  run(program: N): N {
    collectFunctionNames(program, this.userFunctions);
    collectClassNames(program, this.userClasses);
    program.body = this.body(program.body);
    return program;
  }

  private body(statements: N[]): N[] {
    const out: N[] = [];
    for (const statement of statements) {
      const result = this.statement(statement);
      if (Array.isArray(result)) out.push(...result);
      else if (result) out.push(result);
    }
    return out;
  }

  /** if/for의 본문은 항상 블록으로 감싼다. 문장이 늘어나도 안전하다. */
  private asBlock(node: N): N {
    if (!node) return node;
    if (node.type === "BlockStatement") return block(this.body(node.body));
    const result = this.statement(node);
    return block(Array.isArray(result) ? result : [result]);
  }

  // ── 문장 ────────────────────────────────────────────────────

  private statement(node: N): N | N[] {
    switch (node.type) {
      case "VariableDeclaration": return this.declaration(node);
      case "ExpressionStatement": return this.expressionStatement(node);
      case "FunctionDeclaration": return this.functionDeclaration(node);
      case "ReturnStatement": return this.returnStatement(node);
      case "IfStatement": return this.ifStatement(node);
      case "ForStatement": return this.forStatement(node);
      case "ForOfStatement":
      case "ForInStatement": return this.forOf(node);
      case "WhileStatement": return this.whileStatement(node);
      case "BlockStatement": return block(this.body(node.body));
      case "BreakStatement": return this.breakStatement(node);
      case "ThrowStatement": return this.throwStatement(node);
      case "TryStatement": return this.tryStatement(node);
      case "ClassDeclaration": return this.classDeclaration(node);
      case "ImportDeclaration": return this.importDeclaration(node);
      case "ExportNamedDeclaration": return this.exportDeclaration(node);
      default:
        // switch, do/while 등은 아직 계측하지 않는다. 실행은 정상이고
        // 이벤트만 나오지 않는다 (README의 "아직 다루지 않는 문법").
        return node;
    }
  }

  private declaration(node: N): N[] {
    const at = this.pos(node);
    const lineSid = this.add(at);
    const records: N[] = [];
    for (const declarator of node.declarations) {
      const names = this.namesOf(declarator.id);
      const origin = this.origin(declarator.init); // 계측 전에 판단한다
      // `const double = n => n * 2`는 이름이 하나 생기는 일이면서 힙에 함수
      // 카드가 놓이는 일이다. 뒤쪽이 J10이 가르치는 것이므로 FUNCTION_DEFINE을
      // 낸다 — reducer가 카드와 이름 연결을 한꺼번에 만든다.
      const asFunction = names?.length === 1 && isFunctionNode(declarator.init);
      this.pendingName = asFunction ? names![0]! : null;
      declarator.init = declarator.init ? this.expr(declarator.init) : null;
      this.pendingName = null;
      if (asFunction) {
        records.push(this.stmt(this.probe("define", this.lastFunctionSid, [ident(names![0]!)])));
      } else if (names) {
        const sid = this.add({ ...at, names, origin });
        records.push(this.stmt(this.probe("assign", sid, this.loads(names))));
      }
    }
    return [this.stmt(this.probe("line", lineSid)), node, ...records];
  }

  private expressionStatement(node: N): N[] {
    const at = this.pos(node);
    const lineSid = this.add(at);
    const head = this.stmt(this.probe("line", lineSid));
    const value = node.expression;

    if (value.type === "AssignmentExpression") {
      const target = value.left;
      // arr[i] = v → ITEM_WRITE
      if (target.type === "MemberExpression" && target.computed && value.operator === "=") {
        const sid = this.add(at);
        const call = this.probe("setitem", sid, [
          this.expr(target.object), this.expr(target.property), this.expr(value.right),
        ]);
        return [head, this.stmt(call)];
      }
      // row.value = 9.8 → ITEM_WRITE. 없던 키면 칸이 새로 생긴다 (J06).
      if (target.type === "MemberExpression" && !target.computed &&
          value.operator === "=" && target.property.type === "Identifier") {
        const sid = this.add({ ...at, method: target.property.name });
        const call = this.probe("setprop", sid, [this.expr(target.object), this.expr(value.right)]);
        return [head, this.stmt(call)];
      }
      const names = this.namesOf(target);
      const origin = value.operator === "=" ? this.origin(value.right) : { kind: "expression" as const };
      value.right = this.expr(value.right);
      if (!names) return [head, node];
      const sid = this.add({ ...at, names, origin });
      return [head, node, this.stmt(this.probe("assign", sid, this.loads(names)))];
    }

    if (value.type === "UpdateExpression" && value.argument.type === "Identifier") {
      const sid = this.add({ ...at, names: [value.argument.name], origin: { kind: "expression" } });
      return [head, node, this.stmt(this.probe("assign", sid, this.loads([value.argument.name])))];
    }

    node.expression = this.expr(value);
    return [head, node];
  }

  private functionDeclaration(node: N): N[] {
    const name = node.id.name;
    if (node.async) {
      // generator가 된 몸통을 그대로 부르면 iterator가 나온다. 부르는 쪽이
      // 기대하는 것은 Promise이므로, 이름에는 드라이버를 감싼 함수를 건다.
      const sid = this.functionBody(node, name);
      const inner = `__async_${name}__`;
      node.id = ident(inner);
      return [
        node,
        {
          type: "VariableDeclaration", kind: "const",
          declarations: [{
            type: "VariableDeclarator", id: ident(name),
            init: this.probe("asyncfn", sid, [ident(inner)]),
          }],
        },
        this.stmt(this.probe("define", sid, [ident(name)])),
      ];
    }
    const sid = this.functionBody(node, name);
    return [node, this.stmt(this.probe("define", sid, [ident(name)]))];
  }

  /**
   * 함수 몸통 계측. 선언이든 값이든 같은 모양이어야 화면의 프레임이 같아진다.
   *
   * 몸통을 try/finally로 감싸는 이유: 호출부 프로브가 없는 호출(빌트인이 부르는
   * 콜백)은 프레임을 걷어낼 자리가 몸통밖에 없다. 호출부를 지나온 호출이면
   * `leave`가 아무 일도 하지 않으므로 이벤트는 예전과 같다.
   */
  private functionBody(node: N, name: string): number {
    const params = this.paramsOf(node);
    const isAsync = !!node.async;
    const sid = this.add({ ...this.pos(node), name, params, ...(isAsync ? { isAsync } : {}) });

    // async 함수는 generator로 바꾼다. `await`가 `yield`가 되면 이 트레이서의
    // 드라이버가 한 걸음씩 밀 수 있고, 그래야 멈춘 지점이 화면에 남는다.
    if (isAsync) {
      node.async = false;
      node.generator = true;
    }

    const saved = this.loopStack;
    this.loopStack = [];
    let body: N[];
    if (node.body.type === "BlockStatement") {
      body = this.body(node.body.body);
    } else {
      // 화살표의 식 본문. `n => n * 2`에서 `n * 2`가 곧 반환값이다.
      const at = this.pos(node.body);
      body = [{
        type: "ReturnStatement",
        argument: this.probe("ret", this.add(at), [this.expr(node.body, true)]),
      }];
      node.expression = false;
    }
    this.loopStack = saved;

    const names = params.map((p) => p.name.replace(/^\.\.\./, ""));
    node.body = block([
      this.stmt(this.probe("enter", sid, this.loads(names))),
      {
        type: "TryStatement",
        block: block(body),
        handler: {
          type: "CatchClause",
          param: ident("__leave__"),
          body: block([
            this.stmt(this.probe("leave_throw", sid, [ident("__leave__")])),
            { type: "ThrowStatement", argument: ident("__leave__") },
          ]),
        },
        finalizer: block([this.stmt(this.probe("leave", sid))]),
      },
    ]);
    this.lastFunctionSid = sid;
    return sid;
  }

  /**
   * 이름 없는 함수 값의 표시 이름.
   *
   * `arr.map(n => n * 2)`의 프레임 카드에 무엇이라고 적을지의 문제다.
   * 이 과정에서 이름 없이 쓰이는 함수는 거의 전부 다른 함수에 넘기는
   * 콜백이고, 그 낱말이 J12~J14가 가르치는 낱말이다.
   */
  private functionValue(node: N): N {
    // `return function check(value) {...}`처럼 이름이 붙어 있으면 그것이 우선이다.
    const name = node.id?.name ?? this.pendingName ?? "콜백";
    this.pendingName = null;
    const isAsync = !!node.async;
    const sid = this.functionBody(node, name);
    // 선언이 아닌 자리의 함수는 `define` 프로브를 지나지 않는다. 이름과
    // 매개변수를 여기서 적어 두어야 힙 카드를 만들 수 있다.
    return this.probe("fnmeta", sid, [isAsync ? this.probe("asyncfn", sid, [node]) : node]);
  }

  /**
   * `import { parseValue } from "./utils.js"` → `const { parseValue } = __trace__.import_(sid)`
   *
   * 이름을 바꿔 받는 `as`는 다루지 않는다. 이 과정의 원고에 없고, 없는 문법을
   * 반쯤 지원하면 화면이 조용히 틀리는 쪽이 더 나쁘다.
   */
  private importDeclaration(node: N): N {
    const module = String(node.source.value).replace(/^\.\//, "").replace(/\.js$/, "");
    const namespace = node.specifiers.find((sp: N) => sp.type === "ImportNamespaceSpecifier");

    if (namespace) {
      const sid = this.add({
        ...this.pos(node), module, binds: [namespace.local.name], importKind: "namespace",
      });
      return {
        type: "VariableDeclaration", kind: "const",
        declarations: [{
          type: "VariableDeclarator", id: ident(namespace.local.name),
          init: this.probe("import_", sid),
        }],
      };
    }

    const binds: string[] = [];
    for (const specifier of node.specifiers) {
      if (specifier.type !== "ImportSpecifier") continue;
      const imported = specifier.imported.name ?? String(specifier.imported.value);
      if (imported !== specifier.local.name)
        throw new Error(`import의 이름 바꾸기(as)는 아직 다루지 않습니다: ${imported}`);
      binds.push(specifier.local.name);
    }
    const sid = this.add({ ...this.pos(node), module, binds, importKind: "named" });
    return {
      type: "VariableDeclaration", kind: "const",
      declarations: [{
        type: "VariableDeclarator",
        id: {
          type: "ObjectPattern",
          properties: binds.map((name) => ({
            type: "Property", kind: "init", method: false, shorthand: true, computed: false,
            key: ident(name), value: ident(name),
          })),
        },
        init: this.probe("import_", sid),
      }],
    };
  }

  /** `export function f() {}` → 이름만 기록하고 선언은 그대로 계측한다. */
  private exportDeclaration(node: N): N | N[] {
    if (node.declaration) {
      const declared = node.declaration.type === "VariableDeclaration"
        ? node.declaration.declarations.flatMap((d: N) => this.namesOf(d.id) ?? [])
        : [node.declaration.id.name];
      this.exports.push(...declared);
      return this.statement(node.declaration);
    }
    for (const specifier of node.specifiers ?? []) this.exports.push(specifier.local.name);
    return []; // `export { a, b };` 는 실행할 것이 없다
  }

  /**
   * `class Wafer { constructor(...) {...} report() {...} }`
   *
   * method의 몸통은 함수와 똑같이 계측한다. 프레임 이름에 class 이름을 붙이는
   * 이유는 같은 이름의 method가 여러 class에 있을 수 있어서다.
   */
  private classDeclaration(node: N): N[] {
    const name = node.id.name;
    const methods: { name: string; params: string[] }[] = [];
    let initRule: string[] = [];

    for (const member of node.body.body) {
      if (member.type !== "MethodDefinition" || member.computed) continue;
      const key = member.key.name ?? String(member.key.value);
      const params = this.paramsOf(member.value).map((p) => p.name);
      if (member.kind === "constructor") initRule = thisAssignments(member.value.body);
      else methods.push({ name: key, params });
      this.functionBody(member.value, `${name}.${key}`);
    }

    const sid = this.add({ ...this.pos(node), name, methods, initRule });
    return [node, this.stmt(this.probe("class_", sid, [ident(name)]))];
  }

  private returnStatement(node: N): N[] {
    const at = this.pos(node);
    const lineSid = this.add(at);
    const value = node.argument ?? { type: "Identifier", name: "undefined" };
    // return의 값 표현식은 함수 본문의 의미 그 자체다 → core
    node.argument = this.probe("ret", this.add(at), [this.expr(value, true)]);
    return [this.stmt(this.probe("line", lineSid)), node];
  }

  private ifStatement(node: N): N {
    const at = this.pos(node);
    const text = this.text(node.test);
    const sid = this.add({
      ...at, text,
      thenLine: this.firstLine(node.consequent), elseLine: this.firstLine(node.alternate),
      thenLabel: "if", elseLabel: "else",
    });
    node.test = this.probe("test", sid, [this.expr(node.test, false, text)]);
    node.consequent = this.asBlock(node.consequent);
    // else if는 블록으로 감싸면 줄이 어긋나 보이므로 IfStatement 그대로 이어 붙인다
    node.alternate = node.alternate
      ? node.alternate.type === "IfStatement"
        ? this.statement(node.alternate)
        : this.asBlock(node.alternate)
      : null;
    return node;
  }

  /**
   * C 스타일 for. Python의 `for x in ...`과 달리 값 목록을 미리 알 수 없으므로
   * 반복 트랙은 비어 있고 매 회차의 조건 검사가 그대로 드러난다.
   * 이 차이 자체가 §9.2 8번 "언어 비교"의 내용이 된다.
   */
  private forStatement(node: N): N[] {
    const at = this.pos(node);
    const names = node.init?.type === "VariableDeclaration"
      ? node.init.declarations.flatMap((d: N) => this.namesOf(d.id) ?? [])
      : [];
    const loopId = `loop:${names.length ? names.join("-") : "for"}@${at.line}`;
    const parent = this.loopStack.at(-1)?.loopId;

    const startSid = this.add({ ...at, loopId, names, parentLoop: parent });
    const testSid = this.add({ ...at, loopId, text: node.test ? this.text(node.test) : "true" });
    const doneSid = this.add({ ...at, loopId });
    const breakSid = this.add({ ...at, loopId });

    if (node.init?.type === "VariableDeclaration") {
      for (const declarator of node.init.declarations) {
        const declared = this.namesOf(declarator.id);
        const origin = this.origin(declarator.init);
        const inner = declarator.init ? this.expr(declarator.init) : null;
        if (declared?.length === 1 && inner) {
          const sid = this.add({ ...this.pos(declarator), names: declared, origin });
          declarator.init = this.probe("declare", sid, [inner]);
        } else {
          declarator.init = inner;
        }
      }
    } else if (node.init) {
      node.init = this.expr(node.init);
    }

    const testText = node.test ? this.text(node.test) : "true";
    node.test = this.probe("while_test", testSid, [
      node.test ? this.expr(node.test, false, testText) : { type: "Literal", value: true },
    ]);

    if (node.update) {
      const updated = this.expr(node.update);
      const changed = node.update.type === "UpdateExpression" || node.update.type === "AssignmentExpression"
        ? this.namesOf(node.update.argument ?? node.update.left)
        : null;
      node.update = changed
        ? {
            type: "SequenceExpression",
            expressions: [
              updated,
              this.probe("assign", this.add({ ...at, names: changed, origin: { kind: "expression" } }),
                         this.loads(changed)),
            ],
          }
        : updated;
    }

    this.loopStack.push({ loopId, breakSid });
    node.body = this.asBlock(node.body);
    this.loopStack.pop();

    return [
      this.stmt(this.probe("while_start", startSid)),
      node,
      this.stmt(this.probe("loop_done", doneSid)),
    ];
  }

  private forOf(node: N): N[] {
    const at = this.pos(node);
    const left = node.left.type === "VariableDeclaration" ? node.left.declarations[0].id : node.left;
    const names = this.namesOf(left) ?? ["_"];
    const loopId = `loop:${names.join("-")}@${at.line}`;
    const parent = this.loopStack.at(-1)?.loopId;

    let sourceLabel = this.text(node.right);
    if (node.right.type === "CallExpression" && node.right.callee.type === "Identifier")
      sourceLabel = node.right.callee.name;

    const startSid = this.add({ ...at, loopId, names, parentLoop: parent });
    const stepSid = this.add({ ...at, loopId, names, sourceLabel });
    const doneSid = this.add({ ...at, loopId });
    const breakSid = this.add({ ...at, loopId });

    node.right = this.probe("loop_iter", startSid, [this.expr(node.right)]);

    this.loopStack.push({ loopId, breakSid });
    const inner = this.asBlock(node.body);
    this.loopStack.pop();
    node.body = block([this.stmt(this.probe("loop_step", stepSid, this.loads(names))), ...inner.body]);

    return [node, this.stmt(this.probe("loop_done", doneSid))];
  }

  private whileStatement(node: N): N[] {
    const at = this.pos(node);
    const text = this.text(node.test);
    const loopId = `loop:while@${at.line}`;
    const parent = this.loopStack.at(-1)?.loopId;

    const startSid = this.add({ ...at, loopId, names: [], parentLoop: parent });
    const testSid = this.add({ ...at, loopId, text });
    const doneSid = this.add({ ...at, loopId });
    const breakSid = this.add({ ...at, loopId });

    node.test = this.probe("while_test", testSid, [this.expr(node.test, false, text)]);
    this.loopStack.push({ loopId, breakSid });
    node.body = this.asBlock(node.body);
    this.loopStack.pop();

    return [
      this.stmt(this.probe("while_start", startSid)),
      node,
      this.stmt(this.probe("loop_done", doneSid)),
    ];
  }

  private breakStatement(node: N): N | N[] {
    const current = this.loopStack.at(-1);
    if (!current || node.label) return node;
    return [this.stmt(this.probe("loop_break", current.breakSid)), node];
  }

  private throwStatement(node: N): N[] {
    const at = this.pos(node);
    const lineSid = this.add(at);
    const sid = this.add(at);
    node.argument = this.probe("raising", sid, [this.expr(node.argument)]);
    return [this.stmt(this.probe("line", lineSid)), node];
  }

  private tryStatement(node: N): N {
    const sid = this.add(this.pos(node));
    // 어떤 예외든 지나가면서 한 번 기록하고 그대로 다시 던진다.
    const watcher: N = {
      type: "TryStatement",
      block: block(this.body(node.block.body)),
      handler: {
        type: "CatchClause",
        param: ident("__exc__"),
        body: block([
          this.stmt(this.probe("thrown", sid, [ident("__exc__")])),
          { type: "ThrowStatement", argument: ident("__exc__") },
        ]),
      },
      finalizer: null,
    };
    node.block = block([watcher]);
    if (node.handler) {
      const hid = this.add(this.pos(node.handler));
      node.handler.body = block([
        this.stmt(this.probe("caught", hid)),
        ...this.body(node.handler.body.body),
      ]);
    }
    if (node.finalizer) node.finalizer = block(this.body(node.finalizer.body));
    return node;
  }

  // ── 표현식 ──────────────────────────────────────────────────

  /**
   * `suppress`가 주어지면 그 텍스트의 최상위 노드는 이벤트를 내지 않는다
   * (조건식은 BRANCH_TEST가 대신 보여 준다).
   */
  private expr(node: N, core = false, suppress?: string): N {
    if (!node) return node;
    const text = this.text(node);
    const emit = suppress !== text;
    const at = this.pos(node);

    if (node.type === "BinaryExpression" && BIN_OPS[node.operator]) {
      const sid = this.add({ ...at, text, op: node.operator, fn: BIN_OPS[node.operator], emit, core });
      return this.probe("binop", sid, [this.expr(node.left), this.expr(node.right)]);
    }

    if (node.type === "UnaryExpression" && UNARY_OPS[node.operator]) {
      const sid = this.add({ ...at, text, op: node.operator, unary: UNARY_OPS[node.operator], emit, core });
      return this.probe("unaryop", sid, [this.expr(node.argument)]);
    }

    if (node.type === "LogicalExpression") {
      // a && b && c는 (a && b) && c로 파싱된다. Python의 BoolOp처럼 펼쳐서
      // "몇 번째 항까지 계산했는가"를 한 이벤트로 보여 준다.
      const parts: N[] = [];
      const flatten = (n: N): void => {
        if (n.type === "LogicalExpression" && n.operator === node.operator) {
          flatten(n.left);
          flatten(n.right);
        } else parts.push(n);
      };
      flatten(node);
      const sid = this.add({
        ...at, text, op: node.operator, texts: parts.map((p) => this.text(p)), emit, core,
      });
      // 람다로 감싸 단축 평가를 그대로 보존한다
      const thunks = parts.map((part) => ({
        type: "ArrowFunctionExpression", id: null, params: [],
        body: this.expr(part), expression: true, async: false, generator: false,
      }));
      return this.probe("boolop", sid, thunks);
    }

    if (node.type === "MemberExpression" && node.computed && !node.optional) {
      const sid = this.add({ ...at, text });
      return this.probe("getitem", sid, [this.expr(node.object), this.expr(node.property)]);
    }

    // `row.value`는 `row["value"]`와 같은 일이다 (J06). 호출부의 callee는
    // 여기로 오지 않는다 — call()이 property를 건너뛰고 object만 계측한다.
    if (node.type === "MemberExpression" && !node.computed && !node.optional &&
        node.property.type === "Identifier") {
      const sid = this.add({ ...at, text, method: node.property.name });
      return this.probe("getprop", sid, [this.expr(node.object)]);
    }

    // `await X` → `yield __trace__.await_(sid, X)`.
    // 이 자리에서 프레임이 스택을 떠난다. 그 사실이 J22의 내용 전부다.
    if (node.type === "AwaitExpression") {
      const sid = this.add({ ...at, text });
      return {
        type: "YieldExpression", delegate: false,
        argument: this.probe("await_", sid, [this.expr(node.argument)]),
      };
    }

    if (isFunctionNode(node)) return this.functionValue(node);

    // `{ parse(text) { ... } }`의 method는 그 속성 이름으로 불린다.
    // 이름 없는 콜백으로 적히면 프레임 카드가 무엇인지 알 수 없다.
    if (node.type === "ObjectExpression") {
      for (const property of node.properties) {
        if (property.type !== "Property") continue;
        if (isFunctionNode(property.value)) {
          this.pendingName = property.key?.name ?? property.key?.value ?? null;
          property.value = this.expr(property.value);
          this.pendingName = null;
        } else if (isNode(property.value) && EXPRESSIONS.has(property.value.type)) {
          property.value = this.expr(property.value);
        }
      }
      return node;
    }

    // `new Wafer(...)`는 설계도를 불러 실물을 만드는 일이다 (J20 §5).
    if (node.type === "NewExpression" && node.callee.type === "Identifier" &&
        this.userClasses.has(node.callee.name)) {
      const sid = this.add({ ...at, callee: node.callee.name });
      return this.probe("construct", sid, [
        ident(node.callee.name), ...node.arguments.map((a: N) => this.expr(a)),
      ]);
    }

    if (node.type === "CallExpression") return this.call(node);

    return this.children(node);
  }

  private children(node: N): N {
    const skip = SKIP[node.type] ?? [];
    for (const key of Object.keys(node)) {
      if (key === "type" || key === "loc" || key === "start" || key === "end") continue;
      if (skip.includes(key)) continue;
      const value = node[key];
      if (Array.isArray(value)) {
        node[key] = value.map((item: N) =>
          isNode(item) && EXPRESSIONS.has(item.type) ? this.expr(item) : item,
        );
      } else if (isNode(value) && EXPRESSIONS.has(value.type)) {
        node[key] = this.expr(value);
      }
    }
    return node;
  }

  private call(node: N): N {
    const at = this.pos(node);
    const callee = node.callee;

    if (callee.type === "MemberExpression" && !callee.computed &&
        callee.object.type === "Identifier" && callee.object.name === "console" &&
        CONSOLE_STREAMS[callee.property.name]) {
      const sid = this.add({ ...at, stream: CONSOLE_STREAMS[callee.property.name] });
      return this.probe("print_", sid, node.arguments.map((a: N) => this.expr(a)));
    }

    if (callee.type === "MemberExpression" && !callee.computed && MUTATORS.has(callee.property.name)) {
      const sid = this.add({ ...at, method: callee.property.name });
      return this.probe("method", sid, [
        this.expr(callee.object), ...node.arguments.map((a: N) => this.expr(a)),
      ]);
    }

    if (callee.type === "Identifier" && this.userFunctions.has(callee.name)) {
      const sid = this.add({
        ...at, callee: callee.name,
        argNames: node.arguments.map((a: N) => (a.type === "Identifier" ? a.name : null)),
      });
      // 인수는 호출 전에 하나씩 읽힌다. §3.2의 "i 읽기 → k 읽기 → 프레임 생성"
      const wrapped = node.arguments.map((original: N) => {
        const inner = this.expr(original);
        if (original.type === "Literal") return inner; // 리터럴은 읽는 장면이 없다
        const aid = this.add({ ...this.pos(original), text: this.text(original) });
        return this.probe("arg", aid, [inner]);
      });
      return this.probe("call", sid, [ident(callee.name), ...wrapped]);
    }

    if (callee.type === "MemberExpression") node.callee = this.children(callee);
    // `values.map(v => ...)`의 프레임 카드는 `map 콜백#1`이라고 적혀야 한다.
    // 한 레슨에 map·filter·reduce가 같이 나오면 번호만으로는 구분되지 않는다.
    const receiver =
      callee.type === "MemberExpression" && !callee.computed ? callee.property?.name : null;
    node.arguments = node.arguments.map((a: N) => {
      if (receiver && isFunctionNode(a)) this.pendingName = `${receiver} 콜백`;
      const out = this.expr(a);
      this.pendingName = null;
      return out;
    });
    return node;
  }
}

const CONSOLE_STREAMS: Record<string, OutputEntry["stream"]> = {
  log: "stdout", info: "stdout", warn: "warning", error: "stderr",
};

/**
 * 함수 이름은 호출부보다 뒤에 선언될 수 있으므로(호이스팅) 먼저 모은다.
 * `const double = n => n * 2`처럼 값으로 만든 함수의 이름도 같이 모은다.
 * 이 집합에 있는 이름만 호출부에서 프레임 이벤트를 만든다.
 */
function collectFunctionNames(node: N, into: Set<string>): void {
  if (!isNode(node)) return;
  if (node.type === "FunctionDeclaration" && node.id) into.add(node.id.name);
  if (node.type === "VariableDeclarator" && node.id?.type === "Identifier" && isFunctionNode(node.init))
    into.add(node.id.name);
  if (node.type === "AssignmentExpression" && node.left?.type === "Identifier" && isFunctionNode(node.right))
    into.add(node.left.name);
  for (const key of Object.keys(node)) {
    if (key === "loc") continue;
    const value = node[key];
    if (Array.isArray(value)) value.forEach((item) => collectFunctionNames(item, into));
    else if (isNode(value)) collectFunctionNames(value, into);
  }
}

/** class도 호이스팅되지는 않지만 `new`가 선언보다 뒤에 있는지 미리 알아야 한다. */
function collectClassNames(node: N, into: Set<string>): void {
  if (!isNode(node)) return;
  if (node.type === "ClassDeclaration" && node.id) into.add(node.id.name);
  for (const key of Object.keys(node)) {
    if (key === "loc") continue;
    const value = node[key];
    if (Array.isArray(value)) value.forEach((item) => collectClassNames(item, into));
    else if (isNode(value)) collectClassNames(value, into);
  }
}

/**
 * constructor가 `this`에 붙이는 이름들. §P21 §5의 "초기 상태 규칙"이다.
 * 이 목록이 설계도 카드에 적히면 "실물이 생기면 이 칸들이 생긴다"가 보인다.
 */
function thisAssignments(body: N): string[] {
  const names: string[] = [];
  for (const statement of body.body ?? []) {
    if (statement.type !== "ExpressionStatement") continue;
    const value = statement.expression;
    if (value.type !== "AssignmentExpression") continue;
    const target = value.left;
    if (target.type === "MemberExpression" && !target.computed &&
        target.object.type === "ThisExpression" && target.property.type === "Identifier") {
      names.push(target.property.name);
    }
  }
  return names;
}

// ─────────────────────────────────────────────────────────────
// 진입점
// ─────────────────────────────────────────────────────────────

export interface TraceOptions {
  path?: string;
  lessonId?: string;
  limits?: Partial<Limits>;
  /** 같이 도는 다른 파일들. `{ measurement_utils: { path, code } }` (§J19) */
  modules?: Record<string, { path: string; code: string }>;
}

/**
 * `import`/`export`가 있으면 module로 파싱한다.
 *
 * 언제나 module로 파싱하지 않는 이유: module은 strict mode라 나머지 스물두
 * 레슨의 의미가 조용히 달라질 수 있다. 두 갈래가 필요한 곳은 여기 한 곳뿐이다.
 */
const MODULE_SYNTAX = /^\s*(import|export)\s/m;
const sourceTypeOf = (code: string): "script" | "module" =>
  MODULE_SYNTAX.test(code) ? "module" : "script";

/** 소스를 계측한 뒤의 실행 가능한 코드. 문제가 생겼을 때 눈으로 보려고 열어 둔다. */
export function instrument(code: string): { source: string; statics: Static[] } {
  const program = parse(code, {
    ecmaVersion: 2022, locations: true, sourceType: sourceTypeOf(code),
  }) as unknown as N;
  const instrumenter = new Instrumenter(code);
  return { source: generate(instrumenter.run(program)), statics: instrumenter.statics };
}

/** 계측 실행해 TraceDocument를 만든다. 빌드(Node)와 브라우저(Worker) 공용 진입점. */
export function traceSource(code: string, options: TraceOptions = {}): TraceDocument {
  const { path = "main.js", lessonId = "adhoc", modules = {} } = options;
  const lines = code.split("\n");
  const limits: Limits = { ...DEFAULT_LIMITS, ...options.limits };

  const program = parse(code, {
    ecmaVersion: 2022, locations: true, sourceType: sourceTypeOf(code),
  }) as unknown as N;
  const instrumenter = new Instrumenter(code);
  const generated = generate(instrumenter.run(program));

  const recorder = new Recorder(instrumenter.statics, limits);

  // 같이 도는 파일들. 정적 정보 표를 공유해야 Recorder가 한 표만 본다.
  const sources: TraceSource[] = [];
  for (const [name, module] of Object.entries(modules)) {
    const tree = parse(module.code, {
      ecmaVersion: 2022, locations: true, sourceType: sourceTypeOf(module.code),
    }) as unknown as N;
    const moduleInstrumenter = new Instrumenter(module.code, instrumenter.statics, module.path);
    recorder.moduleSources.set(name, {
      source: generate(moduleInstrumenter.run(tree)),
      path: module.path,
      exports: moduleInstrumenter.exports,
    });
    sources.push({ path: module.path, language: "javascript", lines: module.code.split("\n") });
  }

  let reason: ProgramEndEvent["reason"] = "normal";
  try {
    // with(프록시)가 자유 식별자 조회를 전부 가로챈다. 화이트리스트 밖의
    // 이름은 여기서 ReferenceError가 되고 바깥 전역에 닿지 못한다.
    const run = new Function(SCOPE, `with (${SCOPE}) {\n${generated}\n}`);
    const scope = safeScope(recorder);
    recorder.scope = scope; // module 파일도 같은 스코프에서 돈다
    run(scope);
    // 동기 부분이 끝났다고 프로그램이 끝난 것이 아니다. 남은 microtask와
    // 타이머를 여기서 전부 돌린다 (§J22 §11).
    recorder.runQueue();
  } catch (error) {
    if (error instanceof TraceLimit) {
      reason = "truncated";
    } else {
      reason = "error";
      try {
        recorder.thrownAt(error, recorder.currentLine); // 이미 call()이 기록했다면 무시된다
        recorder.unwind("global");
      } catch {
        /* 상한에 걸렸으면 그대로 둔다 */
      }
    }
  }
  recorder.end(reason);

  return {
    version: 1,
    lessonId,
    source: { path, language: "javascript", lines },
    ...(sources.length ? { sources } : {}),
    events: recorder.events,
    meta: {
      generator: "javascript-tracer/1",
      truncated: recorder.truncated,
      stdout: recorder.stdout.join(""),
    },
  };
}
