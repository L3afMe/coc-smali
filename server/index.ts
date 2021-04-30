import {
  Connection,
  TextDocuments,
  InitializeParams,
  InitializeResult,
  ServerCapabilities,
  TextDocumentSyncKind,
  DidSaveTextDocumentParams,
  DidOpenTextDocumentParams,
  CompletionParams,
  CancellationToken,
  CompletionItem,
  CompletionList,
  HoverParams,
  DocumentSymbolParams,
  DocumentFormattingParams,
  DocumentColorParams,
  ColorPresentationParams,
  FoldingRangeParams,
  SelectionRangeParams,
  DefinitionParams,
  NotificationType,
  NotificationHandler,
  TextDocumentChangeEvent,
  Definition,
} from "vscode-languageserver";
import { createConnection } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Settings } from "../src/index";
import { LanguageServer, ShowErrorMessageNotification } from "./lsp";

export namespace ReadyNotification {
  export const type: NotificationType<any> = new NotificationType("smali/ready");
}

const conn: Connection = createConnection();
const docs = new TextDocuments(TextDocument);
const lsp = new LanguageServer(conn);

console.log = conn.console.log.bind(conn.console);
console.error = conn.console.error.bind(conn.console);

conn.onInitialize(
  (params: InitializeParams): InitializeResult => {
    lsp.doInit(params);

    conn.onShutdown(() => {
      lsp.dispose();
    });

    const capabilities: ServerCapabilities = {
      textDocumentSync: TextDocumentSyncKind.Full,
      completionProvider: {
        resolveProvider: true,
        //triggerCharacters: ['"', ":", "L"],
      },
      hoverProvider: true,
      documentSymbolProvider: true,
      colorProvider: {},
      foldingRangeProvider: true,
      selectionRangeProvider: true,
      definitionProvider: true,
    };

    return { capabilities };
  }
);

conn.onNotification(ReadyNotification.type, () => {
  conn.console.log(`onNotification: ReadyNotification`);
});

conn.onDidChangeConfiguration((_change: { settings: Settings }) => {
  docs.all().forEach(validateTextDocument);
});

docs.onDidChangeContent((change: TextDocumentChangeEvent<TextDocument>) => {
  validateTextDocument(change.document);
});

conn.onDidSaveTextDocument((params: DidSaveTextDocumentParams) => {
  conn.console.log(`onDidSaveTextDocument: ${JSON.stringify(params)}`);
});

conn.onDidOpenTextDocument((params: DidOpenTextDocumentParams) => {
  conn.console.log(`onDidOpenTextDocument: ${JSON.stringify(params)}`);
});

conn.onCompletion(
  async (params: CompletionParams, _token: CancellationToken): Promise<CompletionItem[] | CompletionList> => {
    const doc = docs.get(params.textDocument.uri);

    if (!doc) {
      return null;
    }

    return lsp.doComplete(doc, params.position);
  }
);

conn.onInitialized((handler: NotificationHandler<InitializeParams>) => {
  conn.console.log(`onInitialized: ${JSON.stringify(handler)}`);
});

conn.onHover((params: HoverParams, _token: CancellationToken) => {
  conn.console.log(`onHover: ${JSON.stringify(params)}`);
  return null;
});

conn.onDocumentSymbol((params: DocumentSymbolParams, _token: CancellationToken) => {
  conn.console.log(`onDocumentSymbol: ${JSON.stringify(params)}`);
  return null;
});

conn.onDocumentRangeFormatting((params: DocumentFormattingParams, _token: CancellationToken) => {
  conn.console.log(`onDocumentRangeFormatting: ${JSON.stringify(params)}`);
  return null;
});

conn.onDocumentColor((params: DocumentColorParams, _token: CancellationToken) => {
  conn.console.log(`onDocumentColor: ${JSON.stringify(params)}`);
  return null;
});

conn.onColorPresentation((params: ColorPresentationParams, _token: CancellationToken) => {
  conn.console.log(`onColorPresentation: ${JSON.stringify(params)}`);
  return null;
});

conn.onFoldingRanges((params: FoldingRangeParams, _token: CancellationToken) => {
  conn.console.log(`onFoldingRanges: ${JSON.stringify(params)}`);
  return null;
});

conn.onSelectionRanges((params: SelectionRangeParams, _token: CancellationToken) => {
  conn.console.log(`onSelectionRanges: ${JSON.stringify(params)}`);
  return null;
});

conn.onDefinition((params: DefinitionParams, _token: CancellationToken) => {
  conn.console.log(`onDefinition: ${JSON.stringify(params)}`);
  let test: Definition = {
    uri: params.textDocument.uri,
    range: {
      start: {
        line: 1,
        character: 1
      },
      end: {
        line: 1,
        character: 5
      },
    }
  }

  return test;
});

async function validateTextDocument(textDocument: TextDocument) {
  try {
    if (textDocument.languageId === "smali") {
      const doc = docs.get(textDocument.uri);
      if (doc && doc.version === textDocument.version) {
        conn.sendDiagnostics({ uri: doc.uri, diagnostics: lsp.doValidation(doc) });
      }
    }
  } catch (e) {
    conn.console.error(`Error while validating ${textDocument.uri}`);
    conn.console.error(`${JSON.stringify(e)}`);
    conn.sendNotification(ShowErrorMessageNotification.type, `Error while validating ${textDocument.uri}`)
  }
}

docs.listen(conn);
conn.listen();
