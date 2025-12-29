// src/components/GradientHeader.jsx
export default function GradientHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-hero text-text-primary bg-clip-text text-transparent bg-gradient-primary">
        {title}
      </h1>
      {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
    </div>
  );
}