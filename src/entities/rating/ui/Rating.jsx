"use client";
import { useState, useCallback } from "react";
import styled from "styled-components";

export default function Rating({ value, onChange }) {
  const [hover, setHover] = useState(null);

  const handleClick = useCallback(
    (star) => {
      onChange(star); // обновляем только рейтинг
    },
    [onChange]
  );

  return (
    <StyledWrapper>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = hover ? star <= hover : star <= value;
          return (
            <svg
              key={star}
              className={`star ${active ? "active" : ""}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleClick(star)}
              viewBox="0 0 24 24"
            >
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
            </svg>
          );
        })}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .rating {
    display: flex;
    gap: 0.4rem;
  }

  .star {
    width: 28px;
    height: 28px;
    cursor: pointer;
    fill: transparent;
    stroke: #999;
    transition: fill 0.2s, stroke 0.2s, transform 0.15s;
  }

  .star:hover {
    transform: scale(1.1);
  }

  .star.active {
    fill: #ffc73a;
    stroke: #ffc73a;
  }

  .star.active:hover {
    transform: scale(1.1);
  }
`;
