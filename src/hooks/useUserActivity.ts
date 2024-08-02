import useLocalStorage from "./useLocalStorage";

const useUserActivity = () => {
    const [userActivity, setUserActivity] =  useLocalStorage<{ [key: string]: number }>('userActivity', {});

    const logVisit = (websiteId: string) => {
        setUserActivity((prevActivity) => {
            const newActivity = { ...prevActivity };
            newActivity[websiteId] = (newActivity[websiteId] || 0) + 1;

            return newActivity;
        });
    }

    return {userActivity, logVisit};
};

export default useUserActivity;