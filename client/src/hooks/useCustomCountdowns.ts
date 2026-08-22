import { useState, useEffect } from "react";

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string;
  category: "personal" | "work" | "holiday" | "milestone";
}

export function useCustomCountdowns() {
  const [countdowns, setCountdowns] = useState<CountdownItem[]>(() => {
    const saved = localStorage.getItem("chronos_countdowns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "1",
        title: "New Year Countdown",
        targetDate: `${new Date().getFullYear() + 1}-01-01T00:00`,
        category: "holiday",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("chronos_countdowns", JSON.stringify(countdowns));
  }, [countdowns]);

  const addCountdown = (item: Omit<CountdownItem, "id">) => {
    const newItem: CountdownItem = { ...item, id: Date.now().toString() };
    setCountdowns((prev) => [...prev, newItem]);
  };

  const removeCountdown = (id: string) => {
    setCountdowns((prev) => prev.filter((item) => item.id !== id));
  };

  return { countdowns, addCountdown, removeCountdown };
}
