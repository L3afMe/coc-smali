import { compile, Lexer } from "moo";

const lexer: Lexer = compile({
    comment: /#.*$/,
    visibility: /public|private|protected/,
    static: /static/,
    constructor: /constructor/,
    space: /(?: |\t)+/,
    class: /L[a-zA-Z0-9\$_\-\.\/]*?;/,
    register: /(?:p|v)\d+/,
    method: /\.(?:method|end method)/,
    field: /\.(?:field|end field)/,
    label: /\:(?:goto|cond)_\d/,
    directive: /\.(?:class|source|super|implements|locals|local|registers|line|prologue|goto)/,
    invoke: /invoke-(?:direct|static|virtual|interface)(?:\/range)?/,
    rangeOp: /\.\./,
    comma: /,/,
    typeOp: /:/,
    checkCase: /check-cast/,
    constString: /const-string(?:\/jumbo|)/,
    constInt: /const\/(?:4|16)/,
    const: /const(?:-(?:class|class)|)/,
    instance: /new-instance/,
    if: /if-(?:lt|le|gt|ge|eq|eq|ne|ne)(?:z|)/,
    iget: /iget(?:-(?:object|string)|)/,
    sget: /sget(?:-(?:object|string)|)/,
    iput: /iput(?:-(?:object|string)|)/,
    sput: /sput(?:-(?:object|string)|)/,
    move: /move(?:-(?:result(?:-object|)|)|)/,
    return: /return(?:-(?:void|object|wide)|)/,
    string: /".*?"/,
    treecordMacro: /\{\{[a-z\/a-zA-Z0-9_]*\}\}/,
    brace: /(?:\{|\})/,
    paren: /(?:\(|\))/,
    number: /(?:-|)(?:0x|)\d+/,
    builtinType: /(?:V|Z|B|S|C|I|J|F|D)/,
    arrayOp: /\[/,
    call: /->(?:<(?:|cl)init>|(?!\.)[a-zA-Z0-9\$\.]+)/,
    methodName: /(?:<(?:|cl)init>|(?!\.)[a-zA-Z0-9\$\.]+)(?:\(\)|)/,
    stringUnterminated: /".*$/,
    newline: { 
        match: /\n/,
        lineBreaks: true
    },
    error: /./,
})

export const lexString = (input: string): Lexer  => lexer.reset(input);
