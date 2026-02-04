import { Profiler, useState, type ProfilerOnRenderCallback } from "react";

export const ProfilerLab = () => {
    return (
        <>
            <h2>Profiler Lab</h2>
            <MeasuringRenderingPerformanceProgrammatically />
        </>
    );
};

const ProfiledComponent = () => {
    const [input, setInput] = useState('');

    const on_change = (input: React.ChangeEvent<HTMLInputElement>) => setInput(input.target.value);

    return <input value={input} onChange={on_change} />;
};

const MeasuringRenderingPerformanceProgrammatically = () => {
    const on_render: ProfilerOnRenderCallback = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
    ) => {
        console.log('onRender is: ', { id, phase, actualDuration, baseDuration, startTime, commitTime });
    };

    return (
        <>
            <h3>Measuring rendering performance programmatically</h3>
            <Profiler id="profiling-lab" onRender={on_render}>
                <ProfiledComponent />
            </Profiler>
        </>
    );
};