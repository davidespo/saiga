import React from 'react';

export function useApiData(defaultValue, dataFunc, defaultArgs, pollInterval) {
  const [data, setData] = React.useState(defaultValue);
  const refresh = async (params = defaultArgs) =>
    setData(await dataFunc(params));
  React.useEffect(
    () => {
      refresh();
      if (pollInterval > 0) {
        const handle = setInterval(refresh.bind(this), pollInterval);
        return () => clearInterval(handle);
      }
    },
    // eslint-disable-next-line
    [],
  );
  return [data, refresh, setData];
}

export function useToggle(defaultValue = true) {
  const [value, setValue] = React.useState(defaultValue);
  return [value, () => setValue(!value), setValue];
}
