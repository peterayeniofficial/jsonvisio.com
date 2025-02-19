import React from "react";
import { defaultConfig, defaultJson } from "src/constants/data";
import {
  ConfigActionType,
  ReducerAction,
  useConfigReducer,
} from "src/reducer/reducer";
import { ReactComponent, StorageConfig } from "src/typings/global";

export interface AppConfig {
  json: string;
  settings: StorageConfig;
}

export const initialStates: AppConfig = {
  json: JSON.stringify(defaultJson),
  settings: defaultConfig,
};

interface Config {
  states: AppConfig;
  dispatch: React.Dispatch<ReducerAction>;
}

const defaultContext: Config = {
  states: initialStates,
  dispatch: () => {},
};

const ConfigContext: React.Context<Config> =
  React.createContext(defaultContext);

const useConfig = () => React.useContext(ConfigContext);

const WithConfig: ReactComponent = ({ children }) => {
  const [render, setRender] = React.useState(false);
  const [states, dispatch] = React.useReducer(useConfigReducer, initialStates);
  const value = { states, dispatch };

  React.useEffect(() => {
    const jsonStored = localStorage.getItem("json");
    if (jsonStored)
      dispatch({ type: ConfigActionType.SET_JSON, payload: jsonStored });

    const configStored = localStorage.getItem("config");
    if (configStored)
      dispatch({
        type: ConfigActionType.SET_CONFIG,
        payload: JSON.parse(configStored),
      });
    setRender(true);
  }, [dispatch]);

  React.useEffect(() => {
    if (render)
      localStorage.setItem(
        "config",
        JSON.stringify({
          ...states.settings,
          zoomPanPinch: undefined,
        })
      );
  }, [states.settings, render]);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

const withConfig = <P extends object>(
  Component: React.ComponentType<P>
): React.FC => {
  return (props) => (
    <WithConfig>
      <Component {...(props as P)} />
    </WithConfig>
  );
};

export { WithConfig, useConfig, ConfigContext, withConfig };
