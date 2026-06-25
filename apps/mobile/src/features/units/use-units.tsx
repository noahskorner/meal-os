import { webApiClient } from "@/lib/web-api-client";
import { listUnits, type ListUnitsResponse } from "@repo/web-api-client";
import * as React from "react";

type UnitsContextValue = {
  units: ListUnitsResponse;
  isLoading: boolean;
};

const UnitsContext = React.createContext<UnitsContextValue | undefined>(
  undefined,
);

let cachedUnits: ListUnitsResponse | null = null;
let unitsRequest: Promise<ListUnitsResponse> | null = null;

async function loadUnits() {
  if (cachedUnits) {
    return cachedUnits;
  }

  if (!unitsRequest) {
    unitsRequest = listUnits({ client: webApiClient })
      .then(({ data, error }) => {
        if (error || !data) {
          throw new Error("Unable to load units.");
        }

        cachedUnits = data;
        return data;
      })
      .catch((error: unknown) => {
        unitsRequest = null;
        throw error;
      });
  }

  return unitsRequest;
}

export function UnitsProvider({ children }: React.PropsWithChildren) {
  const [units, setUnits] = React.useState<ListUnitsResponse>(cachedUnits ?? []);
  const [isLoading, setIsLoading] = React.useState(cachedUnits === null);

  React.useEffect(() => {
    if (cachedUnits) {
      return;
    }

    let isMounted = true;

    void loadUnits()
      .then((nextUnits) => {
        if (!isMounted) {
          return;
        }

        setUnits(nextUnits);
      })
      .catch((error: unknown) => {
        console.error("Error loading units:", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = React.useMemo<UnitsContextValue>(
    () => ({
      units,
      isLoading,
    }),
    [isLoading, units],
  );

  return (
    <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
  );
}

export function useUnits() {
  const value = React.useContext(UnitsContext);

  if (!value) {
    throw new Error("useUnits must be used within a UnitsProvider.");
  }

  return value;
}
