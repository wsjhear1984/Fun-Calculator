import React, { useState, useEffect } from 'react';
import { CalculatorState, ButtonType, Operator } from '../types';
import Button from './Button';
import ChristmasScreen from './ChristmasScreen';
import { History } from 'lucide-react';

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    currentInput: '0',
    previousInput: null,
    operator: null,
    isResult: false,
    isEasterEggActive: false,
  });

  // Handle keyboard events for accessibility and power usage
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (/[0-9]/.test(key)) handleNumber(key);
      if (key === '.') handleNumber('.');
      if (key === 'Enter' || key === '=') handleEqual();
      if (key === 'Escape') handleClear();
      if (key === 'Backspace') handleDelete();
      if (key === '+') handleOperator('+');
      if (key === '-') handleOperator('-');
      if (key === '*') handleOperator('×');
      if (key === '/') handleOperator('÷');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleNumber = (num: string) => {
    setState((prev) => {
      // Prevent multiple decimals
      if (num === '.' && prev.currentInput.includes('.')) return prev;

      // Start new number if we just showed a result or currently show '0' (unless adding decimal)
      if (prev.isResult || (prev.currentInput === '0' && num !== '.')) {
        return {
          ...prev,
          currentInput: num,
          isResult: false,
        };
      }

      // Limit length
      if (prev.currentInput.length > 9) return prev;

      return {
        ...prev,
        currentInput: prev.currentInput + num,
      };
    });
  };

  const handleOperator = (op: Operator) => {
    setState((prev) => {
      // If we already have a pending operation, calculate it first before starting next
      if (prev.previousInput && prev.operator && !prev.isResult) {
        const result = calculate(prev.previousInput, prev.currentInput, prev.operator);
        return {
          ...prev,
          currentInput: result.toString(),
          previousInput: result.toString(),
          operator: op,
          isResult: true,
        };
      }

      return {
        ...prev,
        previousInput: prev.currentInput,
        operator: op,
        isResult: true, // We want the next number press to replace currentInput
      };
    });
  };

  const handleEqual = () => {
    setState((prev) => {
      if (!prev.operator || !prev.previousInput) return prev;

      // EASTER EGG CHECK
      // "when users input 47000/188"
      if (
        prev.previousInput === '47000' &&
        prev.operator === '÷' &&
        prev.currentInput === '188'
      ) {
        return {
          ...prev,
          isEasterEggActive: true,
        };
      }

      const result = calculate(prev.previousInput, prev.currentInput, prev.operator);

      return {
        ...prev,
        currentInput: result.toString(),
        previousInput: null,
        operator: null,
        isResult: true,
      };
    });
  };

  const calculate = (a: string, b: string, op: Operator): number | string => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return 0;

    switch (op) {
      case '+': return numA + numB;
      case '-': return numA - numB;
      case '×': return numA * numB;
      case '÷': 
        if (numB === 0) return 'Error';
        // Handle floating point precision errors simply
        return parseFloat((numA / numB).toPrecision(12));
      default: return numB;
    }
  };

  const handleClear = () => {
    setState({
      currentInput: '0',
      previousInput: null,
      operator: null,
      isResult: false,
      isEasterEggActive: false,
    });
  };

  const handleToggleSign = () => {
    setState((prev) => ({
      ...prev,
      currentInput: (parseFloat(prev.currentInput) * -1).toString(),
    }));
  };

  const handlePercentage = () => {
    setState((prev) => ({
      ...prev,
      currentInput: (parseFloat(prev.currentInput) / 100).toString(),
    }));
  };

  const handleDelete = () => {
     setState(prev => {
         if (prev.isResult) return prev; // Don't backspace a result
         if (prev.currentInput.length === 1) {
             return { ...prev, currentInput: '0' };
         }
         return { ...prev, currentInput: prev.currentInput.slice(0, -1) };
     });
  };

  // Format display number with commas
  const formatDisplay = (numStr: string) => {
    if (numStr === 'Error') return 'Error';
    if (numStr === '-') return '-0';
    
    // Split into integer and decimal parts
    const parts = numStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return formattedInteger + decimalPart;
  };

  const closeEasterEgg = () => {
      setState({
          currentInput: '0',
          previousInput: null,
          operator: null,
          isResult: false,
          isEasterEggActive: false
      });
  };

  return (
    <div className="relative bg-black w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-gray-800">
      
      {state.isEasterEggActive && <ChristmasScreen onReset={closeEasterEgg} />}

      {/* Display Area */}
      <div className="mb-6 flex flex-col items-end justify-end h-32 px-2">
        <div className="text-gray-400 text-lg h-6 flex items-center gap-1">
           {state.previousInput && (
             <>
               <span>{formatDisplay(state.previousInput)}</span>
               <span>{state.operator}</span>
             </>
           )}
        </div>
        <div className="text-white text-6xl font-light tracking-tight overflow-x-auto whitespace-nowrap w-full text-right scrollbar-hide">
          {formatDisplay(state.currentInput)}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Button label="AC" onClick={handleClear} type={ButtonType.Action} />
        <Button label="+/-" onClick={handleToggleSign} type={ButtonType.Action} />
        <Button label="%" onClick={handlePercentage} type={ButtonType.Action} />
        <Button label="÷" onClick={() => handleOperator('÷')} type={ButtonType.Operator} />

        <Button label="7" onClick={handleNumber} />
        <Button label="8" onClick={handleNumber} />
        <Button label="9" onClick={handleNumber} />
        <Button label="×" onClick={() => handleOperator('×')} type={ButtonType.Operator} />

        <Button label="4" onClick={handleNumber} />
        <Button label="5" onClick={handleNumber} />
        <Button label="6" onClick={handleNumber} />
        <Button label="-" onClick={() => handleOperator('-')} type={ButtonType.Operator} />

        <Button label="1" onClick={handleNumber} />
        <Button label="2" onClick={handleNumber} />
        <Button label="3" onClick={handleNumber} />
        <Button label="+" onClick={() => handleOperator('+')} type={ButtonType.Operator} />

        <Button label="0" onClick={handleNumber} doubleWidth className="pl-8" />
        <Button label="." onClick={handleNumber} />
        <Button label="=" onClick={handleEqual} type={ButtonType.Special} />
      </div>
      
      {/* Decorative Bottom Bar (iOS style) */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full mt-4"></div>
    </div>
  );
};

export default Calculator;