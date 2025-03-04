
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const TripFormStepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="relative mb-10">
      {/* Progress bar */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2">
        <div
          className="h-full bg-voyage-500 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center"
              onClick={() => onStepClick && onStepClick(index)}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full z-10 transition-all duration-300 cursor-pointer",
                  isCompleted
                    ? "bg-voyage-500 text-white"
                    : isActive
                    ? "bg-white text-voyage-500 border-2 border-voyage-500 shadow-md"
                    : "bg-white text-gray-400 border-2 border-gray-200"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium whitespace-nowrap",
                  isActive || isCompleted
                    ? "text-voyage-700"
                    : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripFormStepper;
