import { lexString } from "../tokenizer";
import * as fs from "fs";
import {Token} from "moo";

let str = fs.readFileSync("server/lsp/test/Test2.smali").toString();
let lex = lexString(str);

for (let tkn of lex) {
    if(tkn.type == "string") {
        console.log(tkn.toString());
    }
}
