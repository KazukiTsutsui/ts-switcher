export class Switcher {
  static switch<T>(target: T, isAutoBreak: boolean = true) {
    return new SwitcherBuilder<T, never>(target, isAutoBreak);
  }
}

type Or<T> = T;

class SwitcherBuilder<T, U> {
  private _isBreak = false;
  private _result?: U;

  constructor(private target: T, private isAutoBreak: boolean) {}

  case<U1>(
    predicate: (t: T) => boolean,
    func: (t: T) => U1
  ): SwitcherBuilder<T, Or<U | U1>> {
    if (!this._isBreak && predicate(this.target)) {
      const result = func(this.target);
      const next = new SwitcherBuilder<T, Or<U | U1>>(
        this.target,
        this.isAutoBreak
      );
      next._isBreak = this.isAutoBreak;
      next._result = result as Or<U | U1>;
      return next;
    }
    return new SwitcherBuilder<T, Or<U | U1>>(this.target, this.isAutoBreak);
  }

  caseOr(predicate: (t: T) => boolean) {
    return new CaseOrBuilder<T, U>(this, this.target, predicate);
  }

  caseAnd(predicate: (t: T) => boolean) {
    return new CaseAndBuilder<T, U>(this, this.target, predicate);
  }

  default<U1>(func: (t: T) => U1): SwitchFixResult<Or<U | U1>> {
    if (!this._isBreak) {
      const result = func(this.target);
      return new SwitchFixResult(result as Or<U | U1>); // ← ここに as
    }
    return new SwitchFixResult(this._result as Or<U | U1>);
  }

  break(): SwitchResult<U> {
    return new SwitchResult(this._result);
  }
}

class SwitchFixResult<U> {
  constructor(private result: U) {}

  out(): U {
    return this.result;
  }
}

class SwitchResult<U> {
  constructor(private result?: U) {}

  out(): U | undefined {
    return this.result;
  }
}

class CaseOrBuilder<T, U> {
  private readonly predicates: ((value: T) => boolean)[] = [];

  constructor(
    private switcher: SwitcherBuilder<T, U>,
    private target: T,
    predicate: (value: T) => boolean
  ) {
    this.predicates.push(predicate);
  }

  else(predicate: (value: T) => boolean): CaseOrBuilder<T, U> {
    this.predicates.push(predicate);
    return this;
  }

  then<U1>(func: (value: T) => U1): SwitcherBuilder<T, Or<U | U1>> {
    const predicate = () => this.predicates.some((p) => p(this.target));
    return this.switcher.case(predicate, func);
  }
}

class CaseAndBuilder<T, U> {
  private readonly predicates: ((value: T) => boolean)[] = [];

  constructor(
    private switcher: SwitcherBuilder<T, U>,
    private target: T,
    predicate: (value: T) => boolean
  ) {
    this.predicates.push(predicate);
  }

  also(predicate: (value: T) => boolean): CaseAndBuilder<T, U> {
    this.predicates.push(predicate);
    return this;
  }

  then<U1>(func: (value: T) => U1): SwitcherBuilder<T, Or<U | U1>> {
    const predicate = () => this.predicates.every((p) => p(this.target));
    return this.switcher.case(predicate, func);
  }
}
