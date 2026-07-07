import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';

export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  tags: { text: string; type: 'featured' | 'default' }[];
  stats: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string; }[];
  avatarGradient: string;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  visibleBehind?: number;
}

export const TestimonialStack = ({ testimonials, visibleBehind = 2 }: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = testimonials.length;

  const navigate = useCallback((newIndex: number) => {
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add('testimonial-dragging');
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStartRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    cardRefs.current[activeIndex]?.classList.remove('testimonial-dragging');
    if (Math.abs(dragOffset) > 50) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  if (!testimonials?.length) return null;

  return (
    <div className="testimonial-stack-container">
      {testimonials.map((testimonial, index) => {
        const displayOrder = (index - activeIndex + totalCards) % totalCards;

        const style: CSSProperties = {};
        if (displayOrder === 0) { 
          style.transform = `translateX(${dragOffset}px)`;
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) { 
          const scale = 1 - 0.05 * displayOrder;
          const translateY = 20 * displayOrder; 
          style.transform = `scale(${scale}) translateY(${translateY}px)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else { 
          style.transform = 'scale(0)';
          style.opacity = 0;
          style.zIndex = 0;
        }

        return (
          <div
            ref={el => { cardRefs.current[index] = el; }}
            key={testimonial.id}
            className="testimonial-card"
            style={style}
            onMouseDown={(e) => handleDragStart(e, index)}
            onTouchStart={(e) => handleDragStart(e, index)}
          >
            <div className="testimonial-content">
              <div className="testimonial-header">
                <div className="testimonial-avatar" style={{ background: testimonial.avatarGradient }}>
                  {testimonial.initials}
                </div>
                <div>
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
              
              <blockquote className="testimonial-quote">"{testimonial.quote}"</blockquote>
              
              <div className="testimonial-footer">
                <div className="testimonial-tags">
                  {testimonial.tags.map((tag, i) => (
                    <span key={i} className={`testimonial-tag ${tag.type}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
                <div className="testimonial-stats">
                  {testimonial.stats.map((stat, i) => {
                    const IconComponent = stat.icon;
                    return (
                      <span key={i} className="testimonial-stat-item">
                        <IconComponent width={14} height={14} style={{ marginRight: 4 }} />
                        {stat.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="testimonial-pagination">
        {testimonials.map((_, index) => (
          <button 
            key={index} 
            aria-label={`Go to testimonial ${index + 1}`} 
            onClick={() => navigate(index)} 
            className={`testimonial-dot ${activeIndex === index ? 'active' : ''}`} 
          />
        ))}
      </div>
    </div>
  );
};
