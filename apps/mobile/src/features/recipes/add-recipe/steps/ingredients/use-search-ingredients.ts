import { webApiClient } from "@/lib/web-api-client";
import { useEffect } from "react";

export function useSearchIngredients() {
    useEffect(() => {
    let isMounted = true;

    async function loadIngredients() {
        const { data, error } = await webApiClient.GET("/api/ingredients", {
        params: {
            query: {
            page: 1,
            pageSize: 20,
            },
        },
        });

        if (!isMounted) {
        return;
        }

        if (error) {
        console.error("Failed to load ingredients from web API.", error);
        return;
        }

        console.log("Loaded ingredients from web API.", data.items);
    }
    

    void loadIngredients();

    return () => {
        isMounted = false;
    };
    }, []);
}