export class Switcher {
    static switch(target, isAutoBreak = true) {
        return new SwitcherBuilder(target, isAutoBreak);
    }
}
class SwitcherBuilder {
    constructor(target, isAutoBreak) {
        this.target = target;
        this.isAutoBreak = isAutoBreak;
        this._isBreak = false;
    }
    case(predicate, func) {
        if (!this._isBreak && predicate(this.target)) {
            const result = func(this.target);
            const next = new SwitcherBuilder(this.target, this.isAutoBreak);
            next._isBreak = this.isAutoBreak;
            next._result = result;
            return next;
        }
        return new SwitcherBuilder(this.target, this.isAutoBreak);
    }
    caseOr(predicate) {
        return new CaseOrBuilder(this, this.target, predicate);
    }
    caseAnd(predicate) {
        return new CaseAndBuilder(this, this.target, predicate);
    }
    default(func) {
        if (!this._isBreak) {
            const result = func(this.target);
            return new SwitchFixResult(result); // ← ここに as
        }
        return new SwitchFixResult(this._result);
    }
    break() {
        return new SwitchResult(this._result);
    }
}
class SwitchFixResult {
    constructor(result) {
        this.result = result;
    }
    out() {
        return this.result;
    }
}
class SwitchResult {
    constructor(result) {
        this.result = result;
    }
    out() {
        return this.result;
    }
}
class CaseOrBuilder {
    constructor(switcher, target, predicate) {
        this.switcher = switcher;
        this.target = target;
        this.predicates = [];
        this.predicates.push(predicate);
    }
    else(predicate) {
        this.predicates.push(predicate);
        return this;
    }
    then(func) {
        const predicate = () => this.predicates.some((p) => p(this.target));
        return this.switcher.case(predicate, func);
    }
}
class CaseAndBuilder {
    constructor(switcher, target, predicate) {
        this.switcher = switcher;
        this.target = target;
        this.predicates = [];
        this.predicates.push(predicate);
    }
    also(predicate) {
        this.predicates.push(predicate);
        return this;
    }
    then(func) {
        const predicate = () => this.predicates.every((p) => p(this.target));
        return this.switcher.case(predicate, func);
    }
}
