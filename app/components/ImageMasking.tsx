import { useState, useRef, useCallback } from "react";
import "./ImageMasking.css";

export interface Mask {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageMaskingProps {
  src: string;
  className?: string;
  masks?: Mask[];
  onMasksChange?: (masks: Mask[]) => void;
  hoveredMaskId?: string | null;
}

export default function ImageMasking({ 
  src, 
  className, 
  masks: externalMasks,
  onMasksChange,
  hoveredMaskId 
}: ImageMaskingProps) {
  const [internalMasks, setInternalMasks] = useState<Mask[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentMask, setCurrentMask] = useState<Mask | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부에서 제어되는 마스크를 사용하거나 내부 상태 사용
  const masks = externalMasks || internalMasks;
  const setMasks = onMasksChange || setInternalMasks;

  const getRelativePosition = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const position = getRelativePosition(event);
    setIsDrawing(true);
    setHasDragged(false);
    setStartPoint(position);
    setCurrentMask({
      id: Date.now().toString(),
      x: position.x,
      y: position.y,
      width: 0,
      height: 0,
    });
  }, [getRelativePosition]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    
    const position = getRelativePosition(event);
    const width = position.x - startPoint.x;
    const height = position.y - startPoint.y;
    
    // 드래그가 시작되었음을 표시 (최소 5px 이상 움직였을 때)
    if (!hasDragged && (Math.abs(width) > 5 || Math.abs(height) > 5)) {
      setHasDragged(true);
    }
    
    setCurrentMask(prev => prev ? {
      ...prev,
      width: Math.abs(width),
      height: Math.abs(height),
      x: width < 0 ? position.x : startPoint.x,
      y: height < 0 ? position.y : startPoint.y,
    } : null);
  }, [isDrawing, startPoint, hasDragged, getRelativePosition]);

  const handleMouseUp = useCallback(() => {
    if (currentMask && currentMask.width > 10 && currentMask.height > 10) {
      setMasks(prev => [...prev, currentMask]);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentMask(null);
    // 약간의 지연 후 hasDragged를 리셋 (클릭 이벤트가 발생하기 전에)
    setTimeout(() => setHasDragged(false), 0);
  }, [currentMask]);

  const handleMaskClick = useCallback((maskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // 드래그 중이거나 방금 드래그가 끝났다면 클릭 이벤트를 무시
    if (isDrawing || hasDragged) {
      return;
    }
    setMasks(prev => prev.filter(mask => mask.id !== maskId));
  }, [isDrawing, hasDragged]);

  const exportImage = useCallback(() => {
    if (!containerRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    
    if (!ctx || !img) return;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // 이미지 그리기
    ctx.drawImage(img, 0, 0);
    
    // 마스크 그리기
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;
    
    ctx.fillStyle = 'black';
    masks.forEach(mask => {
      ctx.fillRect(
        mask.x * scaleX,
        mask.y * scaleY,
        mask.width * scaleX,
        mask.height * scaleY
      );
    });
    
    // 다운로드
    const link = document.createElement('a');
    link.download = 'masked-image.png';
    link.href = canvas.toDataURL();
    link.click();
  }, [masks]);

  const clearAllMasks = useCallback(() => {
    setMasks([]);
  }, []);

  return (
    <div className={`image-masking-container ${className || ''}`}>
      {/* 컨트롤 버튼 */}
      <div className="image-masking-controls">
        <button
          onClick={clearAllMasks}
          disabled={masks.length === 0}
          className="image-masking-button image-masking-button-clear"
        >
          모든 마스크 제거
        </button>
        <button
          onClick={exportImage}
          disabled={masks.length === 0}
          className="image-masking-button image-masking-button-export"
        >
          이미지 다운로드
        </button>
        <span className="image-masking-counter">
          마스크 개수: {masks.length}
        </span>
      </div>

      {/* 이미지 컨테이너 */}
      <div
        ref={containerRef}
        className="image-masking-image-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={src}
          alt="마스킹할 이미지"
          className="image-masking-image"
          draggable={false}
        />
        
        {/* 기존 마스크들 */}
        {masks.map((mask) => (
          <div
            key={mask.id}
            className={`image-masking-mask ${hoveredMaskId === mask.id ? 'image-masking-mask-hovered' : ''}`}
            style={{
              left: mask.x,
              top: mask.y,
              width: mask.width,
              height: mask.height,
            }}
            onClick={(e) => handleMaskClick(mask.id, e)}
            title="클릭하여 삭제"
          />
        ))}
        
        {/* 현재 그리고 있는 마스크 */}
        {currentMask && (
          <div
            className="image-masking-current-mask"
            style={{
              left: currentMask.x,
              top: currentMask.y,
              width: currentMask.width,
              height: currentMask.height,
            }}
          />
        )}
      </div>
      
      {/* 사용법 안내 */}
      <div className="image-masking-instructions">
        <p className="image-masking-instructions-title">사용법:</p>
        <ul className="image-masking-instructions-list">
          <li className="image-masking-instructions-item">이미지에서 마우스를 클릭하고 드래그하여 마스크 영역을 선택하세요</li>
          <li className="image-masking-instructions-item">생성된 검은 마스크를 클릭하면 삭제됩니다</li>
          <li className="image-masking-instructions-item">마스크가 적용된 이미지를 다운로드할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}