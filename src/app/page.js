"use client";
import { ProviderStateX } from "@/Context/ProviderStateX";
import App from "./app";
import { ProviderVolverCargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas";
import { ProviderDias } from "@/Context/ProviderDias";
import { ProviderHeaderHotizontal } from "@/Context/ProviderHeaderHotizontal";
export default function Page() {

  return (
    <ProviderHeaderHotizontal>
      <ProviderDias>
        <ProviderVolverCargarTareasFiltradas>
          <ProviderStateX>
            <App />
          </ProviderStateX>
        </ProviderVolverCargarTareasFiltradas>
      </ProviderDias>
    </ProviderHeaderHotizontal>
  );
}
