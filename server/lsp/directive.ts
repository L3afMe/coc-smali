import { Token } from "moo";
import { Diagnostic } from "vscode-languageserver";
import { tokenToDiagnostic, tokensToDiagnostic, tokensToString, eolTokensToDiagnostic } from "./helper";

export const directiveSource = (tokens: Token[], isInMethod: boolean): Diagnostic[] => {
  let diagnostics: Diagnostic[] = [];

  if (isInMethod) diagnostics.push(tokensToDiagnostic(tokens, "Source directive cannot be inside a method block."));

  if (tokens.length <= 2) {
    return [
      tokenToDiagnostic(
        tokens[tokens.length - 1],
        `Expected '.source "file name"'\n\
Got '${tokensToString(tokens)}'`
      ),
    ];
  }

  tokens.shift();

  let tkn = tokens.shift();
  if (tkn.type != "space") {
    diagnostics.push(tokenToDiagnostic(tkn, "Space expected."));
  }

  tkn = tokens.shift();
  if (tkn.type != "string") {
    diagnostics.push(tokenToDiagnostic(tkn, "String expected."));
  }

  let eol = eolTokensToDiagnostic(tokens);
  if (eol) diagnostics.push(eol);

  return diagnostics;
};

export const directiveSuper = (tokens: Token[], isInMethod: boolean): Diagnostic[] => {
  let diagnostics: Diagnostic[] = [];

  if (isInMethod) {
    diagnostics.push(
      tokensToDiagnostic(
        tokens,
        (tokens[0].text == ".source" ? "Source" : "Implements") + " directive cannot be inside a method block."
      )
    );
  }

  if (tokens.length <= 2) {
    return [
      tokenToDiagnostic(
        tokens[tokens.length - 1],
        `Expected '${tokens[0].text} Lclass/Name;'\n\
Got '${tokensToString(tokens)}'`
      ),
    ];
  }

  tokens.shift();

  let tkn = tokens.shift();
  if (tkn.type != "space") {
    diagnostics.push(tokenToDiagnostic(tkn, "Space expected."));
  }

  tkn = tokens.shift();
  if (tkn.type != "class") {
    diagnostics.push(tokenToDiagnostic(tkn, "Class expected."));
  }

  let eol = eolTokensToDiagnostic(tokens);
  if (eol) diagnostics.push(eol);

  return diagnostics;
};
