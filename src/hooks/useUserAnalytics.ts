import { useState, useEffect } from "react";
import { 
  getUserActiveRegistrationsCount,
  getUserPendingPayments,
  getUserEventsParticipationCount,
  UserPaymentCountResponse
} from "@/services/analyticsService";

interface UserAnalytics {
  activeRegistrations: number;
  pendingPayments: UserPaymentCountResponse;
  completedEvents: number;
}

export const useUserAnalytics = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    activeRegistrations: 0,
    pendingPayments: { count: 0, totalAmount: 0 },
    completedEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("=== FETCHING USER ANALYTICS ===");
      
      // Buscar todos os dados em paralelo
      const [activeRegistrations, pendingPayments, completedEvents] = await Promise.all([
        getUserActiveRegistrationsCount(),
        getUserPendingPayments(),
        getUserEventsParticipationCount()
      ]);

      const analyticsData = {
        activeRegistrations,
        pendingPayments,
        completedEvents
      };

      console.log("=== USER ANALYTICS LOADED ===", analyticsData);
      
      setAnalytics(analyticsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados de analytics";
      setError(errorMessage);
      console.error("=== ERROR FETCHING USER ANALYTICS ===", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refreshAnalytics
  };
};