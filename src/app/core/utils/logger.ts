import { InjectionToken } from '@angular/core'

export const LOGGER_OPTIONS = new InjectionToken<LoggerOptions>('Logger Options');

export interface LoggerOptions {
  enabled?: boolean;
  debug?: boolean;
}

export abstract class Logger {
  /** Write a log message. */
  abstract log(...args: any[]): void;

  /** Write an information message. */
  abstract info(...args: any[]): void;

  /** Write a warning message. */
  abstract warn(...args: any[]): void;

  /** Write an error message. */
  abstract error(...args: any[]): void;

  /** Write a debug message. */
  abstract debug(...args: any[]): void;

  /** Create a new inline group. */
  abstract group(groupTitle?: string): void;

  /** Exit the current inline group. */
  abstract groupEnd(): void;
}

const noop = (): any => undefined

export class ConsoleLogger implements Logger {
  constructor(private _console: Console, private _debugEnabled: boolean = true) {}

  log(...args: any[]): void { this._invokeConsoleMethod('log', args); }

  info(...args: any[]): void { this._invokeConsoleMethod('info', args); }

  warn(...args: any[]): void { this._invokeConsoleMethod('warn', args); }

  error(...args: any[]): void { this._invokeConsoleMethod('error', args); }

  debug(...args: any[]): void {
    if (this._debugEnabled) this._invokeConsoleMethod('debug', args);
  }

  group(groupTitle?: string): void {
    const args = groupTitle != null ? [groupTitle] : [];
    this._invokeConsoleMethod('group', args);
  }

  groupEnd(): void { this._invokeConsoleMethod('groupEnd'); }

  private _invokeConsoleMethod(type: string, args?: any[]): void {
    let logFn: Function = (<any>this._console)[type] || this._console.log || noop

    logFn.apply(this._console, args)
  }
}

export class NoOpLogger implements Logger {
  log(): void {}

  info(): void {}

  warn(): void {}

  error(): void {}

  debug(): void {}

  group(): void {}

  groupEnd(): void {}
}