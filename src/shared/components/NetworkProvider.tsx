import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HttpClient } from "@/core/network/HttpClient";

export function NetworkProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  useEffect(() => {
    HttpClient.getInstance().configureAuthFailureHandler(() => {
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  return <>{children}</>;
}
