import {
  InitializeParams,
  CompletionItem,
  CompletionList,
  Connection,
  Diagnostic,
  NotificationType,
} from "vscode-languageserver";
import { Position, TextDocument } from "vscode-languageserver-textdocument";
import { validateDocument } from "./lsp/validator";

export namespace ShowMessageNotification {
  export const type: NotificationType<string, any> = new NotificationType("smali/showMessage");
}

export namespace ShowWarningMessageNotification {
  export const type: NotificationType<string, any> = new NotificationType("smali/showWarningMessage");
}

export namespace ShowErrorMessageNotification {
  export const type: NotificationType<string, any> = new NotificationType("smali/showErrorMessage");
}

export class LanguageServer {
  conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
    this.conn.sendNotification("smali/showMessage", "Initializing smali LSP");
  }

  doInit(_params: InitializeParams): void {
    this.conn.sendNotification("smali/showMessage", "Initialized smali LSP");
  }

  doValidation(document: TextDocument): Diagnostic[] {
    this.conn.sendNotification("smali/showMessage", "Validating smali");
    return validateDocument(document);
  }

  doComplete(doc: TextDocument, pos: Position): CompletionList | CompletionItem[] {
    this.conn.sendNotification("smali/showMessage", "Doing completion");

    let text = doc.getText();
    let currentLine = text.split("\n")[pos.line];
    let lineUpToCursor = currentLine.substr(0, pos.character);
    let currentWord = lineUpToCursor.substr(lineUpToCursor.lastIndexOf(" "));

    let comps: CompletionItem[] = [];
    if (!lineUpToCursor.startsWith(" ") && !lineUpToCursor.includes(" ")) {
      let directives = [
        {
          label: ".implements",
          detail: "Test",
          singular: true,
        },
        {
          label: ".source",
          detail: "Test",
          singular: true,
        },
        {
          label: ".class",
          detail: "Test",
          singular: true,
        },
        {
          label: ".super",
          detail: "Test",
          singular: true,
        },
        {
          label: ".method",
          detail: "method desc",
          singular: false,
        },
        {
          label: ".field",
          detail: "field desc",
          singular: false,
        },
      ];

      for (let directive of directives) {
        if ((!directive.singular || !text.includes(directive.label)) && directive.label.startsWith(lineUpToCursor)) {
          comps.push(directive);
        }
      }
    }

    if (lineUpToCursor.trim().startsWith(".field") || lineUpToCursor.trim().startsWith(".method")) {
      let visibilities = [
        {
          label: "public",
          detail: "Available to all classes",
        },
        {
          label: "private",
          detail: "Only available to current class",
        },
        {
          label: "protected",
          detail: "Only available to current package",
        },
      ];

      if (visibilities.filter(vis => currentLine.includes(vis.label)).length == 0) {
        for (let visibility of visibilities) {
          comps.push(visibility);
        }
      }
    }

    return comps;
  }
  dispose() {
    return;
  }
}
