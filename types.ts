export type Operator = '+' | '-' | '×' | '÷' | null;

export enum ButtonType {
  Number,
  Operator,
  Action,
  Special
}

export interface CalculatorState {
  currentInput: string;
  previousInput: string | null;
  operator: Operator;
  isResult: boolean; // Flag to check if the current display is a result of a previous calc
  isEasterEggActive: boolean;
}