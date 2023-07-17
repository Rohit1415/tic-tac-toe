import { square } from "../model/model";
import "../style/style.css";

const Square = ({ value, onClick, disabled }: square) => {
  return (
    <div className="container">
      <button className={`square ${value === "X" ? "x" : value === "O" ? "o" : ""}`}
      onClick={onClick}
      disabled={disabled}>
        {value}
      </button>
    </div>
  );
};

export default Square;
