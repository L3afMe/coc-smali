import { Token } from "moo";
import { Diagnostic, DiagnosticSeverity, Range } from "vscode-languageserver";

export const tokenToDiagnostic = (token: Token, message: string, severity?: DiagnosticSeverity): Diagnostic => {
  let line = token.line - 1;
  let character = token.col - 1;
  let range: Range = {
    start: { line, character },
    end: { line, character: character + token.toString().length },
  };

  console.log(JSON.stringify(range));
  return { message, range, severity: severity ? severity : DiagnosticSeverity.Error };
};

export const eolTokensToDiagnostic = (tokens: Token[]): Diagnostic | undefined => {
  if (tokens.filter((tkn: Token) => tkn.type != "space").length >= 1) {
    return tokensToDiagnostic(tokens, "New line expected.");
  }

  return null;
};

export const tokensToDiagnostic = (tokens: Token[], message: string): Diagnostic | undefined => {
  if (tokens.length >= 1) {
    let firstTkn = tokens[0];
    let lastTkn = tokens[tokens.length - 1];

    let range: Range = {
      start: { line: firstTkn.line - 1, character: firstTkn.col - 1 },
      end: { line: lastTkn.line - 1, character: lastTkn.col - 1 + lastTkn.text.length },
    };

    console.log(JSON.stringify(range));
    return { message, range };
  }

  return null;
};

export const tokensToString = (tokens: Token[]): string => tokens.map((tkn: Token) => tkn.text).join("");
