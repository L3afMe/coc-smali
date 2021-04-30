import { lexString } from "./tokenizer";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";
import { Token } from "moo";
import { tokensToDiagnostic, tokenToDiagnostic } from "./helper";
import { directiveSource, directiveSuper } from "./directive";

const handleLine = (tokens: Token[], isInMethod: boolean): Diagnostic[] => {
  let diagnostics: Diagnostic[] = [];
  switch (tokens[0].text) {
    case ".source":
      diagnostics = directiveSource(tokens, isInMethod);
      break;
    case ".super":
    case ".implements":
      diagnostics = directiveSuper(tokens, isInMethod);
      break;
  }
  return diagnostics;
};

export function validateDocument(document: TextDocument): Diagnostic[] {
  let diagnostics: Diagnostic[] = [];
  let lex = lexString(document.getText());

  let isInMethod: boolean = false;
  let superDeclaration: Token | undefined = null;
  let classDeclaration: Token | undefined = null;
  let hasReachedBlankLine: boolean = false;

  let lastToken: Token | undefined = null;
  let currentLine: Token[] = [];
  let errors: Token[] = [];
  for (let token of lex) {
    // if (token.type == "error") {
    //   errors.push(token);
    // } else if (lastToken && lastToken.type == "error") {
    //   let errorStr = errors.map((tkn: Token) => tkn.text).join("");
    //   diagnostics.push(tokensToDiagnostic(errors, `Unable to tokenize string '${errorStr}'`));
    //   errors = [];
    // }

    if (token.type == "newline") {
      if (lastToken && lastToken.type == "newline") {
        hasReachedBlankLine = true;
      }

      if (currentLine.length > 0) {
        handleLine(currentLine, isInMethod).forEach((diagnostic: Diagnostic) => diagnostics.push(diagnostic));
      }

      currentLine = [];
    } else if (currentLine.length != 0 || token.type != "space") {
      // Only push space if it isn't
      // the first character on the line
      // as Smali is indent insensitive

      currentLine.push(token);
    }

    if (token.type != "space") lastToken = token;

    if (token.type == "method") {
      if (token.text == ".method") {
        if (isInMethod) {
          diagnostics.push(tokenToDiagnostic(token, "Method directive cannot be inside a method block."));
        }

        isInMethod = true;
      } else {
        // Else found .end method
        if (!isInMethod) {
          diagnostics.push(tokenToDiagnostic(token, "End method directive must be at the end of a method block."));
        }

        isInMethod = false;
      }
    }

    console.log(`found ${JSON.stringify(token)}`);
    if (token.type == "directive") {
      if (token.text == ".class") {
        if (classDeclaration == null) {
          if (token.line != 1) {
            diagnostics.push(tokenToDiagnostic(token, `Class directive should be on line 1`, DiagnosticSeverity.Hint));
          }

          classDeclaration = token;
        } else {
          diagnostics.push(tokenToDiagnostic(token, `Class already declared on line ${classDeclaration.line}`));
        }
      }

      if (token.text == ".super") {
        if (superDeclaration == null) {
          if (hasReachedBlankLine) {
            diagnostics.push(
              tokenToDiagnostic(token, `Super directive should be in top directives block`, DiagnosticSeverity.Hint)
            );
          }

          superDeclaration = token;
        } else {
          diagnostics.push(tokenToDiagnostic(token, `Super already declared on line ${superDeclaration.line}`));
        }
      }
    }
  }

  let firstLine = document.getText().split("\n")[0];
  if (superDeclaration == null) {
    diagnostics.push({
      message: "Missage '.super' directive.\nShould extend 'java/lang/Object' by default",
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: firstLine.length - 1 },
      },
    });
  }

  if (classDeclaration == null) {
    diagnostics.push({
      message: "Missage '.class' directive",
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: firstLine.length - 1 },
      },
    });
  }

  return diagnostics;
}
