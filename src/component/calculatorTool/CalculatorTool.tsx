import { useState } from "react";
import styled from "styled-components";
import { Layout } from "../layout/NormalLayout";
import { NumBtn, ArithmeticBtn, ResultBtn } from "./ArithmeticButton";
const CalculatorTool = () => {
  const numArr = [7, 8, 9, 4, 5, 6, 1, 2, 3, "C", 0, "."];
  const arithmeticArr = ["+", "-", "×", "÷"];
  const [ result, setResult] = useState("");

  const handleCalCulClick = (value: number | string) => {
    if (typeof value === "string" && value === "C") {
      setResult("");
    } else {
      setResult(`${result}${value}`);
    }
  };

  const handleArithmeticResult = () => {
    const preValue = calculateExpression(result);
    setResult(`結果為${preValue}`)
  };

  function calculateExpression(expression: string): number {
    const operators: string[] = ['*', '/', '+', '-'];
    const tokens: string[] = expression.match(/\d+(\.\d+)?|[\+\-\*\/\(\)]/g) || [];
  
    const outputQueue: (number | string)[] = [];
    const operatorStack: string[] = [];
  
    const precedence = (operator: string): number => {
      if (operator === '*' || operator === '/') {
        return 2;
      } else if (operator === '+' || operator === '-') {
        return 1;
      } else {
        return 0;
      }
    };
  
    const applyOperation = (operator: string, operand1: number, operand2: number): number => {
      switch (operator) {
        case '+':
          return operand1 + operand2;
        case '-':
          return operand1 - operand2;
        case '*':
          return operand1 * operand2;
        case '/':
          if (operand2 === 0) {
            throw new Error('除數不得為0');
          }
          return operand1 / operand2;
        default:
          throw new Error('無效操作');
      }
    };
  
    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        outputQueue.push(parseFloat(token));
      } else if (operators.includes(token)) {
        while (
          operatorStack.length > 0 &&
          precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)
        ) {
          outputQueue.push(operatorStack.pop() as string);
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop() as string);
        }
        if (operatorStack[operatorStack.length - 1] === '(') {
          operatorStack.pop();
        }
      }
    }
  
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop() as string);
    }
  
    const evaluationStack: number[] = [];
  
    for (const token of outputQueue) {
      if (!isNaN(token as number)) {
        evaluationStack.push(token as number);
      } else if (operators.includes(token as string)) {
        const operand2 = evaluationStack.pop() as number;
        const operand1 = evaluationStack.pop() as number;
        evaluationStack.push(applyOperation(token as string, operand1, operand2));
      }
    }
  
    return evaluationStack.pop() as number;
  }
  
    



  return (
    <Layout>
      <div style={{ width: "300px" }}>
        {/* 顯示計算區 */}
        <div>
          <CalInput
            type="text"
            value={result}
            placeholder="0"
            readOnly
          />
        </div>
        {/* 按鈕區 */}
        <Buttons>
          {/* 數字按鈕 */}
          <div>
            {numArr.map((item, index) => (
              <NumBtn key={index} onClick={() => handleCalCulClick(item)}>{item}</NumBtn>
            ))}
          </div>
          {/* 算法按鈕 */}
          <div>
            {arithmeticArr.map((item, index) => (
              <ArithmeticBtn key={index} onClick={() => handleCalCulClick(item)}>
                {item}
              </ArithmeticBtn>
            ))}

            <ResultBtn onClick={handleArithmeticResult}>=</ResultBtn>
          </div>
        </Buttons>
      </div>
    </Layout>
  );
};

export default CalculatorTool;



const CalInput = styled.input`
  width: 264px;
  margin: 1rem 0.5rem;
  height: 35px;
  text-align: right;
  padding: 0.4rem 0.8rem;
  font-size: 1.6rem;
  border: 1px solid #999999;
  border-radius: 4px;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  gap: 3px;
`;
