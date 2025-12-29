// src/components/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-card p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}