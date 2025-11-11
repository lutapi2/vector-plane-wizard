import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CalculationRecord {
  id: string;
  operation_type: string;
  input_data: any;
  result_data: any;
  created_at: string;
}

export const CalculationHistory = () => {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("calculation_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar historial",
        description: error.message,
      });
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase
      .from("calculation_history")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.message,
      });
    } else {
      toast({
        title: "Eliminado",
        description: "Cálculo eliminado del historial.",
      });
      loadHistory();
    }
  };

  const getOperationLabel = (type: string) => {
    const labels: Record<string, string> = {
      magnitude: "Magnitud",
      sum: "Suma de vectores",
      dot_product: "Producto punto",
      cross_product: "Producto cruz",
      cable_tension: "Tensión en cables",
      structure_analysis: "Análisis estructural",
      field_analysis: "Análisis de campo",
      robot_trajectory: "Trayectoria robótica",
    };
    return labels[type] || type;
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="p-4 bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Historial de Cálculos</h3>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay cálculos en el historial
        </p>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-3 bg-secondary/30 rounded-lg border border-border"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-accent">
                    {getOperationLabel(record.operation_type)}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecord(record.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 font-mono">
                  <div>
                    <span className="font-semibold">Entrada:</span>{" "}
                    {JSON.stringify(record.input_data).substring(0, 100)}...
                  </div>
                  <div>
                    <span className="font-semibold">Resultado:</span>{" "}
                    {JSON.stringify(record.result_data).substring(0, 100)}...
                  </div>
                  <div className="text-xs opacity-70 pt-1">
                    {new Date(record.created_at).toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
