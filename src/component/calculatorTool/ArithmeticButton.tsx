import styled from "styled-components";

const CalBtn = styled.button`
  background-color: white;
  border: 1px solid #999999;
  border-radius: 3px;
  font-size: 16px;
  margin: 0.2rem;
  cursor: pointer;
  &:hover {
    background-color: lightgray;
  }
`;

export const NumBtn = styled(CalBtn)`
  width: 70px;
  height: 50px;
`;

export const ArithmeticBtn = styled(CalBtn)`
  width: 52px;
  height: 38.6px;
`;
export const ResultBtn = styled(ArithmeticBtn)`
  background-color: #1076ec;
  color: white;
`;
