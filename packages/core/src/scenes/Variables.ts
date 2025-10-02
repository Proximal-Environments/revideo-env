import type {SimpleSignal} from '../signals';
import {createSignal} from '../signals';
import type {Scene} from './Scene';

export class Variables {
  private signals: {[key: string]: SimpleSignal<any>} = {};
  // Project variables are intentionally ignored to disable parameterized videos.
  // Keeping the field for compatibility but it no longer affects signals.
  private variables: Record<string, unknown> = {};

  public constructor(private readonly scene: Scene) {
    scene.onReset.subscribe(this.handleReset);
  }

  /**
   * Get variable signal if exists or create signal if not
   *
   * @param name - The name of the variable.
   * @param initial - The initial value of the variable. It will be used if the
   *                  variable was not configured from the outside.
   */
  public get<T>(name: string, initial: T): () => T {
    // Always use the provided initial value. Any externally supplied
    // project variables are intentionally ignored.
    this.signals[name] ??= createSignal(initial);
    return () => this.signals[name]();
  }

  /**
   * Update all signals with new project variable values.
   */
  public updateSignals(_variables: Record<string, unknown>) {
    // Intentionally a no-op. External variables should not update signals.
  }

  /**
   * Reset all stored signals.
   */
  public handleReset = () => {
    this.signals = {};
  };
}
