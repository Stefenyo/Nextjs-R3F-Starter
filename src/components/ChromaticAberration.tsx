import React, { useMemo, type FC } from "react";
import { ChromaticAberrationEffect } from "postprocessing";

// Replacement for the built-in effect from @react-three/postprocessing, which is just a thin wrapper around the raw effect and doesn't support all of its features. By creating our own wrapper, we can expose the full range of options and use it more flexibly in our scene.
// A thin wrapper around the postprocessing effect to make it easier to use as a React component.
// This is necessary because r3f's <EffectComposer> expects its children to be React components, not raw effect instances. By wrapping the effect in a component, we can use it declaratively in our JSX and still have access to all of its props and methods.

type ChromaticAberrationOptions = NonNullable<
  ConstructorParameters<typeof ChromaticAberrationEffect>[0]
>;

interface Props extends ChromaticAberrationOptions {
  ref?: React.Ref<ChromaticAberrationEffect>;
}

const ChromaticAberration: FC<Props> = ({
  blendFunction,
  offset,
  radialModulation,
  modulationOffset,
  ref,
}) => {
  const effect = useMemo(
    () =>
      new ChromaticAberrationEffect({
        blendFunction,
        offset,
        radialModulation,
        modulationOffset,
      }),
    [blendFunction, offset, radialModulation, modulationOffset],
  );

  return <primitive ref={ref} object={effect} />;
};

export { ChromaticAberration };
