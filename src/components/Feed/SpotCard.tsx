import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { SpotDetail } from "../../types/spot.types";
import { translateCategory } from "../../utils/categoryMapper";

interface SpotCardProps {
  spot: SpotDetail;
  index: number;
  day: number;
  isEditing: boolean;
  onDelete?: () => void;
}

const SpotCard = ({ spot, index, day, isEditing, onDelete }: SpotCardProps) => {
  const getFirstImage = () => {
    if (!spot.imageUrls) return undefined;
    if (typeof spot.imageUrls === "string") {
      try {
        const parsed = JSON.parse(spot.imageUrls);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        return spot.imageUrls;
      }
    }
    if (Array.isArray(spot.imageUrls)) return spot.imageUrls[0];
    return undefined;
  };

  const imageUrl = getFirstImage();

  return (
    <Draggable
      key={`${day}-${spot.id}`}
      draggableId={`${day}-${spot.id}`}
      index={index}
      isDragDisabled={!isEditing}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center gap-4 p-3 bg-white border-b border-gray-200 mb-2 ${
            isEditing ? "cursor-grab" : ""
          }`}
        >
            <div className="flex">{index + 1}</div>
          {/* 이미지 */}
          <div className="w-16 h-16 flex-shrink-0 rounded-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={spot.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-full text-gray-400">
                FLIK
              </div>
            )}
          </div>

          {/* 이름 + 한글 카테고리 */}
            <div className="flex-1 space-y-1">
                
              <div className="inline-flex flex-col bg-blue-500 mb-1.5 px-1 py-0.5">
                <div className="text-center text-white text-[10px] font-normal font-['Pretendard'] leading-3">
                  {translateCategory(spot.category)}
                </div>
              </div>
              <div className="text-start text-gray-700 text-xs font-semibold font-['Pretendard'] leading-3">
                {spot.name}
              </div>
              <div className="text-start text-gray-500 text-[10px] font-normal font-['Pretendard'] leading-3">
                {spot.address}
              </div>
            </div>

          {isEditing && (
            <button
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600 text-xl ml-3"
              title="삭제"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default SpotCard;
