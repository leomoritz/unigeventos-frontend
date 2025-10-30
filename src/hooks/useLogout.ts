import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/services/authService";
import { toast } from "react-toastify";
import CookieManager from "@/lib/cookieManager";

export const useLogout = () => {
  const router = useRouter();
  const pathname = usePathname();

  const performLogout = async () => {
    try {
      // Buscar refreshToken dos cookies (prioridade) ou localStorage (fallback)
      let refreshToken = CookieManager.get("refreshToken");
      if (!refreshToken) {
        refreshToken = localStorage.getItem("refreshToken");
      }
      
      // Chamar endpoint de logout
      await logout(refreshToken || undefined);

      // Limpar localStorage (fallback/legado)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRoles");
      
      // Exibir mensagem de sucesso
      toast.success("Logout realizado com sucesso!");
      
      // Aguardar um momento para o toast aparecer antes de redirecionar
      setTimeout(() => {
        // Se já estiver na página de eventos, apenas recarregar
          if (pathname === "/events" || pathname === "/") {
            window.location.reload();
          return;
        }
        // Redirecionar para a página inicial
        router.push("/");
      }, 200);

    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      
      // Mesmo com erro na API, limpar tokens localmente
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Exibir mensagem de erro mas ainda redirecionar
      toast.error("Erro ao fazer logout, mas você foi desconectado localmente");
      
      setTimeout(() => {
        router.push("/events");
      }, 1500);
    }
  };

  return { performLogout };
};