import { useStorage, useMutation} from '@liveblocks/react';
import { is } from 'date-fns/locale';
import React, { memo, useRef, useState } from 'react'
import { FaCaretDown } from "react-icons/fa";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/app/constants';

const markers = Array.from({length: 83}, (_,i) => i)
const Ruler = () =>{
  const leftMargin =
    useStorage((root) => root.leftMargin) || LEFT_MARGIN_DEFAULT;
  const setLeftMargin = useMutation(({ storage }, position: number) => {
    storage.set("leftMargin", position);
  }, []);
  const rightMargin =
    useStorage((root) => root.rightMargin) || RIGHT_MARGIN_DEFAULT;
  const setRightMargin = useMutation(({ storage }, position: number) => {
    storage.set("rightMargin", position);
  }, []);


  // const [leftMargin, setLeftMargin] = useState(56);
  // const [rightMargin, setRightMargin] = useState(56);

  const [isDragingLeft, setIsDragingLeft] = useState(false);
  const [isDragingRight, setIsDragingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  
  const handleLeftMouseDown = () => {
    setIsDragingLeft(true);
  }
  const handleRightMouseDown = () => {
    setIsDragingRight(true);
  }

  const handleMouseMove = (e: React.MouseEvent) => { 
    const containerWidth = 816;
    const constrainedDistance = 50;
    if((isDragingLeft || isDragingRight) && rulerRef.current){
      const container = rulerRef.current.querySelector("#ruler-container");
      if(container) {
        // 获取容器相对于视窗的位置和尺寸
        const containerRect = container.getBoundingClientRect();

        // 计算鼠标相对于容器左边缘的水平位置
        const relativeX = e.clientX - containerRect.left;

        // rawPosition 是鼠标相对于容器左边缘的水平位置，范围在 0 到 816
        const rawPosition = Math.max(0, Math.min(816, relativeX));

        // 这里应该更新对应标记的位置
        if (isDragingLeft) {
          //两个标点之间的距离必须间隔50
          const maxLeftPosition = containerWidth - rightMargin - constrainedDistance;
          //如果鼠标拖到超过左边距最大允许位置, 则取最大允许距离
          const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
          
          setLeftMargin(newLeftPosition);
        }
        else if (isDragingRight) {
          const maxRightPosition = containerWidth - leftMargin - constrainedDistance;

          //将鼠标位置转换为右边距值
          const newRightPosition = Math.max(containerWidth - rawPosition, 0);
          //如果鼠标拖到超过右边距最大允许位置, 则取最大允许距离
          const constrainedRightPosition = Math.min(maxRightPosition, newRightPosition);
          setRightMargin(constrainedRightPosition);
        }
      }


    }
  }

  const handleMouseUp = () => {
    setIsDragingLeft(false);
    setIsDragingRight(false);
  }

  const handleLeftDoubleClick = () => {
    setLeftMargin(LEFT_MARGIN_DEFAULT);
  }
  const handleRightDoubleClick = () => {
    setRightMargin(RIGHT_MARGIN_DEFAULT);
  }



  return (
    <div
      className="h-6 border-b border-gray-300 flex flex-end relative select-none print:hidden"
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div id="ruler-container" className="w-[816px] mx-auto relative">
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDragingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDragingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        {markers.map((marker) => {
          const position = (marker * 816) / 82;
          return (
            <div
              key={marker}
              className="absolute bottom-0"
              style={{ left: `${position}px` }}
            >
              {marker % 10 === 0 && (
                <div>
                  <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500"></div>
                  <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                    {marker / 10 + 1}
                  </span>
                </div>
              )}
              {marker % 5 === 0 && marker % 10 !== 0 && (
                <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500"></div>
              )}
              {marker % 5 !== 0 && (
                <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Ruler)

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick();
  };

  return (
    <div
      className="absolute w-4 h-full cursor-ew-resize z-[5]"
      style={{ [isLeft ? "left" : "right"]: `${position-5}px` }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <FaCaretDown className="h-full fill-blue-500" />
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-[100vh] bg-[#3b72f6]"
        style={{ display: isDragging ? "block" : "none" }}
      />
    </div>
  );
};
