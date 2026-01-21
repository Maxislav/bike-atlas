"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
class Deferred {
    constructor() {
        this.status = 0;
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            if (this._resolveValue !== undefined)
                this.resolve(this._resolveValue);
            if (this._rejectValue !== undefined)
                this.reject(this._resolveValue);
        });
    }
    resolve(value) {
        this._resolveValue = value;
        if (this._resolve)
            this._resolve(value);
        this.status = 1;
        return this;
    }
    reject(value) {
        this._rejectValue = value;
        this.status = 2;
        if (this._reject)
            this._reject(value);
        return this;
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=deferred.js.map