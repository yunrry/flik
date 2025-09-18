import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import SpotCard from "../Feed/SpotCard";

interface DaySpotsProps {
  dayData: any;
  isEditing: boolean;
  onDeleteSpot: (day: number, index: number) => void;
}

const DaySpots = ({ dayData, isEditing, onDeleteSpot }: DaySpotsProps) => {
  if (dayData.loading) {
    return <div className="text-sm text-gray-500">스팟 정보를 불러오는 중...</div>;
  }

  if (dayData.error) {
    return <div className="text-sm text-red-600">{dayData.error}</div>;
  }

  return (
    <Droppable droppableId={dayData.day.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="rounded-lg min-h-[120px] w-full"
        >
          {dayData.spots.map((spot: any, index: number) => (
            <SpotCard
              key={`${dayData.day}-${spot.id}`}
              spot={spot}
              index={index}
              isEditing={isEditing}
              onDelete={() => onDeleteSpot(dayData.day, index)}
              day={dayData.day}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DaySpots;
