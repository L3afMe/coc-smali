import {
  services,
  TransportKind,
  ServerOptions,
  ExtensionContext,
  LanguageClient,
  events,
  window,
  workspace,
  LanguageClientOptions,
  NotificationType,
  commands,
} from "coc.nvim";
import { DidChangeConfigurationNotification } from "vscode-languageserver";
import path from "path";

export type Settings = {
  enable?: boolean;
};

namespace ReadyNotification {
  export const type: NotificationType<any> = new NotificationType("smali/ready");
}

namespace ShowMessageNotification {
  export const type: NotificationType<string, any> = new NotificationType("smali/showMessage");
}

namespace ShowWarningMessageNotification {
  export const type: NotificationType<string, any> = new NotificationType("smali/showWarningMessage");
}

namespace ShowErrorMessageNotification {
  export const type: NotificationType<string, any> = new NotificationType("smali/showErrorMessage");
}

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration().get<any>("smali", {});
  if (!config.enable) return;

  const serverOptions: ServerOptions = {
    command: "/home/l3af/Projects/Rust/smali-lsp/target/debug/smali-lsp",
    // Use old builtin LSP
    // module: context.asAbsolutePath(path.join("lib", "server.js")),
    transport: TransportKind.stdio,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: ["smali"],
    synchronize: {
      configurationSection: ["smali"],
      fileEvents: workspace.createFileSystemWatcher("**/*.smali"),
    },
    outputChannelName: "coc-smali",
    diagnosticCollectionName: "coc-smali",
    middleware: {
      workspace: {
        didChangeConfiguration: () =>
          client.sendNotification(DidChangeConfigurationNotification.type as any, { settings: getSettings() }),
      },
    },
  };

  const client = new LanguageClient("coc-smali", "Smali language server", serverOptions, clientOptions);
  context.subscriptions.push(services.registLanguageClient(client));

  client.onReady().then(() => {
    client.sendNotification(ReadyNotification.type);
  });

  client.onNotification(ShowMessageNotification.type, window.showMessage);
  client.onNotification(ShowErrorMessageNotification.type, window.showErrorMessage);
  client.onNotification(ShowWarningMessageNotification.type, window.showWarningMessage);

  context.subscriptions.push(
    commands.registerCommand("smali.format", async () => {
      const doc = await workspace.document;

      if (!doc) {
        window.showErrorMessage("Unable to get current document");
        return;
      }

      if (doc.filetype != "smali") {
        window.showErrorMessage("Current document is not smali");
        return;
      }

      window.showMessage("Formatting");
    })
  );
}

function getSettings(): Settings {
  const defaultSettings: Settings = {
    enable: true,
  };

  return defaultSettings;
}
