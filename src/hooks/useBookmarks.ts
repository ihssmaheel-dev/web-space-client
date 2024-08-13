import { useEffect, useRef, useState } from "react";
import { useToast } from "../contexts/ToastContexts"
import { parseChromeBookmarks } from "../utils/parseChromeBookmarks";
import { CategoryI } from "../types";

const useBookmarks = (setCategories: React.Dispatch<React.SetStateAction<CategoryI[]>>) => {
    const { showToast } = useToast();
    const syncTimeout = useRef<NodeJS.Timeout | null>(null);
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncWrong, setSyncWrong] = useState(false);

    useEffect(() => {
        const handleBookmarkUpdate = async (event: MessageEvent) => {
            if (event.data.type === "CHROME_BOOKMARKS_SYNC") {
                if (syncTimeout.current !== null) {
                    clearTimeout(syncTimeout.current);
                    setSyncWrong(false);
                }

                const { categories } = await parseChromeBookmarks(event.data.bookmarks);
                setCategories(categories);

                showToast("success", "Bookmarks synced with Chrome");
                setSyncLoading(false);
            } else if (event.data.type === "CHROME_BOOKMARK_UPDATED") {
                showToast("success", "Bookmark updated successfully");
                triggerSync();
            } else if (event.data.type === "CHROME_BOOKMARK_DELETED") {
                showToast("success", "Bookmark deleted successfully");
                triggerSync();
            } else if (event.data.type === "CHROME_BOOKMARK_CREATED") {
                showToast("success", "Bookmark created successfully");
                triggerSync();
            }
        };

        window.addEventListener('message', handleBookmarkUpdate);

        return () => {
            window.removeEventListener('message', handleBookmarkUpdate);
            if (syncTimeout.current !== null) {
                clearTimeout(syncTimeout.current);
            }
        };
    }, []);

    const triggerSync = () => {
        setSyncLoading(true);
        setSyncWrong(false);

        syncTimeout.current = setTimeout(() => {
            setSyncWrong(true);
            setSyncLoading(false);
            showToast("error", "Please check the Extension is installed in Chrome");
        }, 4000);

        window.postMessage({ source: "web-space", type: "TRIGGER_CHROME_SYNC" }, "*");
    };

    return { syncLoading, syncWrong, triggerSync };
};

export default useBookmarks;