export declare class Switcher {
    static switch<T>(target: T, isAutoBreak?: boolean): SwitcherBuilder<T, never>;
}
type Or<T> = T;
declare class SwitcherBuilder<T, U> {
    private target;
    private isAutoBreak;
    private _isBreak;
    private _result?;
    constructor(target: T, isAutoBreak: boolean);
    case<U1>(predicate: (t: T) => boolean, func: (t: T) => U1): SwitcherBuilder<T, Or<U | U1>>;
    caseOr(predicate: (t: T) => boolean): CaseOrBuilder<T, U>;
    caseAnd(predicate: (t: T) => boolean): CaseAndBuilder<T, U>;
    default<U1>(func: (t: T) => U1): SwitchFixResult<Or<U | U1>>;
    break(): SwitchResult<U>;
}
declare class SwitchFixResult<U> {
    private result;
    constructor(result: U);
    out(): U;
}
declare class SwitchResult<U> {
    private result?;
    constructor(result?: U | undefined);
    out(): U | undefined;
}
declare class CaseOrBuilder<T, U> {
    private switcher;
    private target;
    private readonly predicates;
    constructor(switcher: SwitcherBuilder<T, U>, target: T, predicate: (value: T) => boolean);
    else(predicate: (value: T) => boolean): CaseOrBuilder<T, U>;
    then<U1>(func: (value: T) => U1): SwitcherBuilder<T, Or<U | U1>>;
}
declare class CaseAndBuilder<T, U> {
    private switcher;
    private target;
    private readonly predicates;
    constructor(switcher: SwitcherBuilder<T, U>, target: T, predicate: (value: T) => boolean);
    also(predicate: (value: T) => boolean): CaseAndBuilder<T, U>;
    then<U1>(func: (value: T) => U1): SwitcherBuilder<T, Or<U | U1>>;
}
export {};
