export class TElement {
    private readonly elName;
    public attr: { [key: string]: string  } = {};
    public innerText: string = '';
    public children: Array<TElement> = [];

    constructor(name: string) {
        this.elName = name;
    }

    appendChild(child: TElement): this {
        this.children.push(child);
        return this;
    }

    toString() {
        let childStr = '';
        const reducer = (accumulator, currentValue) => new String(accumulator.toString()).concat(currentValue.toString());

        if (this.children.length) {
            childStr = this.children.reduce(reducer, '');
        }

        const attrReducer = (prev, next) => {
            return String(prev).concat(' ', next, '=', '"', this.attr[next], '"');
        };
        const attrStr = Object.keys(this.attr).reduce(attrReducer, '');
        return `<${this.elName}  ${attrStr}>${this.innerText}${childStr}</${this.elName}>`;

    }


    getElementsByTagName(name: string): Array<TElement> {
        return this._getElementsByTagName(name, this.children );
    }

    setAttribute(name: string, value: string ): this {
        this.attr[name] = value;
        return this;
    }

    private _getElementsByTagName(name: string, a:  Array<TElement>): Array<TElement>{
        let r = [];
        if(a.length){
            a.forEach(child => {
                if(child.elName === name){
                    r.push(child)
                }
                if(child.children.length){
                    const gg = this._getElementsByTagName(name, child.children);
                    if(gg.length){
                        r.push(...gg);
                    }
                }
            })
        }
        return r
    }


}

