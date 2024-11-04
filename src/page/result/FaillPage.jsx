import React, { useState } from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

const FailPage = () => {
  // State to manage the current step index
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 if none of the stages are completed

  // Function to move to the next step
  const completeStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div>
      <Steps current={currentStep}>
        <Step title="Stage A" description="Description of stage A" />
        <Step title="Stage B" description="Description of stage B" />
        <Step title="Stage C" description="Description of stage C" />
        <Step title="Stage D" description="Description of stage D" />
      </Steps>

      {/* Buttons or triggers to complete each stage */}
      <button onClick={() => completeStep(0)}>Complete Stage A</button>
      <button onClick={() => completeStep(1)}>Complete Stage B</button>
      <button onClick={() => completeStep(2)}>Complete Stage C</button>
      <button onClick={() => completeStep(3)}>Complete Stage D</button>
    </div>
  );
};

export default FailPage;
