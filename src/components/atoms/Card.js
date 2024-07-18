import './card.css'
function Card({ children,customClass }) {
  return <div className={`card ${customClass}`}>{children}</div>;
}

export default Card;
