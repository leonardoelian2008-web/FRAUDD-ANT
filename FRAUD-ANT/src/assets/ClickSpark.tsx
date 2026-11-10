
import { useState } from 'react';
import type { ReactNode, MouseEvent, CSSProperties } from 'react';
import './ClickSpark.css';

interface ClickSparkProps {
  children: ReactNode;
}

interface Spark {
  id: number;
  x: number;
  y: number;
}

export default function ClickSpark({ children }: ClickSparkProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const id = nextId;

    const newSpark: Spark = {
      id,
      x: event.clientX,
      y: event.clientY,
    };

    setSparks((prev) => [...prev, newSpark]);
    setNextId((prev) => prev + 1);
  };

  const removeSpark = (id: number) => {
    setSparks((prev) => prev.filter((spark) => spark.id !== id));
  };

  return (
    <div className="click-spark-wrapper" onClick={handleClick}>
      {children}

      <div className="click-spark-overlay">
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="click-spark-burst"
            style={{
              left: spark.x,
              top: spark.y,
            }}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className="click-spark-particle"
                onAnimationEnd={
                  index === 0
                    ? () => removeSpark(spark.id)
                    : undefined
                }
                style={{
                  '--angle': `${index * 36}deg`,
                  backgroundColor:
                    index % 2 === 0 ? '#22C55E' : '#FACC15',
                } as CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
