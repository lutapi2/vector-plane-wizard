import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useSaveCalculation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const saveCalculation = async (
    operationType: string,
    inputData: any,
    resultData: any
  ) => {
    if (!user) return;

    const { error } = await supabase.from("calculation_history").insert({
      user_id: user.id,
      operation_type: operationType,
      input_data: inputData,
      result_data: resultData,
    });

    if (error) {
      console.error("Error saving calculation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el cálculo en el historial.",
      });
    }
  };

  return { saveCalculation };
};
