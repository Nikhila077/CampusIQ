import LightPillar from './LightPillar.jsx';

export function Scene(props) {
  return (
    <LightPillar
      topColor="#F4F7F5"
      bottomColor="#3B8F83"
      intensity={0.8}
      rotationSpeed={0.2}
      glowAmount={0.003}
      pillarWidth={3.0}
      pillarHeight={0.4}
      noiseIntensity={0.5}
      pillarRotation={0}
      interactive={true}
      mixBlendMode="normal"
      quality="high"
      lightMode={true}
      {...props}
    />
  );
}

export default Scene;
