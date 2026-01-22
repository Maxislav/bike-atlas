"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autobind = autobind;
function autobind() {
    return (target, key, descriptor) => {
        let fn = descriptor.value;
        let definingProperty = false;
        return {
            configurable: true,
            get() {
                const boundFn = fn.bind(this);
                Object.defineProperty(this, key, {
                    configurable: true,
                    get() {
                        return boundFn;
                    },
                    set(value) {
                        fn = value;
                        delete this[key];
                    }
                });
                definingProperty = false;
                return boundFn;
            },
            set(value) {
                fn = value;
            }
        };
    };
}
//# sourceMappingURL=autobind.js.map